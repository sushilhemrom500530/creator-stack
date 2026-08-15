import { Global, Module, OnModuleInit } from '@nestjs/common';
import { SocialProviderFactory } from './social-provider.factory';
import { FacebookOAuth, FacebookClient, FacebookProvider } from './facebook';
import { InstagramOAuth, InstagramClient, InstagramProvider } from './instagram';

@Global()
@Module({
  providers: [
    SocialProviderFactory,
    // Facebook
    FacebookOAuth,
    FacebookClient,
    FacebookProvider,
    // Instagram
    InstagramOAuth,
    InstagramClient,
    InstagramProvider,
  ],
  exports: [
    SocialProviderFactory,
    FacebookOAuth,
    FacebookClient,
    FacebookProvider,
    InstagramOAuth,
    InstagramClient,
    InstagramProvider,
  ],
})
export class SocialProvidersModule implements OnModuleInit {
  constructor(
    private readonly providerFactory: SocialProviderFactory,
    private readonly facebookProvider: FacebookProvider,
    private readonly instagramProvider: InstagramProvider,
  ) {}

  onModuleInit() {
    // Automatically register providers on application bootstrap
    this.providerFactory.registerProvider(this.facebookProvider);
    this.providerFactory.registerProvider(this.instagramProvider);
  }
}
