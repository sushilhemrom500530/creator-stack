import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AiService } from './ai.service';
import {
  GenerateCaptionDto,
  GenerateHashtagsDto,
  GenerateHooksDto,
  GenerateThreadDto,
  AiChatDto,
} from './dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('AI Content Studio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * Generate tailored social media caption
   */
  @Post('generate-caption')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate platform-tailored social media caption with custom tone' })
  generateCaption(
    @CurrentUser('userId') userId: string,
    @Body() dto: GenerateCaptionDto,
  ) {
    return this.aiService.generateCaption(userId, dto);
  }

  /**
   * Generate niche and trending hashtags
   */
  @Post('generate-hashtags')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate high-ranking hashtags for keywords' })
  generateHashtags(
    @CurrentUser('userId') userId: string,
    @Body() dto: GenerateHashtagsDto,
  ) {
    return this.aiService.generateHashtags(userId, dto);
  }

  /**
   * Generate viral opening hook lines
   */
  @Post('generate-hooks')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate 5 high-converting viral hook lines' })
  generateHooks(
    @CurrentUser('userId') userId: string,
    @Body() dto: GenerateHooksDto,
  ) {
    return this.aiService.generateHooks(userId, dto);
  }

  /**
   * Generate multi-part social thread
   */
  @Post('generate-thread')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Draft a multi-part thread for X / Threads' })
  generateThread(
    @CurrentUser('userId') userId: string,
    @Body() dto: GenerateThreadDto,
  ) {
    return this.aiService.generateThread(userId, dto);
  }

  /**
   * Interactive freeform AI assistant chat
   */
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Interactive brainstorming and copy refinement chat' })
  chat(
    @CurrentUser('userId') userId: string,
    @Body() dto: AiChatDto,
  ) {
    return this.aiService.chat(userId, dto);
  }

  /**
   * Get workspace AI token consumption & quota stats
   */
  @Get('usage/stats')
  @ApiOperation({ summary: 'Get monthly token consumption, remaining quota, and tier stats' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getUsageStats(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.aiService.getUsageStats(workspaceId, userId);
  }

  /**
   * Get workspace AI generation history
   */
  @Get('usage/history')
  @ApiOperation({ summary: 'Get recent AI generation history for the workspace' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUsageHistory(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.aiService.getUsageHistory(workspaceId, userId, limit ? Number(limit) : 20);
  }
}
