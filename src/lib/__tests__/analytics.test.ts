import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseUserAgent, getClientIP, getLocationFromIP } from '../analytics';

describe('Analytics utilities', () => {
	describe('parseUserAgent', () => {
		it('should parse Chrome user agent correctly', () => {
			const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
			const result = parseUserAgent(ua);
			
			expect(result).toHaveProperty('device');
			expect(result).toHaveProperty('os');
			expect(result).toHaveProperty('browser');
			expect(result.browser).toContain('Chrome');
			expect(result.os).toContain('Windows');
		});

		it('should parse Firefox user agent correctly', () => {
			const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0';
			const result = parseUserAgent(ua);
			
			expect(result.browser).toContain('Firefox');
			expect(result.os).toContain('Linux');
		});

		it('should parse Safari user agent correctly', () => {
			const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
			const result = parseUserAgent(ua);
			
			expect(result.browser).toContain('Safari');
			expect(result.os).toMatch(/[Mm]ac/);
		});

		it('should parse mobile user agent correctly', () => {
			const ua = 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36';
			const result = parseUserAgent(ua);
			
			expect(result.os).toContain('Android');
		});

		it('should return defaults for unknown user agent', () => {
			const ua = 'Unknown/1.0';
			const result = parseUserAgent(ua);
			
			expect(result.device).toBe('desktop');
			expect(result.os).toBe('Unknown');
			expect(result.browser).toBe('Unknown');
		});

		it('should always return an object with required keys', () => {
			const result = parseUserAgent('');
			
			expect(result).toHaveProperty('device');
			expect(result).toHaveProperty('os');
			expect(result).toHaveProperty('browser');
		});
	});

	describe('getClientIP', () => {
		it('should get IP from cf-connecting-ip header (Cloudflare)', () => {
			const request = new Request('http://example.com', {
				headers: {
					'cf-connecting-ip': '192.168.1.1'
				}
			});
			
			const ip = getClientIP(request);
			expect(ip).toBe('192.168.1.1');
		});

		it('should get IP from x-real-ip header if cf-connecting-ip not present', () => {
			const request = new Request('http://example.com', {
				headers: {
					'x-real-ip': '10.0.0.1'
				}
			});
			
			const ip = getClientIP(request);
			expect(ip).toBe('10.0.0.1');
		});

		it('should get IP from x-forwarded-for header', () => {
			const request = new Request('http://example.com', {
				headers: {
					'x-forwarded-for': '172.16.0.1, 192.168.1.100'
				}
			});
			
			const ip = getClientIP(request);
			expect(ip).toBe('172.16.0.1');
		});

		it('should prioritize cf-connecting-ip over other headers', () => {
			const request = new Request('http://example.com', {
				headers: {
					'cf-connecting-ip': '192.168.1.1',
					'x-real-ip': '10.0.0.1',
					'x-forwarded-for': '172.16.0.1'
				}
			});
			
			const ip = getClientIP(request);
			expect(ip).toBe('192.168.1.1');
		});

		it('should return 0.0.0.0 if no IP headers present', () => {
			const request = new Request('http://example.com');
			
			const ip = getClientIP(request);
			expect(ip).toBe('0.0.0.0');
		});

		it('should extract first IP from comma-separated x-forwarded-for list', () => {
			const request = new Request('http://example.com', {
				headers: {
					'x-forwarded-for': '203.0.113.1, 203.0.113.2, 203.0.113.3'
				}
			});
			
			const ip = getClientIP(request);
			expect(ip).toBe('203.0.113.1');
		});

		it('should handle x-forwarded-for with spaces correctly', () => {
			const request = new Request('http://example.com', {
				headers: {
					'x-forwarded-for': '  203.0.113.1  ,  203.0.113.2  '
				}
			});
			
			const ip = getClientIP(request);
			expect(ip).toBe('203.0.113.1');
		});
	});

	describe('getLocationFromIP', () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it('should fetch location data from API', async () => {
			global.fetch = vi.fn(() =>
				Promise.resolve(
					new Response(
						JSON.stringify({
							country_name: 'United States',
							city: 'New York'
						})
					)
				)
			);

			const result = await getLocationFromIP('8.8.8.8');
			
			expect(result).toEqual({
				country: 'United States',
				city: 'New York'
			});
			expect(fetch).toHaveBeenCalledWith('https://ipapi.co/8.8.8.8/json/');
		});

		it('should return empty object if API response is not ok', async () => {
			global.fetch = vi.fn(() =>
				Promise.resolve(new Response('Not Found', { status: 404 }))
			);

			const result = await getLocationFromIP('8.8.8.8');
			
			expect(result).toEqual({});
		});

		it('should return empty object if fetch fails', async () => {
			global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

			const result = await getLocationFromIP('8.8.8.8');
			
			expect(result).toEqual({});
		});

		it('should return partial data if some fields are missing', async () => {
			global.fetch = vi.fn(() =>
				Promise.resolve(
					new Response(
						JSON.stringify({
							country_name: 'Canada'
						})
					)
				)
			);

			const result = await getLocationFromIP('8.8.8.8');
			
			expect(result).toEqual({
				country: 'Canada'
			});
		});

		it('should handle null values in response', async () => {
			global.fetch = vi.fn(() =>
				Promise.resolve(
					new Response(
						JSON.stringify({
							country_name: null,
							city: null
						})
					)
				)
			);

			const result = await getLocationFromIP('8.8.8.8');
			
			expect(result).toEqual({});
		});
	});
});
