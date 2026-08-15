import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SocialAccountStatus } from '../schemas/social-account.schema';

export class UpdateAccountDto {
  @ApiPropertyOptional({ example: 'Updated Account Name' })
  @IsString()
  @IsOptional()
  accountName?: string;

  @ApiPropertyOptional({ enum: SocialAccountStatus, example: SocialAccountStatus.ACTIVE })
  @IsEnum(SocialAccountStatus)
  @IsOptional()
  status?: SocialAccountStatus;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  autoPublish?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  autoSyncAnalytics?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  notifyErrors?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
