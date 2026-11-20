import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ListConversationsDto {
  @ApiProperty({ example: '66a123456789abcdef123456' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiPropertyOptional({ description: 'Filter by connected social account id' })
  @IsString()
  @IsOptional()
  accountId?: string;

  @ApiPropertyOptional({ description: 'Search by participant name or last message' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}

export class ListMessagesDto {
  @ApiPropertyOptional({ description: 'Return messages sent before this ISO date (for loading older history)' })
  @IsDateString()
  @IsOptional()
  before?: string;

  @ApiPropertyOptional({ default: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  @IsOptional()
  limit?: number;
}

/** Messenger caps text messages at 2000 characters. */
export const MESSENGER_MAX_TEXT_LENGTH = 2000;

export class SendMessageDto {
  @ApiProperty({ example: 'Thanks for reaching out! How can we help?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(MESSENGER_MAX_TEXT_LENGTH)
  text: string;
}
