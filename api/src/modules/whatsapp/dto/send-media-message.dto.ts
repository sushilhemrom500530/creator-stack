import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMediaMessageDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ enum: ['image', 'video', 'document', 'audio'], example: 'image' })
  @IsEnum(['image', 'video', 'document', 'audio'])
  mediaType: 'image' | 'video' | 'document' | 'audio';

  @ApiProperty({ example: 'https://cdn.creatorstack.com/media/banner.jpg' })
  @IsString()
  @IsNotEmpty()
  mediaUrl: string;

  @ApiPropertyOptional({ example: 'Check out our latest social media analytics report!' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ example: 'monthly_report.pdf' })
  @IsString()
  @IsOptional()
  filename?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumberId?: string;
}
