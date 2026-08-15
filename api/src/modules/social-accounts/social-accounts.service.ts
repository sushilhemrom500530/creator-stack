import {
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SocialAccount,
  SocialAccountDocument,
  SocialAccountStatus,
  SocialPlatform,
} from './schemas/social-account.schema';
import { ConnectAccountDto, UpdateAccountDto } from './dto';
import { encryptToken, decryptToken, generateOAuthState, validateOAuthState } from 'src/common/utils';
import { Workspace, WorkspaceDocument } from '../workspaces/schemas/workspace.schema';
import { SocialProviderFactory } from 'src/providers/social/social-provider.factory';

@Injectable()
export class SocialAccountsService {
  private readonly logger = new Logger(SocialAccountsService.name);

  constructor(
    @InjectModel(SocialAccount.name) private readonly socialAccountModel: Model<SocialAccountDocument>,
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
    private readonly socialProviderFactory: SocialProviderFactory,
  ) {}

  /**
   * Verifies that the user has permission to manage accounts in this workspace.
   */
  async verifyWorkspaceAccess(workspaceId: string, userId: string): Promise<WorkspaceDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const workspace = await this.workspaceModel.findOne({
      _id: new Types.ObjectId(workspaceId),
      $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
      isDeleted: false,
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace access denied or workspace does not exist.');
    }
    return workspace;
  }

  /**
   * PHASE 04: Generates the OAuth Authorization URL with CSRF-protected signed state token.
   */
  async getAuthorizationUrl(
    platform: SocialPlatform,
    workspaceId: string,
    userId: string,
    redirectUri?: string,
  ): Promise<{ authUrl: string; state: string; platform: SocialPlatform }> {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    if (!this.socialProviderFactory.hasProvider(platform)) {
      throw new BadRequestException(`Platform '${platform}' provider is not yet implemented or configured.`);
    }

    const state = generateOAuthState({
      userId,
      workspaceId,
      platform,
    });

    const provider = this.socialProviderFactory.getProvider(platform);
    const authUrl = provider.getAuthorizationUrl(state, redirectUri);

    this.logger.log(`Generated OAuth authorization URL for [${platform}] in workspace ${workspaceId}`);
    return { authUrl, state, platform };
  }

  /**
   * PHASE 04: Validates OAuth callback state, exchanges code for tokens, and connects the account.
   */
  async handleOAuthCallback(
    platform: SocialPlatform,
    code: string,
    state: string,
    currentUserId?: string,
  ): Promise<SocialAccountDocument> {
    const statePayload = validateOAuthState(state);

    if (statePayload.platform !== platform) {
      throw new BadRequestException(`OAuth state platform mismatch: expected '${platform}', got '${statePayload.platform}'.`);
    }

    const userId = currentUserId || statePayload.userId;
    const workspaceId = statePayload.workspaceId;

    await this.verifyWorkspaceAccess(workspaceId, userId);

    const provider = this.socialProviderFactory.getProvider(platform);
    const tokenResult = await provider.exchangeCode(code);
    const profile = await provider.getAccount(tokenResult.accessToken);

    return this.connect(userId, {
      workspaceId,
      platform,
      platformAccountId: profile.platformAccountId,
      accountName: profile.accountName,
      username: profile.username,
      profilePictureUrl: profile.profilePictureUrl,
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
      tokenExpiresAt: tokenResult.tokenExpiresAt ? tokenResult.tokenExpiresAt.toISOString() : undefined,
      scopes: tokenResult.scopes || [],
      metadata: { ...profile.metadata, ...tokenResult.metadata },
    });
  }

  /**
   * Connects or reconnects a social account with encrypted tokens at rest.
   */
  async connect(userId: string, dto: ConnectAccountDto): Promise<SocialAccountDocument> {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const accessTokenEncrypted = encryptToken(dto.accessToken);
    const refreshTokenEncrypted = dto.refreshToken ? encryptToken(dto.refreshToken) : undefined;

    const existing = await this.socialAccountModel.findOne({
      workspaceId: new Types.ObjectId(dto.workspaceId),
      platformAccountId: dto.platformAccountId,
      platform: dto.platform,
      isDeleted: false,
    });

    if (existing) {
      existing.accountName = dto.accountName;
      existing.username = dto.username || existing.username;
      existing.profilePictureUrl = dto.profilePictureUrl || existing.profilePictureUrl;
      existing.accessTokenEncrypted = accessTokenEncrypted;
      if (refreshTokenEncrypted) existing.refreshTokenEncrypted = refreshTokenEncrypted;
      if (dto.tokenExpiresAt) existing.tokenExpiresAt = new Date(dto.tokenExpiresAt);
      if (dto.scopes) existing.scopes = dto.scopes;
      if (dto.metadata) existing.metadata = { ...existing.metadata, ...dto.metadata };
      existing.status = SocialAccountStatus.ACTIVE;
      existing.lastError = null;
      existing.lastSyncedAt = new Date();

      const updated = await existing.save();
      this.logger.log(`Reconnected social account [${dto.platform}:${dto.platformAccountId}] for workspace ${dto.workspaceId}`);
      return updated;
    }

    const account = new this.socialAccountModel({
      userId: new Types.ObjectId(userId),
      workspaceId: new Types.ObjectId(dto.workspaceId),
      platform: dto.platform,
      platformAccountId: dto.platformAccountId,
      accountName: dto.accountName,
      username: dto.username,
      profilePictureUrl: dto.profilePictureUrl,
      accessTokenEncrypted,
      refreshTokenEncrypted,
      tokenExpiresAt: dto.tokenExpiresAt ? new Date(dto.tokenExpiresAt) : null,
      scopes: dto.scopes || [],
      metadata: dto.metadata || {},
      status: SocialAccountStatus.ACTIVE,
      lastSyncedAt: new Date(),
    });

    const saved = await account.save();
    this.logger.log(`Connected new social account [${dto.platform}:${dto.platformAccountId}] for workspace ${dto.workspaceId}`);
    return saved;
  }

  /**
   * Refreshes an expired or expiring access token using the stored refresh token.
   */
  async refreshAccountToken(accountId: string, userId: string): Promise<SocialAccountDocument> {
    const account = await this.findOne(accountId, userId);

    if (!this.socialProviderFactory.hasProvider(account.platform)) {
      throw new BadRequestException(`Provider for platform '${account.platform}' is not configured.`);
    }

    const provider = this.socialProviderFactory.getProvider(account.platform);
    if (!provider.refreshToken) {
      throw new BadRequestException(`Platform '${account.platform}' does not support automatic token refresh.`);
    }

    if (!account.refreshTokenEncrypted) {
      account.status = SocialAccountStatus.NEEDS_REAUTH;
      await account.save();
      throw new BadRequestException('No refresh token available for this account. Re-authorization required.');
    }

    try {
      const plainRefreshToken = decryptToken(account.refreshTokenEncrypted);
      const tokenResult = await provider.refreshToken(plainRefreshToken);

      account.accessTokenEncrypted = encryptToken(tokenResult.accessToken);
      if (tokenResult.refreshToken) {
        account.refreshTokenEncrypted = encryptToken(tokenResult.refreshToken);
      }
      if (tokenResult.tokenExpiresAt) {
        account.tokenExpiresAt = tokenResult.tokenExpiresAt;
      }
      account.status = SocialAccountStatus.ACTIVE;
      account.lastError = null;
      account.lastSyncedAt = new Date();

      const saved = await account.save();
      this.logger.log(`Successfully refreshed access token for social account [${account.platform}:${account.platformAccountId}]`);
      return saved;
    } catch (error: any) {
      account.status = SocialAccountStatus.EXPIRED;
      account.lastError = error.message;
      await account.save();
      throw new BadRequestException(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Returns all connected accounts for a workspace (excluding encrypted secrets).
   */
  async findAllByWorkspace(workspaceId: string, userId: string): Promise<SocialAccountDocument[]> {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    return this.socialAccountModel
      .find({
        workspaceId: new Types.ObjectId(workspaceId),
        isDeleted: false,
      })
      .select('-accessTokenEncrypted -refreshTokenEncrypted')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Returns a single connected account by ID.
   */
  async findOne(accountId: string, userId: string): Promise<SocialAccountDocument> {
    const account = await this.socialAccountModel.findOne({
      _id: new Types.ObjectId(accountId),
      isDeleted: false,
    });

    if (!account) {
      throw new NotFoundException('Social account not found');
    }

    await this.verifyWorkspaceAccess(account.workspaceId.toString(), userId);
    return account;
  }

  /**
   * Internal method used by Publishing Workers to retrieve decrypted token.
   * Never exposed via public API controllers.
   */
  async getDecryptedTokens(accountId: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const account = await this.socialAccountModel.findById(accountId);
    if (!account || account.isDeleted) {
      throw new NotFoundException('Social account not found');
    }

    const accessToken = decryptToken(account.accessTokenEncrypted);
    const refreshToken = account.refreshTokenEncrypted ? decryptToken(account.refreshTokenEncrypted) : undefined;

    return { accessToken, refreshToken };
  }

  /**
   * Updates account configuration & automation flags.
   */
  async update(accountId: string, userId: string, updateDto: UpdateAccountDto): Promise<SocialAccountDocument> {
    const account = await this.findOne(accountId, userId);
    Object.assign(account, updateDto);
    return account.save();
  }

  /**
   * Disconnects / revokes an account.
   */
  async disconnect(accountId: string, userId: string): Promise<{ message: string }> {
    const account = await this.findOne(accountId, userId);
    account.isDeleted = true;
    account.status = SocialAccountStatus.REVOKED;
    account.deletedAt = new Date();
    await account.save();

    this.logger.log(`Disconnected social account ${accountId}`);
    return { message: 'Social account disconnected successfully' };
  }

  /**
   * Returns accounts health statistics per workspace.
   */
  async getHealth(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const accounts = await this.socialAccountModel.find({
      workspaceId: new Types.ObjectId(workspaceId),
      isDeleted: false,
    });

    return {
      total: accounts.length,
      active: accounts.filter((a) => a.status === SocialAccountStatus.ACTIVE).length,
      expired: accounts.filter((a) => a.status === SocialAccountStatus.EXPIRED).length,
      error: accounts.filter((a) => a.status === SocialAccountStatus.ERROR).length,
      needsReauth: accounts.filter((a) => a.status === SocialAccountStatus.NEEDS_REAUTH).length,
      accounts: accounts.map((a) => ({
        id: a._id,
        platform: a.platform,
        accountName: a.accountName,
        username: a.username,
        status: a.status,
        tokenExpiresAt: a.tokenExpiresAt,
        lastSyncedAt: a.lastSyncedAt,
        lastError: a.lastError,
      })),
    };
  }
}
