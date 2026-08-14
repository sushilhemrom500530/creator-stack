import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteMemberDto } from './dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Workspace created successfully' })
  create(@CurrentUser('userId') userId: string, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(userId, createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces user belongs to' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of workspaces' })
  findAll(@CurrentUser('userId') userId: string) {
    return this.workspacesService.findAllForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace details by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workspace details' })
  findOne(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.workspacesService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workspace details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workspace updated successfully' })
  update(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(id, userId, updateWorkspaceDto);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Invite a member to the workspace' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Member invited successfully' })
  inviteMember(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.workspacesService.inviteMember(id, userId, inviteMemberDto);
  }

  @Delete(':id/members/:memberUserId')
  @ApiOperation({ summary: 'Remove a member from the workspace' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Member removed successfully' })
  removeMember(
    @Param('id') id: string,
    @CurrentUser('userId') currentUserId: string,
    @Param('memberUserId') memberUserId: string,
  ) {
    return this.workspacesService.removeMember(id, currentUserId, memberUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a workspace (Owner only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workspace deleted successfully' })
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.workspacesService.remove(id, userId);
  }
}
