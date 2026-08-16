import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { SocialAccount, SocialAccountSchema } from '../social-accounts/schemas/social-account.schema';
import { PublishingModule } from '../publishing/publishing.module';
import { SocialAccountsModule } from '../social-accounts/social-accounts.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: SocialAccount.name, schema: SocialAccountSchema },
    ]),
    PublishingModule,
    SocialAccountsModule,
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
