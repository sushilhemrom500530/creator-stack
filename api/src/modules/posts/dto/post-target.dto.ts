import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { SocialPlatform } from 'src/modules/social-accounts/schemas/social-account.schema';

export class PostTargetDto {
  @ApiProperty({ example: '66a123456789abcdef123456', description: 'SocialAccount MongoDB ID' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ enum: SocialPlatform, example: SocialPlatform.FACEBOOK })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @ApiPropertyOptional({ example: 'Custom tailored caption for Facebook...' })
  @IsString()
  @IsOptional()
  platformContent?: string;

  @ApiPropertyOptional({ example: ['https://cdn.creatorstack.com/media/custom-ig-cover.jpg'] })
  @IsArray()
  @IsOptional()
  mediaOverrides?: string[];

  @ApiPropertyOptional({ example: { isReel: true, title: 'Launch Video' } })
  @IsOptional()
  options?: Record<string, any>;
}
