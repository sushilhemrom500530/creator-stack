import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Response } from 'express';
import { SocialAccountsService } from './social-accounts.service';
import { ConnectAccountDto, UpdateAccountDto } from './dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { SocialPlatform } from './schemas/social-account.schema';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Social Accounts')
@Controller('social-accounts')
export class SocialAccountsController {
  constructor(private readonly socialAccountsService: SocialAccountsService) {}

  /**
   * PHASE 04: Generate OAuth authorization URL
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('oauth/:platform/authorize')
  @ApiOperation({ summary: 'Generate OAuth authorization URL with CSRF-protected state' })
  @ApiParam({ name: 'platform', enum: SocialPlatform })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'redirectUri', required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'Authorization URL and state generated' })
  async getAuthorizationUrl(
    @Param('platform') platform: SocialPlatform,
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
    @Query('redirectUri') redirectUri?: string,
  ) {
    return this.socialAccountsService.getAuthorizationUrl(platform, workspaceId, userId, redirectUri);
  }

  /**
   * PHASE 04: Handle OAuth Callback
   */
  @Public()
  @Get('oauth/:platform/callback')
  @ApiOperation({ summary: 'OAuth callback receiver from third-party social networks' })
  @ApiParam({ name: 'platform', enum: SocialPlatform })
  @ApiQuery({ name: 'code', required: true })
  @ApiQuery({ name: 'state', required: true })
  async handleOAuthCallback(
    @Param('platform') platform: SocialPlatform,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const account = await this.socialAccountsService.handleOAuthCallback(platform, code, state);
      
      // Redirect to frontend connected accounts page with success indicator
      const frontendUrl = process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/user/connected-accounts?status=success&platform=${platform}&accountId=${account._id}`);
    } catch (error: any) {
      const frontendUrl = process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/user/connected-accounts?status=error&message=${encodeURIComponent(error.message)}`);
    }
  }

  /**
   * Refresh account access token
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh expired or expiring access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token refreshed successfully' })
  async refreshAccountToken(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.socialAccountsService.refreshAccountToken(id, userId);
  }

  /**
   * Get workspace account health summary
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('health')
  @ApiOperation({ summary: 'Get health statistics of connected accounts for a workspace' })
  @ApiQuery({ name: 'workspaceId', required: true })
  async getHealth(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.socialAccountsService.getHealth(workspaceId, userId);
  }

  /**
   * Connect a social account manually
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('connect')
  @ApiOperation({ summary: 'Connect a social account to a workspace' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Social account connected successfully' })
  connect(
    @CurrentUser('userId') userId: string,
    @Body() connectAccountDto: ConnectAccountDto,
  ) {
    return this.socialAccountsService.connect(userId, connectAccountDto);
  }

  /**
   * Get all connected accounts for a workspace
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  /**
   * Get single account by ID
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get social account details by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Social account details' })
  findOne(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.socialAccountsService.findOne(id, userId);
  }

  /**
   * Update social account settings
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  /**
   * Disconnect a social account
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disconnect / revoke a social account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Social account disconnected successfully' })
  disconnect(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.socialAccountsService.disconnect(id, userId);
  }
}
