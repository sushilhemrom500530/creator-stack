import { encryptToken, decryptToken } from './token-encryption.util';

describe('TokenEncryptionUtil', () => {
  it('should successfully encrypt and decrypt a secret access token', () => {
    const plainToken = 'EAABsbCS1...meta_long_lived_token_example_12345';
    const encrypted = encryptToken(plainToken);

    expect(encrypted).toBeDefined();
    expect(encrypted).not.toEqual(plainToken);
    expect(encrypted.split(':')).toHaveLength(3); // iv:ciphertext:authTag

    const decrypted = decryptToken(encrypted);
    expect(decrypted).toEqual(plainToken);
  });

  it('should return empty string when empty input is provided', () => {
    expect(encryptToken('')).toEqual('');
    expect(decryptToken('')).toEqual('');
  });

  it('should throw an error if encrypted payload format is invalid', () => {
    expect(() => decryptToken('invalid_token')).toThrow('Invalid encrypted token payload format');
  });
});
