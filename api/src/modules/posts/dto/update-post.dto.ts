import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../schemas/post.schema';
import { PostTargetDto } from './post-target.dto';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Updated base content description...' })
  @IsString()
  @IsOptional()
  baseContent?: string;

  @ApiPropertyOptional({ example: ['https://cdn.creatorstack.com/media/updated.jpg'] })
  @IsArray()
  @IsOptional()
  mediaUrls?: string[];

  @ApiPropertyOptional({ type: [PostTargetDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostTargetDto)
  @IsOptional()
  targets?: PostTargetDto[];

  @ApiPropertyOptional({ enum: PostStatus })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiPropertyOptional({ example: '2026-08-22T18:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
