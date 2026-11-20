import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { socialConfig } from '../../config';
import { SocialProvidersModule } from '../../providers/social';
import { InboxModule } from './inbox.module';
import { InboxController } from './inbox.controller';
import { FacebookWebhookController } from './facebook-webhook.controller';
import { PublishingModule } from '../publishing/publishing.module';
import { PublishingController } from '../publishing/publishing.controller';
import { PostsModule } from '../posts/posts.module';

/** Stands in for the Mongo connection so the DI graph can be verified without a database. */
@Global()
@Module({
  providers: [
    {
      provide: getConnectionToken(),
      useValue: { models: {}, model: jest.fn(() => ({})) },
    },
  ],
  exports: [getConnectionToken()],
})
class FakeMongoConnectionModule {}

describe('Inbox / Publishing module wiring', () => {
  it('resolves every provider and controller (catches missing imports / circular deps)', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [socialConfig], ignoreEnvFile: true }),
        FakeMongoConnectionModule,
        SocialProvidersModule,
        InboxModule,
        PostsModule,
        PublishingModule,
      ],
    }).compile();

    expect(moduleRef.get(InboxController)).toBeDefined();
    expect(moduleRef.get(FacebookWebhookController)).toBeDefined();
    expect(moduleRef.get(PublishingController)).toBeDefined();
    await moduleRef.close();
  });
});
