import { Global, Module } from '@nestjs/common';
import { SocialProviderFactory } from './social-provider.factory';

@Global()
@Module({
  providers: [SocialProviderFactory],
  exports: [SocialProviderFactory],
})
export class SocialProvidersModule {}
