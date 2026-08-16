import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsOptional()
  workspaceId?: string;

  @ApiProperty({ example: 'Post Successfully Published' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Your post was dispatched to LinkedIn and Twitter.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ enum: ['success', 'error', 'warning', 'info'], default: 'info' })
  @IsEnum(['success', 'error', 'warning', 'info'])
  @IsOptional()
  type?: 'success' | 'error' | 'warning' | 'info';

  @ApiPropertyOptional({
    enum: ['publishing', 'token_expiry', 'ai', 'security', 'billing', 'system'],
    default: 'system',
  })
  @IsEnum(['publishing', 'token_expiry', 'ai', 'security', 'billing', 'system'])
  @IsOptional()
  category?: 'publishing' | 'token_expiry' | 'ai' | 'security' | 'billing' | 'system';

  @ApiPropertyOptional({ example: '/user/posts' })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  sendEmail?: boolean;
}
