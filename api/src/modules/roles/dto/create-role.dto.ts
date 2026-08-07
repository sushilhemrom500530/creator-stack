import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}
