import { Controller, Get, Header, VERSION_NEUTRAL } from '@nestjs/common';
import { DocsService } from './docs.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller({ path: 'docs', version: VERSION_NEUTRAL })
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Public()
  @Get()
  @Header('Content-Type', 'text/html')
  getDocs(): string {
    return this.docsService.getDocsHtml();
  }
}
