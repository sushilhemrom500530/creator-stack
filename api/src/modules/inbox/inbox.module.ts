import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { Workspace, WorkspaceSchema } from '../workspaces/schemas/workspace.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { SocialAccountsModule } from '../social-accounts/social-accounts.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { InboxService } from './inbox.service';
import { InboxController } from './inbox.controller';
import { FacebookWebhookService } from './facebook-webhook.service';
import { FacebookWebhookController } from './facebook-webhook.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    SocialAccountsModule,
    NotificationsModule,
  ],
  controllers: [InboxController, FacebookWebhookController],
  providers: [InboxService, FacebookWebhookService],
  exports: [InboxService],
})
export class InboxModule {}
