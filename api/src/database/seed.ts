import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserSchema } from '../modules/users/schemas/user.schema';
import { WorkspaceSchema, WorkspaceRole } from '../modules/workspaces/schemas/workspace.schema';
import { Role, Status } from '../common';

const UserModel = mongoose.model('User', UserSchema);
const WorkspaceModel = mongoose.model('Workspace', WorkspaceSchema);

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB successfully.\n');

  const adminEmail = (process.env.ADMIN_EMAIL || 'sushil@gmail.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Sushil@123!';
  const commonPassword = process.env.COMMON_PASSWORD || 'Sushil@123!';

  const seedUsers = [
    {
      name: 'Sushil Hemrom',
      email: adminEmail,
      rawPassword: adminPassword,
      roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER],
      status: Status.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Founder & Full-Stack Platform Engineer at CreatorStack.',
      workspaceName: "Sushil's Primary Workspace",
      workspaceSlug: 'sushil-primary-workspace',
      workspaceDesc: 'Master platform management and analytics workspace.',
      type: 'Super Admin',
    },
    {
      name: 'Alex Johnson',
      email: 'user@gmail.com',
      rawPassword: commonPassword,
      roles: [Role.CREATOR, Role.USER],
      status: Status.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Tech YouTuber & Software Educator building digital products.',
      workspaceName: "Alex's Creator Studio",
      workspaceSlug: 'alex-creator-studio',
      workspaceDesc: 'Omnichannel content publishing hub for tech tutorials.',
      type: 'Creator',
    },
    {
      name: 'Sarah Miller',
      email: 'sarah@creatorstack.io',
      rawPassword: commonPassword,
      roles: [Role.CREATOR, Role.USER],
      status: Status.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'Fashion, beauty, and sustainable lifestyle influencer (120K followers).',
      workspaceName: "Sarah's Fashion Media",
      workspaceSlug: 'sarah-fashion-media',
      workspaceDesc: 'Visual storytelling across Instagram, Threads, and Pinterest.',
      type: 'Creator',
    },
    {
      name: 'David Chen',
      email: 'david@creatorstack.io',
      rawPassword: commonPassword,
      roles: [Role.USER],
      status: Status.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'B2B SaaS Growth Marketer specializing in viral LinkedIn strategies.',
      workspaceName: "David's Workspace",
      workspaceSlug: 'david-workspace',
      workspaceDesc: 'Lead generation and omnichannel community growth.',
      type: 'Standard User',
    },
    {
      name: 'Emma Watson',
      email: 'emma.watson@creatorstack.io',
      rawPassword: commonPassword,
      roles: [Role.CREATOR, Role.USER],
      status: Status.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Travel photographer and nomadic storyteller exploring 40+ countries.',
      workspaceName: 'Wanderlust Media Co.',
      workspaceSlug: 'wanderlust-media-co',
      workspaceDesc: 'Travel guides, reels, and episodic long-form stories.',
      type: 'Creator',
    },
    {
      name: 'Marcus Vance',
      email: 'marcus.vance@creatorstack.io',
      rawPassword: commonPassword,
      roles: [Role.CREATOR, Role.USER],
      status: Status.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Certified Nutrition Coach & Strength Specialist helping 5,000+ athletes.',
      workspaceName: 'Vance Performance Hub',
      workspaceSlug: 'vance-performance-hub',
      workspaceDesc: 'Daily fitness motivators, meal planning schedules, and shorts.',
      type: 'Creator',
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@creatorstack.io',
      rawPassword: commonPassword,
      roles: [Role.CREATOR, Role.USER],
      status: Status.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'AI researcher and newsletter author with 45K weekly subscribers.',
      workspaceName: 'AI Frontier Digest',
      workspaceSlug: 'ai-frontier-digest',
      workspaceDesc: 'Curated AI news threads and video breakdown scheduling.',
      type: 'Creator',
    },
    {
      name: 'Lucas Silva',
      email: 'lucas.silva@creatorstack.io',
      rawPassword: commonPassword,
      roles: [Role.ADMIN, Role.USER],
      status: Status.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      bio: 'Managing Director at Apex Digital Agency managing 15 brand accounts.',
      workspaceName: 'Apex Digital Agency',
      workspaceSlug: 'apex-digital-agency',
      workspaceDesc: 'Multi-brand client campaigns and social publishing pipeline.',
      type: 'Agency Admin',
    },
    {
      name: 'Liam Cooper (Demo Suspended)',
      email: 'suspended.demo@creatorstack.io',
      rawPassword: commonPassword,
      roles: [Role.USER],
      status: Status.SUSPENDED,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      bio: 'Demo account for testing administrator moderation & suspension policies.',
      workspaceName: "Liam's Inactive Space",
      workspaceSlug: 'liams-inactive-space',
      workspaceDesc: 'Restricted workspace for testing moderation states.',
      type: 'Blocked User',
    },
  ];

  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('🚀 SEEDING USERS & WORKSPACES');
  console.log('─────────────────────────────────────────────────────────────────────────────');

  for (const userData of seedUsers) {
    let user = await UserModel.findOne({ email: userData.email });

    if (user) {
      console.log(`ℹ️  User [${userData.email}] already exists. Verifying profile & roles...`);

      let updated = false;
      if (userData.roles.includes(Role.ADMIN) && !user.roles.includes(Role.ADMIN)) {
        user.roles = userData.roles;
        updated = true;
      }
      if (userData.avatar && !user.avatar) {
        user.avatar = userData.avatar;
        updated = true;
      }
      if (userData.bio && !user.bio) {
        user.bio = userData.bio;
        updated = true;
      }
      if (updated) {
        await user.save();
        console.log(`   └─ Refreshed profile data for [${userData.email}]`);
      }
    } else {
      const hashedPassword = await bcrypt.hash(userData.rawPassword, 10);
      user = new UserModel({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        roles: userData.roles,
        status: userData.status,
        avatar: userData.avatar,
        bio: userData.bio,
        lastLoginAt: new Date(),
        isDeleted: false,
      });
      await user.save();
      console.log(`✨ Created User: ${userData.name} (${userData.email}) [${userData.type}]`);
    }

    // Ensure Workspace exists for this user (lookup by owner, member, or slug)
    let workspace = await WorkspaceModel.findOne({
      $or: [
        { ownerId: user._id },
        { 'members.userId': user._id },
        { slug: userData.workspaceSlug },
      ],
    });

    if (workspace) {
      let workspaceUpdated = false;

      // Restore if soft-deleted
      if (workspace.isDeleted) {
        workspace.isDeleted = false;
        workspace.deletedAt = null;
        workspaceUpdated = true;
      }

      // Ensure ownership
      if (!workspace.ownerId || workspace.ownerId.toString() !== user._id.toString()) {
        workspace.ownerId = user._id;
        workspaceUpdated = true;
      }

      // Ensure user is in members list with OWNER role
      const memberIndex = workspace.members.findIndex(
        (m: any) => m.userId && m.userId.toString() === user._id.toString()
      );
      if (memberIndex === -1) {
        workspace.members.push({
          userId: user._id,
          role: WorkspaceRole.OWNER,
          joinedAt: new Date(),
        });
        workspaceUpdated = true;
      } else if (workspace.members[memberIndex].role !== WorkspaceRole.OWNER) {
        workspace.members[memberIndex].role = WorkspaceRole.OWNER;
        workspaceUpdated = true;
      }

      if (workspaceUpdated) {
        await workspace.save();
        console.log(`   └─ Updated & linked Workspace: "${workspace.name}" (slug: ${workspace.slug})`);
      } else {
        console.log(`   └─ Workspace linked: "${workspace.name}" (ID: ${workspace._id})`);
      }
    } else {
      workspace = new WorkspaceModel({
        name: userData.workspaceName,
        slug: userData.workspaceSlug,
        description: userData.workspaceDesc,
        ownerId: user._id,
        members: [
          {
            userId: user._id,
            role: WorkspaceRole.OWNER,
            joinedAt: new Date(),
          },
        ],
        settings: {
          timezone: 'UTC',
          autoPublish: true,
          autoSyncAnalytics: true,
        },
      });
      await workspace.save();
      console.log(`   └─ Created Primary Workspace: "${userData.workspaceName}" (slug: ${userData.workspaceSlug})`);
    }
  }

  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('\n📋 AVAILABLE LOGIN CREDENTIALS:');
  console.log('  👑 Super Admin:');
  console.log(`     Email:    ${adminEmail}`);
  console.log(`     Password: ${adminPassword}`);
  console.log(`     Roles:    [super_admin, admin, user]\n`);
  console.log('  🎨 Demo Creators & Users (Common Password: ' + commonPassword + '):');
  seedUsers
    .filter((u) => u.email !== adminEmail)
    .forEach((u, idx) => {
      console.log(`     ${idx + 1}. ${u.name.padEnd(20)}: ${u.email} (${u.type})`);
    });
  console.log('─────────────────────────────────────────────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
