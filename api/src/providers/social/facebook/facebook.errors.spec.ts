import { FacebookGraphError } from './facebook.errors';

describe('FacebookGraphError', () => {
  it('flags expired / revoked tokens as requiring re-authentication with a friendly message', () => {
    const err = new FacebookGraphError(
      { code: 190, error_subcode: 463, message: 'Error validating access token: Session has expired' },
      'fallback',
    );
    expect(err.requiresReauth).toBe(true);
    expect(err.message).toBe('Your Facebook connection has expired or was revoked. Please reconnect your Facebook Page.');
    expect(err.getStatus()).toBe(400);
  });

  it('detects the Messenger 24-hour window error', () => {
    const err = new FacebookGraphError({ code: 10, error_subcode: 2018278, message: 'outside window' }, 'fallback');
    expect(err.isOutsideMessagingWindow).toBe(true);
    expect(err.isPermissionError).toBe(false);
    expect(err.requiresReauth).toBe(false);
    expect(err.message).toContain('24 hours');
  });

  it('detects permission errors', () => {
    const err = new FacebookGraphError({ code: 200, message: 'Requires pages_manage_posts permission' }, 'fallback');
    expect(err.isPermissionError).toBe(true);
    expect(err.requiresReauth).toBe(false);
  });

  it('prefers the user-facing message from Graph and falls back when there is no error body', () => {
    expect(new FacebookGraphError({ code: 1, message: 'raw', error_user_msg: 'Nice message' }, 'fb').message).toBe(
      'Nice message',
    );
    expect(new FacebookGraphError(undefined, 'Fallback message').message).toBe('Fallback message');
  });
});
