import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SocialAccountsService } from './social-accounts.service';
import { ConnectAccountDto, UpdateAccountDto } from './dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Social Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('social-accounts')
export class SocialAccountsController {
  constructor(private readonly socialAccountsService: SocialAccountsService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect a social account to a workspace' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Social account connected successfully' })
  connect(@CurrentUser('userId') userId: string, @Body() connectAccountDto: ConnectAccountDto) {
    return this.socialAccountsService.connect(userId, connectAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all connected social accounts for a workspace' })
  @ApiQuery({ name: 'workspaceId', required: true, description: 'Workspace ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of connected social accounts' })
  findAllByWorkspace(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.socialAccountsService.findAllByWorkspace(workspaceId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get social account details by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Social account details' })
  findOne(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.socialAccountsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update social account settings' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Social account updated successfully' })
  update(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.socialAccountsService.update(id, userId, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disconnect / revoke a social account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Social account disconnected successfully' })
  disconnect(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.socialAccountsService.disconnect(id, userId);
  }
}
