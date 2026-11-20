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
import { encryptToken, decryptToken, generateOAuthState, validateOAuthState } from '../../common/utils';
import { Workspace, WorkspaceDocument } from '../workspaces/schemas/workspace.schema';
import { SocialProviderFactory } from '../../providers/social/social-provider.factory';
import { SocialAccountContext } from '../../providers/social/social-provider.types';

@Injectable()
export class SocialAccountsService {
  private readonly logger = new Logger(SocialAccountsService.name);

  constructor(
    @InjectModel(SocialAccount.name) private readonly socialAccountModel: Model<SocialAccountDocument>,
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
    private readonly socialProviderFactory: SocialProviderFactory,
  ) { }

  /**
   * Verifies that the user has permission to manage accounts in this workspace.
   * Gracefully resolves or auto-creates user default workspace if workspaceId is 'default-workspace' or invalid.
   */
  async verifyWorkspaceAccess(workspaceId: string, userId: string): Promise<WorkspaceDocument> {
    const userObjectId = new Types.ObjectId(userId);
    let workspace: WorkspaceDocument | null = null;

    if (
      workspaceId &&
      typeof workspaceId === 'string' &&
      workspaceId.length === 24 &&
      Types.ObjectId.isValid(workspaceId) &&
      workspaceId !== 'default-workspace' &&
      workspaceId !== '[object Object]'
    ) {
      workspace = await this.workspaceModel.findOne({
        _id: new Types.ObjectId(workspaceId),
        $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
        isDeleted: false,
      });
    }

    if (!workspace) {
      // Find any active workspace for this user
      workspace = await this.workspaceModel.findOne({
        $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
        isDeleted: false,
      });

      // If user still has no workspace, auto-create one
      if (!workspace) {
        const slug = `workspace-${userId.substring(0, 6)}-${Date.now()}`;
        workspace = new this.workspaceModel({
          name: 'My Workspace',
          slug,
          ownerId: userObjectId,
          members: [
            {
              userId: userObjectId,
              role: 'owner',
              joinedAt: new Date(),
            },
          ],
        });
        await workspace.save();
      }
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
    frontendUrl?: string,
  ): Promise<{ authUrl: string; state: string; platform: SocialPlatform }> {
    const workspace = await this.verifyWorkspaceAccess(workspaceId, userId);

    if (!this.socialProviderFactory.hasProvider(platform)) {
      throw new BadRequestException(`Platform '${platform}' provider is not yet implemented or configured.`);
    }

    const state = generateOAuthState({
      userId,
      workspaceId: workspace._id.toString(),
      platform,
      frontendUrl,
      redirectUri,
    });

    const provider = this.socialProviderFactory.getProvider(platform);
    const authUrl = provider.getAuthorizationUrl(state, redirectUri);

    this.logger.log(`Generated OAuth authorization URL for [${platform}] in workspace ${workspace._id}`);
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
    const tokenResult = await provider.exchangeCode(code, statePayload.redirectUri);
    const profile = await provider.getAccount(tokenResult.accessToken);

    const platformAccountId = profile.platformAccountId || tokenResult.metadata?.instagramUserId || tokenResult.metadata?.pageId || 'unknown';
    const accountName = profile.accountName && profile.accountName !== 'Instagram Business'
      ? profile.accountName
      : tokenResult.metadata?.instagramName || tokenResult.metadata?.instagramUsername || tokenResult.metadata?.pageName || 'Connected Account';
    const username = profile.username || tokenResult.metadata?.instagramUsername;
    const profilePictureUrl = profile.profilePictureUrl || tokenResult.metadata?.profilePicture;

    const account = await this.connect(userId, {
      workspaceId,
      platform,
      platformAccountId,
      accountName,
      username,
      profilePictureUrl,
      followersCount: profile.followersCount,
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
      tokenExpiresAt: tokenResult.tokenExpiresAt ? tokenResult.tokenExpiresAt.toISOString() : undefined,
      scopes: tokenResult.scopes || [],
      metadata: { ...profile.metadata, ...tokenResult.metadata },
    });

    // Post-connect hook (e.g. Facebook webhook subscription). Failures here must not break the connection.
    if (provider.onAccountConnected) {
      try {
        const hookResult = await provider.onAccountConnected(
          this.buildAccountContext(account, tokenResult.accessToken, tokenResult.refreshToken),
        );
        if (hookResult?.metadata) {
          account.metadata = { ...(account.metadata || {}), ...hookResult.metadata };
          account.markModified('metadata');
          await account.save();
        }
      } catch (error: any) {
        this.logger.warn(`Post-connect hook failed for [${platform}:${platformAccountId}]: ${error.message}`);
      }
    }

    return account;
  }

  /**
   * Builds the execution context passed to social providers.
   */
  buildAccountContext(
    account: SocialAccountDocument,
    accessToken: string,
    refreshToken?: string,
  ): SocialAccountContext {
    return {
      accountId: account._id.toString(),
      workspaceId: account.workspaceId.toString(),
      userId: account.userId.toString(),
      platform: account.platform,
      platformAccountId: account.platformAccountId,
      accessToken,
      refreshToken,
      metadata: account.metadata,
    };
  }

  /**
   * Flags an account whose token was rejected by the platform so the user is prompted to reconnect.
   */
  async markNeedsReauth(accountId: string, reason: string): Promise<SocialAccountDocument | null> {
    return this.socialAccountModel.findOneAndUpdate(
      { _id: new Types.ObjectId(accountId), isDeleted: false },
      { $set: { status: SocialAccountStatus.NEEDS_REAUTH, lastError: reason } },
      { new: true },
    );
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
      // A reconnect replaces the token, so its expiry must follow the new token (null = non-expiring).
      existing.tokenExpiresAt = dto.tokenExpiresAt ? new Date(dto.tokenExpiresAt) : null;
      if (dto.scopes) existing.scopes = dto.scopes;
      if (dto.followersCount !== undefined) existing.followersCount = dto.followersCount;
      if (dto.metadata) {
        existing.metadata = { ...existing.metadata, ...dto.metadata };
        existing.markModified('metadata');
      }
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
      followersCount: dto.followersCount ?? 0,
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
      const tokenResult = await provider.refreshToken(plainRefreshToken, {
        platformAccountId: account.platformAccountId,
      });

      account.accessTokenEncrypted = encryptToken(tokenResult.accessToken);
      if (tokenResult.refreshToken) {
        account.refreshTokenEncrypted = encryptToken(tokenResult.refreshToken);
      }
      // undefined = provider did not say; null = token does not expire.
      if (tokenResult.tokenExpiresAt !== undefined) {
        account.tokenExpiresAt = tokenResult.tokenExpiresAt;
      }
      account.status = SocialAccountStatus.ACTIVE;
      account.lastError = null;
      account.lastSyncedAt = new Date();

      // Retry a previously failed post-connect setup (e.g. webhook subscription) with the fresh token.
      // (also covers accounts connected before webhook subscription existed: flag is undefined)
      if (provider.onAccountConnected && account.metadata?.webhooksSubscribed !== true) {
        const hookResult = await provider.onAccountConnected(
          this.buildAccountContext(account, tokenResult.accessToken, tokenResult.refreshToken),
        );
        if (hookResult?.metadata) {
          account.metadata = { ...(account.metadata || {}), ...hookResult.metadata };
          account.markModified('metadata');
        }
      }

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
    const workspace = await this.verifyWorkspaceAccess(workspaceId, userId);

    return this.socialAccountModel
      .find({
        workspaceId: workspace._id,
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

    // Best-effort platform cleanup (e.g. stop Facebook webhooks for this Page).
    if (this.socialProviderFactory.hasProvider(account.platform)) {
      const provider = this.socialProviderFactory.getProvider(account.platform);
      if (provider.onAccountDisconnected && account.accessTokenEncrypted) {
        try {
          await provider.onAccountDisconnected(
            this.buildAccountContext(account, decryptToken(account.accessTokenEncrypted)),
          );
        } catch (error: any) {
          this.logger.warn(`Disconnect hook failed for account ${accountId}: ${error.message}`);
        }
      }
    }

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
