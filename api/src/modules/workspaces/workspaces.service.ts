import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace, WorkspaceDocument, WorkspaceRole } from './schemas/workspace.schema';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteMemberDto } from './dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class WorkspacesService {
  private readonly logger = new Logger(WorkspacesService.name);

  constructor(
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) { }

  private generateSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${randomSuffix}`;
  }

  async create(userId: string, createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceDocument> {
    const slug = createWorkspaceDto.slug
      ? createWorkspaceDto.slug.toLowerCase().trim()
      : this.generateSlug(createWorkspaceDto.name);

    const existingSlug = await this.workspaceModel.findOne({ slug, isDeleted: false });
    if (existingSlug) {
      throw new ConflictException(`Workspace slug '${slug}' already exists`);
    }

    const workspace = new this.workspaceModel({
      ...createWorkspaceDto,
      slug,
      ownerId: new Types.ObjectId(userId),
      members: [
        {
          userId: new Types.ObjectId(userId),
          role: WorkspaceRole.OWNER,
          joinedAt: new Date(),
        },
      ],
    });

    const saved = await workspace.save();
    this.logger.log(`Workspace '${saved.name}' (${saved._id}) created by user ${userId}`);
    return saved;
  }

  async findAllForUser(userId: string): Promise<WorkspaceDocument[]> {
    const userObjectId = new Types.ObjectId(userId);
    let workspaces = await this.workspaceModel
      .find({
        $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .populate('members.userId', 'name email avatar')
      .exec();

    // Auto-create default workspace if user doesn't have one yet
    if (!workspaces || workspaces.length === 0) {
      const user = await this.userModel.findById(userId);
      const defaultName = user?.name ? `${user.name}'s Workspace` : 'My Brand Workspace';
      await this.create(userId, { name: defaultName });
      workspaces = await this.workspaceModel
        .find({
          $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
          isDeleted: false,
        })
        .sort({ createdAt: -1 })
        .populate('members.userId', 'name email avatar')
        .exec();
    }

    return workspaces;
  }

  async findOne(workspaceId: string, userId: string): Promise<WorkspaceDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const workspace = await this.workspaceModel
      .findOne({
        _id: new Types.ObjectId(workspaceId),
        $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
        isDeleted: false,
      })
      .populate('members.userId', 'name email avatar')
      .exec();

    if (!workspace) {
      throw new NotFoundException('Workspace not found or access denied');
    }

    return workspace;
  }

  async update(workspaceId: string, userId: string, updateDto: UpdateWorkspaceDto): Promise<WorkspaceDocument> {
    const workspace = await this.findOne(workspaceId, userId);

    const isOwnerOrAdmin =
      workspace.ownerId.toString() === userId ||
      workspace.members.some((m) => m.userId?.toString() === userId && [WorkspaceRole.OWNER, WorkspaceRole.ADMIN].includes(m.role));

    if (!isOwnerOrAdmin) {
      throw new ForbiddenException('Only workspace owners or admins can update workspace settings');
    }

    Object.assign(workspace, updateDto);
    return workspace.save();
  }

  async inviteMember(workspaceId: string, userId: string, inviteDto: InviteMemberDto): Promise<WorkspaceDocument> {
    const workspace = await this.findOne(workspaceId, userId);

    const isOwnerOrAdmin =
      workspace.ownerId.toString() === userId ||
      workspace.members.some((m) => m.userId?.toString() === userId && [WorkspaceRole.OWNER, WorkspaceRole.ADMIN].includes(m.role));

    if (!isOwnerOrAdmin) {
      throw new ForbiddenException('Only workspace owners or admins can invite members');
    }

    const invitedUser = await this.userModel.findOne({ email: inviteDto.email.toLowerCase().trim(), isDeleted: false });
    if (!invitedUser) {
      throw new NotFoundException(`No registered user found with email '${inviteDto.email}'. The user must register first.`);
    }

    const isAlreadyMember = workspace.members.some((m) => m.userId?.toString() === (invitedUser._id as any).toString());
    if (isAlreadyMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    workspace.members.push({
      userId: invitedUser._id as any,
      role: inviteDto.role,
      joinedAt: new Date(),
    });

    const updated = await workspace.save();

    // Send invitation email notification
    this.mailService.sendEmail({
      to: invitedUser.email,
      subject: `🎉 You've been invited to join "${workspace.name}" on CreatorStack`,
      text: `You have been added to the workspace "${workspace.name}" as an ${inviteDto.role.toUpperCase()}.\n\nLog in to access: https://creatorstack.app`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #7c3aed; margin-top: 0;">Workspace Invitation</h2>
          <p>Hello <strong>${invitedUser.name || invitedUser.email}</strong>,</p>
          <p>You have been invited to collaborate in <strong>${workspace.name}</strong> as an <strong>${inviteDto.role.toUpperCase()}</strong>.</p>
          <div style="margin: 24px 0;">
            <a href="https://creatorstack.app/user/dashboard" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Open Workspace</a>
          </div>
        </div>
      `,
    }).catch((err) => {
      this.logger.warn(`Failed to dispatch workspace invitation email to ${invitedUser.email}: ${err.message}`);
    });

    return updated;
  }

  async updateMemberRole(workspaceId: string, currentUserId: string, memberUserId: string, newRole: WorkspaceRole): Promise<WorkspaceDocument> {
    const workspace = await this.findOne(workspaceId, currentUserId);

    if (workspace.ownerId.toString() !== currentUserId) {
      throw new ForbiddenException('Only the workspace owner can change member roles');
    }

    if (workspace.ownerId.toString() === memberUserId) {
      throw new ForbiddenException('Cannot modify the workspace owner role');
    }

    const member = workspace.members.find((m) => m.userId?.toString() === memberUserId);
    if (!member) {
      throw new NotFoundException('Member not found in this workspace');
    }

    member.role = newRole;
    return workspace.save();
  }

  async removeMember(workspaceId: string, currentUserId: string, memberUserId: string): Promise<WorkspaceDocument> {
    const workspace = await this.findOne(workspaceId, currentUserId);

    if (workspace.ownerId.toString() === memberUserId) {
      throw new ForbiddenException('Cannot remove the workspace owner');
    }

    const isOwnerOrAdmin =
      workspace.ownerId.toString() === currentUserId ||
      workspace.members.some((m) => m.userId?.toString() === currentUserId && [WorkspaceRole.OWNER, WorkspaceRole.ADMIN].includes(m.role));

    if (!isOwnerOrAdmin && currentUserId !== memberUserId) {
      throw new ForbiddenException('Access denied');
    }

    workspace.members = workspace.members.filter((m) => m.userId?.toString() !== memberUserId);
    return workspace.save();
  }

  async remove(workspaceId: string, userId: string): Promise<{ message: string }> {
    const workspace = await this.findOne(workspaceId, userId);

    if (workspace.ownerId.toString() !== userId) {
      throw new ForbiddenException('Only the workspace owner can delete this workspace');
    }

    workspace.isDeleted = true;
    workspace.deletedAt = new Date();
    await workspace.save();

    return { message: 'Workspace deleted successfully' };
  }
}
