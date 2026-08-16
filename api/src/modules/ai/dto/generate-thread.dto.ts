import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class GenerateThreadDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: 'The 7 non-obvious lessons learned building a $1M ARR bootstrap business' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional({ example: 5, default: 5 })
  @IsInt()
  @Min(3)
  @Max(10)
  @IsOptional()
  tweetsCount?: number;
}
