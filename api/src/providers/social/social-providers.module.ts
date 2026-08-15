import { Global, Module, OnModuleInit } from '@nestjs/common';
import { SocialProviderFactory } from './social-provider.factory';
import { FacebookOAuth, FacebookClient, FacebookProvider } from './facebook';
import { InstagramOAuth, InstagramClient, InstagramProvider } from './instagram';
import { ThreadsOAuth, ThreadsClient, ThreadsProvider } from './threads';

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
    // Threads
    ThreadsOAuth,
    ThreadsClient,
    ThreadsProvider,
  ],
  exports: [
    SocialProviderFactory,
    FacebookOAuth,
    FacebookClient,
    FacebookProvider,
    InstagramOAuth,
    InstagramClient,
    InstagramProvider,
    ThreadsOAuth,
    ThreadsClient,
    ThreadsProvider,
  ],
})
export class SocialProvidersModule implements OnModuleInit {
  constructor(
    private readonly providerFactory: SocialProviderFactory,
    private readonly facebookProvider: FacebookProvider,
    private readonly instagramProvider: InstagramProvider,
    private readonly threadsProvider: ThreadsProvider,
  ) {}

  onModuleInit() {
    // Automatically register all Meta ecosystem providers on bootstrap
    this.providerFactory.registerProvider(this.facebookProvider);
    this.providerFactory.registerProvider(this.instagramProvider);
    this.providerFactory.registerProvider(this.threadsProvider);
  }
}
