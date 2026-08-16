import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateHooksDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: 'How to scale a remote development team from 1 to 20 engineers without burning out' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional({ example: 'founders and tech leaders' })
  @IsString()
  @IsOptional()
  targetAudience?: string;
}
