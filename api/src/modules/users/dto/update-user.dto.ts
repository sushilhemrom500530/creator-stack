import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';
import { Status } from '../../../common/enums/status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
