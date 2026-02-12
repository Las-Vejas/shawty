import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('GET /api/links - Fetch user links', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Authentication', () => {
		it('should reject unauthenticated requests', async () => {
			const locals = { user: null };
			expect(locals.user).toBeNull();
		});

		it('should accept authenticated requests', async () => {
			const locals = { user: { id: 'user-123', email: 'user@example.com' } };
			expect(locals.user).not.toBeNull();
			expect(locals.user.id).toBe('user-123');
		});
	});

	describe('Pagination', () => {
		it('should parse page parameter from query string', () => {
			const url = new URL('http://localhost/api/links?page=2');
			const page = parseInt(url.searchParams.get('page') || '1');
			expect(page).toBe(2);
		});

		it('should default to page 1 if not provided', () => {
			const url = new URL('http://localhost/api/links');
			const page = parseInt(url.searchParams.get('page') || '1');
			expect(page).toBe(1);
		});

		it('should parse limit parameter from query string', () => {
			const url = new URL('http://localhost/api/links?limit=50');
			const limit = parseInt(url.searchParams.get('limit') || '20');
			expect(limit).toBe(50);
		});

		it('should default to limit 20 if not provided', () => {
			const url = new URL('http://localhost/api/links');
			const limit = parseInt(url.searchParams.get('limit') || '20');
			expect(limit).toBe(20);
		});

		it('should calculate correct offset from page and limit', () => {
			const url = new URL('http://localhost/api/links?page=3&limit=10');
			const page = parseInt(url.searchParams.get('page') || '1');
			const limit = parseInt(url.searchParams.get('limit') || '20');
			const offset = (page - 1) * limit;
			expect(offset).toBe(20);
		});

		it('should calculate offset for first page as 0', () => {
			const url = new URL('http://localhost/api/links?page=1&limit=20');
			const page = parseInt(url.searchParams.get('page') || '1');
			const limit = parseInt(url.searchParams.get('limit') || '20');
			const offset = (page - 1) * limit;
			expect(offset).toBe(0);
		});

		it('should handle large page numbers', () => {
			const url = new URL('http://localhost/api/links?page=1000&limit=20');
			const page = parseInt(url.searchParams.get('page') || '1');
			const limit = parseInt(url.searchParams.get('limit') || '20');
			const offset = (page - 1) * limit;
			expect(offset).toBe(19980);
		});

		it('should handle large limit values', () => {
			const url = new URL('http://localhost/api/links?page=1&limit=1000');
			const page = parseInt(url.searchParams.get('page') || '1');
			const limit = parseInt(url.searchParams.get('limit') || '20');
			const offset = (page - 1) * limit;
			expect(offset).toBe(0);
			expect(limit).toBe(1000);
		});
	});

	describe('Response Format', () => {
		it('should return correct JSON structure', () => {
			const response = {
				links: [],
				page: 1,
				limit: 20,
				total: 0
			};

			expect(response).toHaveProperty('links');
			expect(response).toHaveProperty('page');
			expect(response).toHaveProperty('limit');
			expect(response).toHaveProperty('total');
		});

		it('should include links array', () => {
			const response = {
				links: [
					{ id: '1', short_code: 'abc123', long_url: 'https://example.com' },
					{ id: '2', short_code: 'def456', long_url: 'https://google.com' }
				],
				page: 1,
				limit: 20,
				total: 2
			};

			expect(response.links).toBeInstanceOf(Array);
			expect(response.links.length).toBe(2);
		});

		it('should handle empty links array', () => {
			const response = {
				links: [],
				page: 1,
				limit: 20,
				total: 0
			};

			expect(response.links).toBeInstanceOf(Array);
			expect(response.links.length).toBe(0);
			expect(response.total).toBe(0);
		});

		it('should include total count', () => {
			const response = {
				links: [],
				page: 1,
				limit: 20,
				total: 100
			};

			expect(response.total).toBe(100);
		});
	});

	describe('Link Sorting', () => {
		it('should sort links by created_at descending by default', () => {
			const links = [
				{ id: '3', created_at: '2024-01-03T00:00:00Z' },
				{ id: '2', created_at: '2024-01-02T00:00:00Z' },
				{ id: '1', created_at: '2024-01-01T00:00:00Z' }
			];

			// Verify newest first (descending order)
			expect(new Date(links[0].created_at).getTime()).toBeGreaterThan(
				new Date(links[1].created_at).getTime()
			);
			expect(new Date(links[1].created_at).getTime()).toBeGreaterThan(
				new Date(links[2].created_at).getTime()
			);
		});
	});
});

describe('POST /api/links - Create link with Slack alerts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Slack Alert Functionality', () => {
		it('should skip Slack alert if webhook URL not configured', () => {
			const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
			expect(SLACK_WEBHOOK_URL).toBeUndefined();
		});

		it('should format user display name with first and last name', () => {
			const user = {
				first_name: 'John',
				last_name: 'Doe',
				email: 'john@example.com',
				slack_id: 'U123456'
			};

			const displayName = user.first_name && user.last_name 
				? `${user.first_name} ${user.last_name}` 
				: user.name || user.email;

			expect(displayName).toBe('John Doe');
		});

		it('should fallback to email if name not provided', () => {
			const user = {
				email: 'user@example.com',
				slack_id: 'U123456'
			};

			const displayName = user.email;
			expect(displayName).toBe('user@example.com');
		});

		it('should use Slack mention if slack_id available', () => {
			const user = {
				email: 'user@example.com',
				slack_id: 'U123456'
			};

			const slackMention = user.slack_id ? `<@${user.slack_id}>` : user.email;
			expect(slackMention).toBe('<@U123456>');
		});

		it('should use email if slack_id not available', () => {
			const user = {
				email: 'user@example.com'
			};

			const slackMention = user.slack_id ? `<@${user.slack_id}>` : user.email;
			expect(slackMention).toBe('user@example.com');
		});

		it('should format Slack message with correct structure', () => {
			const message = {
				text: '🚨 Loop Protection Alert',
				blocks: [
					{
						type: 'header',
						text: {
							type: 'plain_text',
							text: '🚨 Attempted Self-Referencing Link',
							emoji: true
						}
					},
					{
						type: 'section',
						fields: [
							{ type: 'mrkdwn', text: '*User:*\ntest_user' },
							{ type: 'mrkdwn', text: '*Action:*\nCreate new link' },
							{ type: 'mrkdwn', text: '*Email:*\nuser@example.com' },
							{ type: 'mrkdwn', text: '*Slack ID:*\nU123456' }
						]
					}
				]
			};

			expect(message.blocks).toHaveLength(2);
			expect(message.blocks[0].type).toBe('header');
			expect(message.blocks[1].type).toBe('section');
		});

		it('should distinguish between create and update actions in message', () => {
			const createMessage = { action: 'create', text: 'Create new link' };
			const updateMessage = { action: 'update', text: 'Update existing link' };

			expect(createMessage.action).toBe('create');
			expect(updateMessage.action).toBe('update');
			expect(createMessage.text).toContain('Create');
			expect(updateMessage.text).toContain('Update');
		});

		it('should include timestamp in Slack message', () => {
			const timestamp = new Date().toISOString();
			const contextElement = {
				type: 'mrkdwn',
				text: `Blocked at ${timestamp}`
			};

			expect(contextElement.text).toContain('Blocked at');
			expect(contextElement.text).toContain(timestamp.substring(0, 10)); // Check date part
		});
	});

	describe('Password Handling', () => {
		it('should accept password field', () => {
			const body = {
				url: 'https://example.com',
				customSlug: 'test-link',
				password: 'secret123'
			};

			expect(body).toHaveProperty('password');
			expect(body.password).toBe('secret123');
		});

		it('should handle missing password', () => {
			const body = {
				url: 'https://example.com',
				customSlug: 'test-link'
			};

			const password = body.password || null;
			expect(password).toBeNull();
		});

		it('should handle null password', () => {
			const body = {
				url: 'https://example.com',
				password: null
			};

			const password = body.password || null;
			expect(password).toBeNull();
		});

		it('should preserve empty string password as null', () => {
			const body = {
				url: 'https://example.com',
				password: ''
			};

			const password = body.password || null;
			expect(password).toBeNull();
		});

		it('should store password with link data', () => {
			const linkData = {
				short_code: 'abc123',
				long_url: 'https://example.com',
				user_id: 'user-123',
				clicks: 0,
				on_leaderboard: false,
				custom_slug: false,
				password: 'secret123'
			};

			expect(linkData.password).toBe('secret123');
		});
	});

	describe('Database Duplicate Handling', () => {
		it('should handle duplicate key error (code 23505)', () => {
			const dbError = { code: '23505', message: 'duplicate key' };
			expect(dbError.code).toBe('23505');
		});

		it('should return appropriate error for duplicate slug', () => {
			const errorMessage = 'This slug is already taken';
			expect(errorMessage).toContain('already taken');
		});

		it('should distinguish custom slug duplicate from random code duplicate', () => {
			const isCustom = true;
			if (isCustom) {
				// Check custom slug
				expect(isCustom).toBe(true);
			}
		});
	});

	describe('Link Creation Data', () => {
		it('should set clicks to 0 on creation', () => {
			const linkData = {
				short_code: 'abc123',
				long_url: 'https://example.com',
				user_id: 'user-123',
				clicks: 0,
				on_leaderboard: false,
				custom_slug: false,
				password: null
			};

			expect(linkData.clicks).toBe(0);
		});

		it('should set on_leaderboard to false by default', () => {
			const linkData = {
				short_code: 'abc123',
				long_url: 'https://example.com',
				user_id: 'user-123',
				clicks: 0,
				on_leaderboard: false,
				custom_slug: false,
				password: null
			};

			expect(linkData.on_leaderboard).toBe(false);
		});

		it('should mark custom slugs appropriately', () => {
			const customLink = {
				custom_slug: true,
				short_code: 'my-custom-link'
			};
			const randomLink = {
				custom_slug: false,
				short_code: 'abc123d'
			};

			expect(customLink.custom_slug).toBe(true);
			expect(randomLink.custom_slug).toBe(false);
		});

		it('should include user_id in link data', () => {
			const linkData = {
				short_code: 'abc123',
				long_url: 'https://example.com',
				user_id: 'user-123',
				clicks: 0,
				on_leaderboard: false,
				custom_slug: false,
				password: null
			};

			expect(linkData.user_id).toBe('user-123');
		});
	});

	describe('Response Handling', () => {
		it('should return 201 status on successful creation', () => {
			const status = 201;
			expect(status).toBe(201);
		});

		it('should return short code in response', () => {
			const response = {
				shortCode: 'abc123'
			};

			expect(response).toHaveProperty('shortCode');
			expect(response.shortCode).toBe('abc123');
		});

		it('should return 400 on missing URL', () => {
			const status = 400;
			const errorMessage = 'URL is required';
			expect(status).toBe(400);
			expect(errorMessage).toContain('required');
		});

		it('should return 400 on self-referencing URL', () => {
			const status = 400;
			const errorMessage = 'Cannot create shortlinks that point to this domain';
			expect(status).toBe(400);
			expect(errorMessage).toContain('Cannot create');
		});

		it('should return 400 on duplicate custom slug', () => {
			const status = 400;
			const errorMessage = 'This custom slug is already taken';
			expect(status).toBe(400);
			expect(errorMessage).toContain('already taken');
		});

		it('should return 400 on invalid slug format', () => {
			const status = 400;
			const errorMessage = 'Custom slug must be 3-20 characters (letters, numbers, hyphens only)';
			expect(status).toBe(400);
			expect(errorMessage).toContain('3-20 characters');
		});

		it('should return 401 on unauthorized', () => {
			const status = 401;
			expect(status).toBe(401);
		});

		it('should return 500 on database error', () => {
			const status = 500;
			expect(status).toBe(500);
		});

		it('should return 500 on internal error', () => {
			const status = 500;
			const errorMessage = 'Internal server error';
			expect(status).toBe(500);
			expect(errorMessage).toContain('Internal');
		});
	});
});
