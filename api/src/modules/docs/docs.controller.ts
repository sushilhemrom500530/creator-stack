import { Controller, Get, Res, VERSION_NEUTRAL } from '@nestjs/common';
import type { Response } from 'express';
import { DocsService } from './docs.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller({ path: 'docs', version: VERSION_NEUTRAL })
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Public()
  @Get()
  getDocs(@Res() res: Response) {
    const html = this.docsService.getDocsHtml();
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }
}
