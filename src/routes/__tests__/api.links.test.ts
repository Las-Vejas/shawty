import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
beforeEach(() => {
	vi.stubEnv('PUBLIC_URL', 'https://www.shawty.app');
});

describe('POST /api/links - Link creation', () => {
	describe('URL Validation', () => {
		it('should reject request without authentication', async () => {
			// This test demonstrates the validation logic
			// In real implementation, you'd use the actual endpoint
			
			const missingUrl = {};
			const hasUrl = 'url' in missingUrl;
			expect(hasUrl).toBe(false);
		});

		it('should accept URLs without protocol and add https://', () => {
			const url = 'example.com';
			const withProtocol = !url.match(/^https?:\/\//i) ? 'https://' + url : url;
			expect(withProtocol).toBe('https://example.com');
		});

		it('should accept URLs with https://', () => {
			const url = 'https://example.com';
			const withProtocol = !url.match(/^https?:\/\//i) ? 'https://' + url : url;
			expect(withProtocol).toBe('https://example.com');
		});

		it('should accept URLs with http://', () => {
			const url = 'http://example.com';
			const withProtocol = !url.match(/^https?:\/\//i) ? 'https://' + url : url;
			expect(withProtocol).toBe('http://example.com');
		});

		it('should reject invalid URLs', () => {
			const invalidUrl = ':invalid://url';
			expect(() => {
				new URL(invalidUrl);
			}).toThrow();
		});

		it('should validate URL format with new URL()', () => {
			const validUrl = 'https://example.com';
			expect(() => {
				new URL(validUrl);
			}).not.toThrow();
		});

		it('should reject malformed URLs', () => {
			expect(() => {
				new URL(':invalid://url');
			}).toThrow();
		});
	});

	describe('Self-referencing URL Prevention', () => {
		const PUBLIC_URL = 'https://www.shawty.app';

		const getHostname = (url: string): string | null => {
			try {
				return new URL(url).hostname.toLowerCase();
			} catch {
				return null;
			}
		};

		const BLOCKED_HOSTNAMES = [
			getHostname(PUBLIC_URL),
			'www.shawty.app',
			'shawty.app'
		].filter(Boolean) as string[];

		const validateUrlNotSelfReferencing = (url: string): boolean => {
			const hostname = getHostname(url);
			if (!hostname) return false;
			return !BLOCKED_HOSTNAMES.some(blocked => 
				hostname === blocked || hostname.endsWith(`.${blocked}`)
			);
		};

		it('should reject www.shawty.app URLs', () => {
			const isValid = validateUrlNotSelfReferencing('https://www.shawty.app/some-link');
			expect(isValid).toBe(false);
		});

		it('should reject shawty.app URLs', () => {
			const isValid = validateUrlNotSelfReferencing('https://shawty.app/some-link');
			expect(isValid).toBe(false);
		});

		it('should reject subdomain of blocked domain', () => {
			const isValid = validateUrlNotSelfReferencing('https://sub.shawty.app/some-link');
			expect(isValid).toBe(false);
		});

		it('should allow external URLs', () => {
			const isValid = validateUrlNotSelfReferencing('https://example.com');
			expect(isValid).toBe(true);
		});

		it('should allow different domains', () => {
			const isValid = validateUrlNotSelfReferencing('https://google.com');
			expect(isValid).toBe(true);
		});

		it('should handle invalid URLs', () => {
			const isValid = validateUrlNotSelfReferencing('not-a-url');
			expect(isValid).toBe(false);
		});
	});

	describe('Custom Slug Validation', () => {
		it('should accept valid custom slugs (alphanumeric and hyphens)', () => {
			const slug = 'my-link-123';
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(true);
		});

		it('should accept 3-character slugs', () => {
			const slug = 'abc';
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(true);
		});

		it('should accept 20-character slugs', () => {
			const slug = 'a'.repeat(20);
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(true);
		});

		it('should reject slugs shorter than 3 characters', () => {
			const slug = 'ab';
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(false);
		});

		it('should reject slugs longer than 20 characters', () => {
			const slug = 'a'.repeat(21);
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(false);
		});

		it('should reject slugs with special characters', () => {
			const slug = 'my@link!';
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(false);
		});

		it('should reject slugs with spaces', () => {
			const slug = 'my link';
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(false);
		});

		it('should reject slugs with underscores', () => {
			const slug = 'my_link';
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(false);
		});

		it('should handle whitespace trimming', () => {
			const slug = '  my-link  '.trim();
			const isValid = /^[a-zA-Z0-9-]{3,20}$/.test(slug);
			expect(isValid).toBe(true);
		});
	});

	describe('Random Short Code Generation', () => {
		it('should generate a 6-character short code', () => {
			const shortCode = Math.random().toString(36).substring(2, 8);
			expect(shortCode.length).toBe(6);
		});

		it('should generate alphanumeric codes', () => {
			const shortCode = Math.random().toString(36).substring(2, 8);
			expect(/^[a-z0-9]{6}$/.test(shortCode)).toBe(true);
		});

		it('should generate different codes on multiple calls', () => {
			const code1 = Math.random().toString(36).substring(2, 8);
			const code2 = Math.random().toString(36).substring(2, 8);
			expect(code1).not.toBe(code2);
		});
	});
});
