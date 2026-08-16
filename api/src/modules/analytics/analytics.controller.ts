import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Cross-Platform Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Get cross-platform metrics overview
   */
  @Get('overview')
  @ApiOperation({ summary: 'Get aggregated impressions, reach, clicks, and platform distribution' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'timeframe', required: false, enum: ['7d', '30d', '90d'] })
  getOverview(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
    @Query('timeframe') timeframe?: string,
  ) {
    return this.analyticsService.getOverview(workspaceId, userId, timeframe || '30d');
  }

  /**
   * Get engagement & impression trends over time
   */
  @Get('trends')
  @ApiOperation({ summary: 'Get historical impressions, engagements, and clicks time-series' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getTrends(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getTrends(workspaceId, userId, days ? Number(days) : 7);
  }

  /**
   * Get audience geography breakdown
   */
  @Get('geography')
  @ApiOperation({ summary: 'Get global audience geography and reach breakdown' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getGeography(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.analyticsService.getGeography(workspaceId, userId);
  }

  /**
   * Get audience sentiment analysis
   */
  @Get('sentiment')
  @ApiOperation({ summary: 'Get sentiment scores, positive/negative breakdown, and top themes' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getSentiment(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.analyticsService.getSentiment(workspaceId, userId);
  }

  /**
   * Get AI-recommended best times to post
   */
  @Get('best-time-to-post')
  @ApiOperation({ summary: 'Get AI recommended publishing windows per platform' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getBestTimeToPost(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.analyticsService.getBestTimeToPost(workspaceId, userId);
  }
}
