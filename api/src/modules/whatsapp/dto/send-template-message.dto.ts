import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendTemplateMessageDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'campaign_published_notification' })
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiPropertyOptional({ example: 'en_US', default: 'en_US' })
  @IsString()
  @IsOptional()
  languageCode?: string;

  @ApiPropertyOptional({ description: 'Dynamic variables and component replacements' })
  @IsArray()
  @IsOptional()
  components?: any[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumberId?: string;
}
