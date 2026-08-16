import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateCaptionDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: 'Launch of our AI social scheduling platform' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional({
    enum: ['x', 'linkedin', 'facebook', 'instagram', 'threads', 'whatsapp'],
    default: 'linkedin',
  })
  @IsEnum(['x', 'linkedin', 'facebook', 'instagram', 'threads', 'whatsapp'])
  @IsOptional()
  platform?: 'x' | 'linkedin' | 'facebook' | 'instagram' | 'threads' | 'whatsapp';

  @ApiPropertyOptional({
    enum: ['professional', 'casual', 'funny', 'inspirational', 'persuasive', 'urgency'],
    default: 'professional',
  })
  @IsEnum(['professional', 'casual', 'funny', 'inspirational', 'persuasive', 'urgency'])
  @IsOptional()
  tone?: 'professional' | 'casual' | 'funny' | 'inspirational' | 'persuasive' | 'urgency';

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  includeHashtags?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  includeEmojis?: boolean;
}
