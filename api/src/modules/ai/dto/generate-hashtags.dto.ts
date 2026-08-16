import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class GenerateHashtagsDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: 'SaaS marketing, creator economy, AI tools' })
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsInt()
  @Min(3)
  @Max(30)
  @IsOptional()
  count?: number;
}
