import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { InboxService } from './inbox.service';
import { ListConversationsDto, ListMessagesDto, SendMessageDto } from './dto';

@ApiTags('Inbox (Messenger)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List Messenger conversations for the workspace' })
  listConversations(@CurrentUser('userId') userId: string, @Query() dto: ListConversationsDto) {
    return this.inboxService.listConversations(userId, dto);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Total unread Messenger messages for the workspace' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getUnreadCount(@CurrentUser('userId') userId: string, @Query('workspaceId') workspaceId: string) {
    return this.inboxService.getUnreadCount(userId, workspaceId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages of a conversation (oldest first, paginated backwards)' })
  getMessages(
    @CurrentUser('userId') userId: string,
    @Param('id') conversationId: string,
    @Query() dto: ListMessagesDto,
  ) {
    return this.inboxService.getMessages(userId, conversationId, dto);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Reply to a Messenger conversation from the Page' })
  sendMessage(
    @CurrentUser('userId') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.inboxService.sendReply(userId, conversationId, dto.text);
  }

  @Patch('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a conversation as read' })
  markAsRead(@CurrentUser('userId') userId: string, @Param('id') conversationId: string) {
    return this.inboxService.markAsRead(userId, conversationId);
  }

  @Post('accounts/:accountId/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Import recent Messenger conversations from Facebook' })
  sync(@CurrentUser('userId') userId: string, @Param('accountId') accountId: string) {
    return this.inboxService.syncFacebookConversations(userId, accountId);
  }
}
