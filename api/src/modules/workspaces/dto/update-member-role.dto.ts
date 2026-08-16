import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { WorkspaceRole } from '../schemas/workspace.schema';

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: WorkspaceRole, example: WorkspaceRole.ADMIN })
  @IsEnum(WorkspaceRole)
  @IsNotEmpty()
  role: WorkspaceRole;
}
