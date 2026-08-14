import { Injectable, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SocialAccount, SocialAccountDocument, SocialAccountStatus } from './schemas/social-account.schema';
import { ConnectAccountDto, UpdateAccountDto } from './dto';
import { encryptToken, decryptToken } from 'src/common/utils/token-encryption.util';
import { Workspace, WorkspaceDocument } from '../workspaces/schemas/workspace.schema';

@Injectable()
export class SocialAccountsService {
  private readonly logger = new Logger(SocialAccountsService.name);

  constructor(
    @InjectModel(SocialAccount.name) private readonly socialAccountModel: Model<SocialAccountDocument>,
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
  ) { }

  private async verifyWorkspaceAccess(workspaceId: string, userId: string): Promise<void> {
    const userObjectId = new Types.ObjectId(userId);
    const workspace = await this.workspaceModel.findOne({
      _id: new Types.ObjectId(workspaceId),
      $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
      isDeleted: false,
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace access denied');
    }
  }

  async connect(userId: string, dto: ConnectAccountDto): Promise<SocialAccountDocument> {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const accessTokenEncrypted = encryptToken(dto.accessToken);
    const refreshTokenEncrypted = dto.refreshToken ? encryptToken(dto.refreshToken) : undefined;

    const existing = await this.socialAccountModel.findOne({
      workspaceId: new Types.ObjectId(dto.workspaceId),
      platformAccountId: dto.platformAccountId,
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
    });

    const saved = await account.save();
    this.logger.log(`Connected new social account [${dto.platform}:${dto.platformAccountId}] for workspace ${dto.workspaceId}`);
    return saved;
  }

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

  async update(accountId: string, userId: string, updateDto: UpdateAccountDto): Promise<SocialAccountDocument> {
    const account = await this.findOne(accountId, userId);
    Object.assign(account, updateDto);
    return account.save();
  }

  async disconnect(accountId: string, userId: string): Promise<{ message: string }> {
    const account = await this.findOne(accountId, userId);
    account.isDeleted = true;
    account.status = SocialAccountStatus.REVOKED;
    account.deletedAt = new Date();
    await account.save();

    this.logger.log(`Disconnected social account ${accountId}`);
    return { message: 'Social account disconnected successfully' };
  }
}
