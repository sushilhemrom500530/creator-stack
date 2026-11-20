import {
  Controller,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PublishingService } from './publishing.service';
import { PostsService } from '../posts/posts.service';
import { CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Publishing Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('publishing')
export class PublishingController {
  constructor(
    private readonly publishingService: PublishingService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  /**
   * Publish a post immediately across all target networks
   */
  @Post('posts/:id/publish-now')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Immediately publish a post across all target networks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Publishing process completed' })
  async publishNow(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    // Throws 404/403 unless the post exists in a workspace the user belongs to.
    await this.postsService.findOne(id, userId);
    return this.publishingService.publishPost(id);
  }

  /**
   * Retry publishing a specific failed target on a post
   */
  @Post('posts/:id/retry-target/:accountId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retry publishing a specific failed target on a post' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Target retry completed' })
  async retryTarget(
    @Param('id') postId: string,
    @Param('accountId') accountId: string,
    @CurrentUser('userId') userId: string,
  ) {
    await this.postsService.findOne(postId, userId);
    return this.publishingService.retryTarget(postId, accountId, userId);
  }
}
