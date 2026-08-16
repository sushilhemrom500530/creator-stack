import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument, PostStatus, PostTargetStatus } from './schemas/post.schema';
import { CreatePostDto, UpdatePostDto, PostFilterDto } from './dto';
import { Workspace, WorkspaceDocument } from '../workspaces/schemas/workspace.schema';
import { SocialAccount, SocialAccountDocument, SocialPlatform } from '../social-accounts/schemas/social-account.schema';
import { PublishingService } from '../publishing/publishing.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(SocialAccount.name) private readonly socialAccountModel: Model<SocialAccountDocument>,
    @Inject(forwardRef(() => PublishingService))
    private readonly publishingService: PublishingService,
  ) {}

  private async verifyWorkspaceAccess(workspaceId: string, userId: string): Promise<WorkspaceDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const workspace = await this.workspaceModel.findOne({
      _id: new Types.ObjectId(workspaceId),
      $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
      isDeleted: false,
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace access denied.');
    }
    return workspace;
  }

  /**
   * Validates platform specific constraints (character counts, required media).
   */
  private validatePlatformConstraints(dto: CreatePostDto) {
    for (const target of dto.targets) {
      const content = target.platformContent || dto.baseContent;
      const media = target.mediaOverrides && target.mediaOverrides.length > 0 ? target.mediaOverrides : (dto.mediaUrls || []);

      if (target.platform === SocialPlatform.X && content.length > 280) {
        throw new BadRequestException(`Content for X (Twitter) exceeds maximum limit of 280 characters (${content.length} characters).`);
      }

      if (target.platform === SocialPlatform.THREADS && content.length > 500) {
        throw new BadRequestException(`Content for Threads exceeds maximum limit of 500 characters (${content.length} characters).`);
      }

      if (target.platform === SocialPlatform.INSTAGRAM && media.length === 0) {
        throw new BadRequestException('Instagram requires at least one image or video to create a post.');
      }
    }
  }

  /**
   * Creates a new Post (Draft, Scheduled, or Direct Publishing Queue).
   */
  async create(userId: string, dto: CreatePostDto): Promise<PostDocument> {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    if (!dto.targets || dto.targets.length === 0) {
      throw new BadRequestException('At least one target social account must be selected.');
    }

    this.validatePlatformConstraints(dto);

    // Verify that all target accounts belong to this workspace
    const accountIds = dto.targets.map((t) => new Types.ObjectId(t.accountId));
    const validAccounts = await this.socialAccountModel.find({
      _id: { $in: accountIds },
      workspaceId: new Types.ObjectId(dto.workspaceId),
      isDeleted: false,
    });

    if (validAccounts.length !== accountIds.length) {
      throw new BadRequestException('One or more selected social accounts do not belong to this workspace or are deleted.');
    }

    // Determine Post Status
    let status = dto.status || PostStatus.DRAFT;
    if (dto.publishNow) {
      status = PostStatus.PUBLISHING;
    } else if (dto.scheduledAt) {
      const scheduleTime = new Date(dto.scheduledAt).getTime();
      if (scheduleTime <= Date.now()) {
        throw new BadRequestException('Scheduled date must be in the future.');
      }
      status = PostStatus.SCHEDULED;
    }

    const postTargets = dto.targets.map((t) => ({
      accountId: new Types.ObjectId(t.accountId),
      platform: t.platform,
      platformContent: t.platformContent,
      mediaOverrides: t.mediaOverrides || [],
      options: t.options || {},
      status: PostTargetStatus.PENDING,
      retryCount: 0,
    }));

    const post = new this.postModel({
      workspaceId: new Types.ObjectId(dto.workspaceId),
      userId: new Types.ObjectId(userId),
      baseContent: dto.baseContent,
      mediaUrls: dto.mediaUrls || [],
      targets: postTargets,
      status,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      tags: dto.tags || [],
      metadata: dto.metadata || {},
    });

    const saved = await post.save();
    this.logger.log(`Created post [${saved._id}] with status [${status}] in workspace ${dto.workspaceId}`);

    if (dto.publishNow) {
      // Dispatches asynchronous multi-platform publishing
      this.publishingService.publishPost(saved._id).catch((err) => {
        this.logger.error(`Error during direct publishing for post [${saved._id}]: ${err.message}`);
      });
    }

    return saved;
  }

  /**
   * Retrieves paginated posts with filters for the active workspace.
   */
  async findAll(userId: string, filterDto: PostFilterDto) {
    await this.verifyWorkspaceAccess(filterDto.workspaceId, userId);

    const query: Record<string, any> = {
      workspaceId: new Types.ObjectId(filterDto.workspaceId),
      isDeleted: false,
    };

    if (filterDto.status) {
      query.status = filterDto.status;
    }

    if (filterDto.platform) {
      query['targets.platform'] = filterDto.platform;
    }

    if (filterDto.search) {
      query.baseContent = { $regex: filterDto.search, $options: 'i' };
    }

    if (filterDto.startDate || filterDto.endDate) {
      query.createdAt = {};
      if (filterDto.startDate) query.createdAt.$gte = new Date(filterDto.startDate);
      if (filterDto.endDate) query.createdAt.$lte = new Date(filterDto.endDate);
    }

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 20;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.postModel
        .find(query)
        .populate('targets.accountId', 'accountName username platform profilePictureUrl status')
        .populate('userId', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(query),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves single post details by ID.
   */
  async findOne(id: string, userId: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ _id: new Types.ObjectId(id), isDeleted: false })
      .populate('targets.accountId', 'accountName username platform profilePictureUrl status')
      .populate('userId', 'name email avatar')
      .exec();

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    await this.verifyWorkspaceAccess(post.workspaceId.toString(), userId);
    return post;
  }

  /**
   * Updates an existing draft or scheduled post.
   */
  async update(id: string, userId: string, dto: UpdatePostDto): Promise<PostDocument> {
    const post = await this.findOne(id, userId);

    if (post.status === PostStatus.PUBLISHING || post.status === PostStatus.PUBLISHED) {
      throw new BadRequestException('Cannot edit a post that is currently publishing or already published.');
    }

    if (dto.baseContent) post.baseContent = dto.baseContent;
    if (dto.mediaUrls) post.mediaUrls = dto.mediaUrls;
    if (dto.status) post.status = dto.status;
    if (dto.scheduledAt) post.scheduledAt = new Date(dto.scheduledAt);
    if (dto.tags) post.tags = dto.tags;
    if (dto.metadata) post.metadata = { ...post.metadata, ...dto.metadata };

    if (dto.targets && dto.targets.length > 0) {
      post.targets = dto.targets.map((t) => ({
        accountId: new Types.ObjectId(t.accountId),
        platform: t.platform,
        platformContent: t.platformContent,
        mediaOverrides: t.mediaOverrides || [],
        options: t.options || {},
        status: PostTargetStatus.PENDING,
        retryCount: 0,
      }));
    }

    return post.save();
  }

  /**
   * Soft-deletes a post.
   */
  async delete(id: string, userId: string): Promise<{ message: string }> {
    const post = await this.findOne(id, userId);
    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    this.logger.log(`Deleted post [${id}]`);
    return { message: 'Post deleted successfully.' };
  }

  /**
   * Summarizes post stats for the dashboard.
   */
  async getSummary(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const wsObjectId = new Types.ObjectId(workspaceId);

    const [total, drafts, scheduled, publishing, published, failed] = await Promise.all([
      this.postModel.countDocuments({ workspaceId: wsObjectId, isDeleted: false }),
      this.postModel.countDocuments({ workspaceId: wsObjectId, status: PostStatus.DRAFT, isDeleted: false }),
      this.postModel.countDocuments({ workspaceId: wsObjectId, status: PostStatus.SCHEDULED, isDeleted: false }),
      this.postModel.countDocuments({ workspaceId: wsObjectId, status: PostStatus.PUBLISHING, isDeleted: false }),
      this.postModel.countDocuments({ workspaceId: wsObjectId, status: PostStatus.PUBLISHED, isDeleted: false }),
      this.postModel.countDocuments({ workspaceId: wsObjectId, status: PostStatus.FAILED, isDeleted: false }),
    ]);

    return {
      total,
      drafts,
      scheduled,
      publishing,
      published,
      failed,
    };
  }

  /**
   * Updates target execution status (used by Publishing Workers).
   */
  async updateTargetStatus(
    postId: string,
    accountId: string,
    update: {
      status: PostTargetStatus;
      externalPostId?: string;
      externalPostUrl?: string;
      errorMessage?: string;
    },
  ): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const target = post.targets.find((t) => t.accountId.toString() === accountId);
    if (target) {
      target.status = update.status;
      if (update.externalPostId) target.externalPostId = update.externalPostId;
      if (update.externalPostUrl) target.externalPostUrl = update.externalPostUrl;
      if (update.errorMessage) target.errorMessage = update.errorMessage;
      if (update.status === PostTargetStatus.PUBLISHED) target.publishedAt = new Date();
    }

    // Determine overall post status
    const allPublished = post.targets.every((t) => t.status === PostTargetStatus.PUBLISHED);
    const anyFailed = post.targets.some((t) => t.status === PostTargetStatus.FAILED);
    const anyPublished = post.targets.some((t) => t.status === PostTargetStatus.PUBLISHED);

    if (allPublished) {
      post.status = PostStatus.PUBLISHED;
      post.publishedAt = new Date();
    } else if (anyFailed && anyPublished) {
      post.status = PostStatus.PARTIALLY_PUBLISHED;
    } else if (anyFailed) {
      post.status = PostStatus.FAILED;
    }

    return post.save();
  }
}
