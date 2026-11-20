import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { FacebookClient } from './facebook.client';
import { FacebookGraphError } from './facebook.errors';

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body } as unknown as Response;
}

describe('FacebookClient', () => {
  const appSecret = 'unit-test-secret';
  const config = {
    get: (key: string) =>
      ({ 'social.meta.graphVersion': 'v21.0', 'social.meta.appSecret': appSecret } as Record<string, string>)[key],
  } as unknown as ConfigService;

  let client: FacebookClient;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    client = new FacebookClient(config);
    fetchMock = jest.fn();
    (global as any).fetch = fetchMock;
  });

  it('sends the token with an appsecret_proof and a JSON body when publishing to the feed', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: '123_456' }));

    const res = await client.publishFeed('123', 'PAGE_TOKEN', 'Hello Facebook', 'https://example.com');

    expect(res.id).toBe('123_456');
    const [url, init] = fetchMock.mock.calls[0];
    const parsed = new URL(url);
    expect(parsed.pathname).toBe('/v21.0/123/feed');
    expect(parsed.searchParams.get('access_token')).toBe('PAGE_TOKEN');
    expect(parsed.searchParams.get('appsecret_proof')).toBe(
      crypto.createHmac('sha256', appSecret).update('PAGE_TOKEN').digest('hex'),
    );
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ message: 'Hello Facebook', link: 'https://example.com' });
  });

  it('attaches uploaded photos to a feed post', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: '1_2' }));
    await client.publishFeed('1', 'T', 'Album', undefined, undefined, ['p1', 'p2']);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).attached_media).toEqual([
      { media_fbid: 'p1' },
      { media_fbid: 'p2' },
    ]);
  });

  it('converts Graph API errors into FacebookGraphError with code and subcode', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { message: 'Session has expired', code: 190, error_subcode: 463, fbtrace_id: 'abc' } }, false, 400),
    );

    await expect(client.publishPhoto('1', 'T', 'https://img/x.jpg')).rejects.toMatchObject({
      code: 190,
      subcode: 463,
      requiresReauth: true,
    });
  });

  it('wraps network failures in a FacebookGraphError', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    await expect(client.deletePost('1_2', 'T')).rejects.toBeInstanceOf(FacebookGraphError);
  });

  it('sends Messenger replies as RESPONSE messages to the PSID', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ recipient_id: 'PSID', message_id: 'm_1' }));

    const res = await client.sendMessengerText('PAGE', 'T', 'PSID', 'Hi there');

    expect(res.message_id).toBe('m_1');
    expect(new URL(fetchMock.mock.calls[0][0]).pathname).toBe('/v21.0/PAGE/messages');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      recipient: { id: 'PSID' },
      messaging_type: 'RESPONSE',
      message: { text: 'Hi there' },
    });
  });

  it('subscribes the Page to messaging + feed webhook fields', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));

    await expect(client.subscribePageToWebhooks('PAGE', 'T')).resolves.toBe(true);
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe('/v21.0/PAGE/subscribed_apps');
    expect(url.searchParams.get('subscribed_fields')).toBe('messages,messaging_postbacks,message_echoes,feed');
  });

  it('returns null instead of throwing when a Messenger profile is not accessible', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: { code: 200, message: 'no permission' } }, false, 400));
    await expect(client.getMessengerUserProfile('PSID', 'T')).resolves.toBeNull();
  });

  it('builds an absolute permalink and swallows permalink failures', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ permalink_url: '/123/posts/456' }));
    await expect(client.getPermalink('123_456', 'T')).resolves.toBe('https://www.facebook.com/123/posts/456');

    fetchMock.mockResolvedValueOnce(jsonResponse({ error: { code: 100 } }, false, 400));
    await expect(client.getPermalink('123_456', 'T')).resolves.toBeUndefined();
  });
});
