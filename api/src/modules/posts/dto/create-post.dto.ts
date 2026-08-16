import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../schemas/post.schema';
import { PostTargetDto } from './post-target.dto';

export class CreatePostDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: 'Excited to announce our new SocialFlow AI platform launch! 🚀' })
  @IsString()
  @IsNotEmpty()
  baseContent: string;

  @ApiPropertyOptional({ example: ['https://cdn.creatorstack.com/media/banner.jpg'] })
  @IsArray()
  @IsOptional()
  mediaUrls?: string[];

  @ApiProperty({ type: [PostTargetDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostTargetDto)
  targets: PostTargetDto[];

  @ApiPropertyOptional({ enum: PostStatus, default: PostStatus.DRAFT })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiPropertyOptional({ example: '2026-08-20T14:30:00.000Z' })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional({ example: ['launch', 'product', 'startup'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: true, description: 'Immediately dispatch post to publishing queue' })
  @IsBoolean()
  @IsOptional()
  publishNow?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
