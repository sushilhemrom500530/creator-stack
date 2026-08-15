import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendTextMessageDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: '+1234567890', description: 'Recipient phone number in international format' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'Hello from CreatorStack! Your scheduled social campaign is ready.' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  previewUrl?: boolean;

  @ApiPropertyOptional({ description: 'Optional specific WhatsApp Phone Number ID' })
  @IsString()
  @IsOptional()
  phoneNumberId?: string;
}
