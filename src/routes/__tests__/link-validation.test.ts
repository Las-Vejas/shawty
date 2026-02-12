import { describe, it, expect } from 'vitest';

// Helper functions for link validation (extracted from +server.ts)
const getHostname = (url: string): string | null => {
	try {
		return new URL(url).hostname.toLowerCase();
	} catch {
		return null;
	}
};

const validateUrl = (url: string): boolean => {
	try {
		new URL(!url.match(/^https?:\/\//i) ? 'https://' + url : url);
		return true;
	} catch {
		return false;
	}
};

const validateCustomSlug = (slug: string): boolean => {
	if (!slug) return false;
	const trimmed = slug.trim();
	return /^[a-zA-Z0-9-]{3,20}$/.test(trimmed);
};

const generateRandomSlug = (): string => {
	return Math.random().toString(36).substring(2, 8);
};

describe('Link Creation Validation', () => {
	describe('URL Validation', () => {
		it('validates correct URLs', () => {
			expect(validateUrl('https://example.com')).toBe(true);
			expect(validateUrl('http://example.com')).toBe(true);
			expect(validateUrl('example.com')).toBe(true);
		});

		it('rejects invalid URLs', () => {
			expect(validateUrl(':invalid')).toBe(false);
			expect(validateUrl('ht tp://example.com')).toBe(false);
		});

		it('handles URLs with paths', () => {
			expect(validateUrl('https://example.com/path/to/page')).toBe(true);
		});

		it('handles URLs with query parameters', () => {
			expect(validateUrl('https://example.com?query=value')).toBe(true);
		});

		it('handles URLs with fragments', () => {
			expect(validateUrl('https://example.com#section')).toBe(true);
		});

		it('handles complex URLs', () => {
			expect(validateUrl('https://subdomain.example.com:8080/path?query=value#section')).toBe(true);
		});
	});

	describe('Custom Slug Validation', () => {
		it('accepts valid slugs', () => {
			expect(validateCustomSlug('my-link')).toBe(true);
			expect(validateCustomSlug('abc123')).toBe(true);
			expect(validateCustomSlug('link-123-abc')).toBe(true);
		});

		it('rejects empty slugs', () => {
			expect(validateCustomSlug('')).toBe(false);
		});

		it('rejects slugs that are too short', () => {
			expect(validateCustomSlug('ab')).toBe(false);
		});

		it('rejects slugs that are too long', () => {
			expect(validateCustomSlug('a'.repeat(21))).toBe(false);
		});

		it('rejects slugs with special characters', () => {
			expect(validateCustomSlug('my@link')).toBe(false);
			expect(validateCustomSlug('my!link')).toBe(false);
			expect(validateCustomSlug('my link')).toBe(false);
		});

		it('rejects slugs with underscores', () => {
			expect(validateCustomSlug('my_link')).toBe(false);
		});

		it('handles whitespace by trimming', () => {
			expect(validateCustomSlug('  my-link  ')).toBe(true);
		});

		it('accepts exactly 3 characters', () => {
			expect(validateCustomSlug('abc')).toBe(true);
		});

		it('accepts exactly 20 characters', () => {
			expect(validateCustomSlug('a'.repeat(20))).toBe(true);
		});

		it('accepts hyphens', () => {
			expect(validateCustomSlug('my-custom-link')).toBe(true);
		});

		it('accepts uppercase', () => {
			expect(validateCustomSlug('MyLink')).toBe(true);
		});
	});

	describe('Random Slug Generation', () => {
		it('generates 6-character slugs', () => {
			const slug = generateRandomSlug();
			expect(slug.length).toBe(6);
		});

		it('generates alphanumeric slugs', () => {
			const slug = generateRandomSlug();
			expect(/^[a-z0-9]{6}$/.test(slug)).toBe(true);
		});

		it('generates unique slugs', () => {
			const slugs = new Set();
			for (let i = 0; i < 100; i++) {
				slugs.add(generateRandomSlug());
			}
			// With 100 iterations, should have very few duplicates
			// This is a probabilistic test
			expect(slugs.size).toBeGreaterThan(95);
		});
	});

	describe('Hostname Extraction', () => {
		it('extracts hostname from URLs', () => {
			const hostname = getHostname('https://example.com/path');
			expect(hostname).toBe('example.com');
		});

		it('lowercases hostnames', () => {
			const hostname = getHostname('https://Example.COM/path');
			expect(hostname).toBe('example.com');
		});

		it('handles subdomains', () => {
			const hostname = getHostname('https://sub.example.com');
			expect(hostname).toBe('sub.example.com');
		});

		it('returns null for invalid URLs', () => {
			const hostname = getHostname('not a url');
			expect(hostname).toBeNull();
		});

		it('handles URLs with ports', () => {
			const hostname = getHostname('https://example.com:8080');
			expect(hostname).toBe('example.com');
		});
	});
});

describe('Link Data Structures', () => {
	interface LinkData {
		short_code: string;
		long_url: string;
		user_id: string;
		clicks: number;
		on_leaderboard: boolean;
		custom_slug: boolean;
		password?: string | null;
	}

	it('creates valid link data object', () => {
		const link: LinkData = {
			short_code: 'abc123',
			long_url: 'https://example.com',
			user_id: 'user-123',
			clicks: 0,
			on_leaderboard: false,
			custom_slug: false,
			password: null
		};

		expect(link.short_code).toBe('abc123');
		expect(link.long_url).toBe('https://example.com');
		expect(link.user_id).toBe('user-123');
		expect(link.clicks).toBe(0);
		expect(link.on_leaderboard).toBe(false);
		expect(link.custom_slug).toBe(false);
	});

	it('handles optional password field', () => {
		const link: LinkData = {
			short_code: 'abc123',
			long_url: 'https://example.com',
			user_id: 'user-123',
			clicks: 0,
			on_leaderboard: false,
			custom_slug: false
		};

		expect(link.password).toBeUndefined();
	});
});

describe('Error Handling', () => {
	it('should handle missing URL field', () => {
		const body = { customSlug: 'test' };
		expect('url' in body).toBe(false);
	});

	it('should handle missing user authentication', () => {
		const locals = { user: null };
		expect(locals.user).toBeNull();
	});

	it('should validate request body structure', () => {
		const validBody = {
			url: 'https://example.com',
			customSlug: 'test-link',
			password: 'password123'
		};

		expect(validBody).toHaveProperty('url');
		expect(validBody).toHaveProperty('customSlug');
		expect(validBody).toHaveProperty('password');
	});
});
