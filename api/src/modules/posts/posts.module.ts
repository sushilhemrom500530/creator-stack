import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/post.schema';
import { Workspace, WorkspaceSchema } from '../workspaces/schemas/workspace.schema';
import { SocialAccount, SocialAccountSchema } from '../social-accounts/schemas/social-account.schema';
import { PublishingModule } from '../publishing/publishing.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: SocialAccount.name, schema: SocialAccountSchema },
    ]),
    forwardRef(() => PublishingModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, MongooseModule],
})
export class PostsModule {}
