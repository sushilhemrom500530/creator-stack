import * as crypto from 'crypto';
import { verifyMetaSignature } from './meta-signature.util';

describe('verifyMetaSignature', () => {
  const secret = 'test-app-secret';
  const body = Buffer.from(JSON.stringify({ object: 'page', entry: [] }));
  const sign = (payload: Buffer, key = secret) =>
    `sha256=${crypto.createHmac('sha256', key).update(payload).digest('hex')}`;

  it('accepts a payload signed with the app secret', () => {
    expect(verifyMetaSignature(body, sign(body), secret)).toBe(true);
  });

  it('rejects a payload signed with a different secret', () => {
    expect(verifyMetaSignature(body, sign(body, 'attacker-secret'), secret)).toBe(false);
  });

  it('rejects a tampered body', () => {
    const tampered = Buffer.from(JSON.stringify({ object: 'page', entry: [{ id: 'x' }] }));
    expect(verifyMetaSignature(tampered, sign(body), secret)).toBe(false);
  });

  it('rejects missing header, missing body, missing secret and malformed headers', () => {
    expect(verifyMetaSignature(body, undefined, secret)).toBe(false);
    expect(verifyMetaSignature(undefined, sign(body), secret)).toBe(false);
    expect(verifyMetaSignature(body, sign(body), undefined)).toBe(false);
    expect(verifyMetaSignature(body, 'sha1=abc', secret)).toBe(false);
    expect(verifyMetaSignature(body, 'sha256=not-hex', secret)).toBe(false);
  });
});
