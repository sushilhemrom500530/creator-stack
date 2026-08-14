import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, IsDateString } from 'class-validator';
import { SocialPlatform } from '../schemas/social-account.schema';

export class ConnectAccountDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ enum: SocialPlatform, example: SocialPlatform.FACEBOOK })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @ApiProperty({ example: '108273948573928' })
  @IsString()
  @IsNotEmpty()
  platformAccountId: string;

  @ApiProperty({ example: 'Acme Official Facebook Page' })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiPropertyOptional({ example: 'acmeofficial' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'https://cdn.facebook.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  profilePictureUrl?: string;

  @ApiProperty({ description: 'Plaintext access token to be encrypted at rest' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiPropertyOptional({ description: 'Plaintext refresh token if available' })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiPropertyOptional({ example: '2026-10-15T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  tokenExpiresAt?: string;

  @ApiPropertyOptional({ example: ['pages_manage_posts', 'pages_read_engagement'] })
  @IsArray()
  @IsOptional()
  scopes?: string[];

  @ApiPropertyOptional({ example: { pageCategory: 'Marketing' } })
  @IsOptional()
  metadata?: Record<string, any>;
}
