import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../password';

describe('Password utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'test-password-123';
      const hashed = await hashPassword(password);

      // Hash should not be the same as the plain text password
      expect(hashed).not.toBe(password);

      // Hash should start with $2, $2a, $2b, or $2x (bcrypt format)
      expect(hashed).toMatch(/^\$2[aby]\$/);

      // Hash should be 60 characters long (bcrypt standard)
      expect(hashed).toHaveLength(60);
    });

    it('should produce different hashes for the same password (salting)', async () => {
      const password = 'same-password';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Two hashes of the same password should be different (due to salt)
      expect(hash1).not.toBe(hash2);
    });

    it('should handle special characters in password', async () => {
      const password = 'p@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const hashed = await hashPassword(password);

      expect(hashed).toMatch(/^\$2[aby]\$/);
      expect(hashed).toHaveLength(60);
    });

    it('should handle very long passwords', async () => {
      const password = 'a'.repeat(100);
      const hashed = await hashPassword(password);

      expect(hashed).toMatch(/^\$2[aby]\$/);
      expect(hashed).toHaveLength(60);
    });
  });

  describe('comparePassword', () => {
    it('should match a correct password', async () => {
      const password = 'my-secret-password';
      const hashed = await hashPassword(password);
      const match = await comparePassword(password, hashed);

      expect(match).toBe(true);
    });

    it('should not match an incorrect password', async () => {
      const password = 'correct-password';
      const wrongPassword = 'wrong-password';
      const hashed = await hashPassword(password);
      const match = await comparePassword(wrongPassword, hashed);

      expect(match).toBe(false);
    });

    it('should be case-sensitive', async () => {
      const password = 'MyPassword123';
      const hashed = await hashPassword(password);
      const match = await comparePassword('mypassword123', hashed);

      expect(match).toBe(false);
    });

    it('should handle special characters in password comparison', async () => {
      const password = 'p@ssw0rd!#$%';
      const hashed = await hashPassword(password);
      const match = await comparePassword(password, hashed);

      expect(match).toBe(true);
    });

    it('should correctly compare passwords with different special chars', async () => {
      const password = 'p@ssw0rd!#$%';
      const hashed = await hashPassword(password);
      const wrongPassword = 'p@ssw0rd!#$&';
      const match = await comparePassword(wrongPassword, hashed);

      expect(match).toBe(false);
    });

    it('should not match empty password against non-empty hash', async () => {
      const password = 'my-password';
      const hashed = await hashPassword(password);
      const match = await comparePassword('', hashed);

      expect(match).toBe(false);
    });
  });
});
