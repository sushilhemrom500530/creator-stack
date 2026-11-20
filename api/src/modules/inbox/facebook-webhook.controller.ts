import { Controller, Headers, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { FacebookWebhookService } from './facebook-webhook.service';
import type { PageWebhookPayload } from './facebook-webhook.types';

/** Meta expects a 200 quickly; anything still running after this keeps going in the background. */
const WEBHOOK_PROCESSING_BUDGET_MS = 8_000;

/**
 * Receives Meta Page webhooks (Messenger messages, echoes, postbacks and feed changes).
 * Shares its path with the GET verification endpoint in SocialAccountsController,
 * so one callback URL is configured in the Meta app dashboard.
 */
@ApiTags('Social Accounts')
@Controller('social-accounts/webhooks/facebook')
export class FacebookWebhookController {
  private readonly logger = new Logger(FacebookWebhookController.name);

  constructor(private readonly webhookService: FacebookWebhookService) {}

  @Public()
  @SkipThrottle()
  @Post()
  @ApiExcludeEndpoint()
  async receive(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-hub-signature-256') signature: string | undefined,
    @Res() res: Response,
  ) {
    if (!this.webhookService.isValidSignature(req.rawBody, signature)) {
      this.logger.warn('Rejected Facebook webhook with a missing or invalid signature.');
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const processing = this.webhookService
      .handlePayload(req.body as PageWebhookPayload)
      .catch((error) => this.logger.error(`Facebook webhook processing failed: ${error.message}`, error.stack));

    // Wait for processing (so serverless runtimes don't freeze mid-write) but never past Meta's timeout.
    let timer: NodeJS.Timeout | undefined;
    await Promise.race([
      processing,
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, WEBHOOK_PROCESSING_BUDGET_MS);
      }),
    ]);
    if (timer) clearTimeout(timer);

    return res.status(HttpStatus.OK).type('text/plain').send('EVENT_RECEIVED');
  }
}
