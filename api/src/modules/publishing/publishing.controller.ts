import {
  Controller,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PublishingService } from './publishing.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Publishing Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('publishing')
export class PublishingController {
  constructor(private readonly publishingService: PublishingService) {}

  /**
   * Publish a post immediately across all target networks
   */
  @Post('posts/:id/publish-now')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Immediately publish a post across all target networks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Publishing process completed' })
  publishNow(
    @Param('id') id: string,
  ) {
    return this.publishingService.publishPost(id);
  }

  /**
   * Retry publishing a specific failed target on a post
   */
  @Post('posts/:id/retry-target/:accountId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retry publishing a specific failed target on a post' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Target retry completed' })
  retryTarget(
    @Param('id') postId: string,
    @Param('accountId') accountId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.publishingService.retryTarget(postId, accountId, userId);
  }
}
