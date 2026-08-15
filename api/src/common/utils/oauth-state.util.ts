import * as crypto from 'crypto';

export interface OAuthStatePayload {
  userId: string;
  workspaceId: string;
  platform: string;
  nonce: string;
  timestamp: number;
}

const STATE_TTL_MS = 15 * 60 * 1000; // 15 minutes validity

function getStateSecret(): string {
  return process.env.COOKIE_SECRET || process.env.JWT_SECRET || 'creator_stack_oauth_state_fallback_secret_32b';
}

/**
 * Generates a signed, URL-safe base64 OAuth state token to protect against CSRF attacks.
 */
export function generateOAuthState(payload: Omit<OAuthStatePayload, 'nonce' | 'timestamp'>): string {
  const fullPayload: OAuthStatePayload = {
    ...payload,
    nonce: crypto.randomBytes(8).toString('hex'),
    timestamp: Date.now(),
  };

  const jsonStr = JSON.stringify(fullPayload);
  const dataB64 = Buffer.from(jsonStr, 'utf8').toString('base64url');

  const signature = crypto
    .createHmac('sha256', getStateSecret())
    .update(dataB64)
    .digest('base64url');

  return `${dataB64}.${signature}`;
}

/**
 * Validates and decodes an OAuth state token.
 * Throws an error if expired or if the signature does not match.
 */
export function validateOAuthState(state: string): OAuthStatePayload {
  if (!state || typeof state !== 'string') {
    throw new Error('OAuth state parameter is missing or invalid.');
  }

  const parts = state.split('.');
  if (parts.length !== 2) {
    throw new Error('Malformed OAuth state format.');
  }

  const [dataB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', getStateSecret())
    .update(dataB64)
    .digest('base64url');

  if (signature !== expectedSignature) {
    throw new Error('OAuth state verification failed: Invalid cryptographic signature.');
  }

  const jsonStr = Buffer.from(dataB64, 'base64url').toString('utf8');
  const payload: OAuthStatePayload = JSON.parse(jsonStr);

  // Check TTL (15 minutes)
  if (Date.now() - payload.timestamp > STATE_TTL_MS) {
    throw new Error('OAuth state has expired. Please initiate the connection again.');
  }

  return payload;
}
