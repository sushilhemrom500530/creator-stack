import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, PostFilterDto } from './dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Posts & Publishing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Create a new Post
   */
  @Post()
  @ApiOperation({ summary: 'Create a new post (Draft, Scheduled, or Direct Publishing)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Post created successfully' })
  create(
    @CurrentUser('userId') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(userId, createPostDto);
  }

  /**
   * Get post counts summary
   */
  @Get('summary')
  @ApiOperation({ summary: 'Get post counts summary (draft, scheduled, published, failed)' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getSummary(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.postsService.getSummary(workspaceId, userId);
  }

  /**
   * Get all posts with filtering & pagination
   */
  @Get()
  @ApiOperation({ summary: 'Get all posts for a workspace with pagination and filters' })
  findAll(
    @CurrentUser('userId') userId: string,
    @Query() filterDto: PostFilterDto,
  ) {
    return this.postsService.findAll(userId, filterDto);
  }

  /**
   * Get a single post by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get single post details by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.postsService.findOne(id, userId);
  }

  /**
   * Update a post
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing draft or scheduled post' })
  update(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, userId, updatePostDto);
  }

  /**
   * Delete a post
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a post' })
  delete(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.postsService.delete(id, userId);
  }
}
