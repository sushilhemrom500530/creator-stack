import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AiChatDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: 'Give me 3 innovative campaign ideas for Black Friday on Instagram Reels.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ example: [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hi there!' }] })
  @IsArray()
  @IsOptional()
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
}
