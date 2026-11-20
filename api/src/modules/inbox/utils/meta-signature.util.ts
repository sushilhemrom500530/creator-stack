import * as crypto from 'crypto';

/**
 * Verifies the `X-Hub-Signature-256` header Meta attaches to every webhook POST.
 * The signature is HMAC-SHA256(rawRequestBody, appSecret), hex encoded, prefixed with "sha256=".
 * https://developers.facebook.com/docs/messenger-platform/webhooks#validate-payloads
 */
export function verifyMetaSignature(
  rawBody: Buffer | string | undefined,
  signatureHeader: string | undefined,
  appSecret: string | undefined,
): boolean {
  if (!rawBody || !signatureHeader || !appSecret) return false;

  const [algorithm, signature] = signatureHeader.split('=');
  if (algorithm !== 'sha256' || !signature || !/^[a-f0-9]{64}$/i.test(signature)) return false;

  const expected = crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');

  const a = Buffer.from(signature.toLowerCase(), 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
