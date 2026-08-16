import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublishingController } from './publishing.controller';
import { PublishingService } from './publishing.service';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { SocialAccountsModule } from '../social-accounts/social-accounts.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    SocialAccountsModule,
    NotificationsModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [PublishingController],
  providers: [PublishingService],
  exports: [PublishingService],
})
export class PublishingModule {}
