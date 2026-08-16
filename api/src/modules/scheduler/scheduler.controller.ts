import {
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Scheduler & Workers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  /**
   * Manually trigger processing of due scheduled posts
   */
  @Post('trigger-due-posts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger processing of due scheduled posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Scheduled posts processed' })
  async triggerDuePosts() {
    const processed = await this.schedulerService.processDueScheduledPosts();
    return {
      message: `Processed ${processed} scheduled posts.`,
      processedCount: processed,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get scheduler status
   */
  @Get('status')
  @ApiOperation({ summary: 'Get current status of background scheduling workers' })
  getStatus() {
    return {
      status: 'active',
      interval: '30s',
      tokenCheckInterval: '24h',
      timestamp: new Date().toISOString(),
    };
  }
}
