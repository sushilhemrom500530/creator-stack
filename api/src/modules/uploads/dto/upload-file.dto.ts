import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsOptional()
  folder?: string;
}
