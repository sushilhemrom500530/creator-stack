import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppClient } from './whatsapp.client';
import { Workspace, WorkspaceSchema } from '../workspaces/schemas/workspace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
  ],
  controllers: [WhatsAppController],
  providers: [WhatsAppService, WhatsAppClient],
  exports: [WhatsAppService, WhatsAppClient],
})
export class WhatsAppModule {}
