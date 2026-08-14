import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
