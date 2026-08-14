import { Injectable, NotFoundException } from '@nestjs/common';
import { SocialPlatform } from 'src/modules/social-accounts/schemas/social-account.schema';
import { SocialProvider } from './social-provider.interface';

@Injectable()
export class SocialProviderFactory {
  private readonly providers = new Map<SocialPlatform, SocialProvider>();

  registerProvider(provider: SocialProvider) {
    this.providers.set(provider.platform, provider);
  }

  getProvider(platform: SocialPlatform): SocialProvider {
    const provider = this.providers.get(platform);
    if (!provider) {
      throw new NotFoundException(`Social provider for platform '${platform}' is not configured or supported.`);
    }
    return provider;
  }

  hasProvider(platform: SocialPlatform): boolean {
    return this.providers.has(platform);
  }

  getSupportedPlatforms(): SocialPlatform[] {
    return Array.from(this.providers.keys());
  }
}
