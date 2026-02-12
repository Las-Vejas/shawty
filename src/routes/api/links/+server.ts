import { supabase } from '$lib/supabase';
import { validateUrlNotSelfReferencing, validateAndNormalizeUrl } from '$lib/urlValidation';
import { sendSlackAlert } from '$lib/slack';
import { fetchUserLinks } from '$lib/database';
import { hashPassword } from '$lib/password';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
    // Check authentication
    if (!locals.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const result = await fetchUserLinks({ userId: locals.user.id, page, limit });

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('API error:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch links' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const POST: RequestHandler = async ({ request, locals }) => {
    // Check authentication
    if (!locals.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        let { url, customSlug, password } = body;

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate and normalize URL
        const urlValidation = validateAndNormalizeUrl(url);
        if (!urlValidation.valid) {
            return new Response(JSON.stringify({ error: urlValidation.error }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        url = urlValidation.normalizedUrl!;

        // Prevent self-referencing links (loop protection)
        if (!validateUrlNotSelfReferencing(url)) {
            // Send Slack alert asynchronously
            sendSlackAlert(locals.user, url, 'create').catch(err =>
                console.error('Failed to send Slack alert:', err)
            );
            return new Response(JSON.stringify({ error: 'Cannot create shortlinks that point to this domain' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Handle custom slug
        let shortCode: string;
        let isCustom = false;

        if (customSlug) {
            customSlug = customSlug.trim();
            // Validate custom slug: alphanumeric and hyphens only, 3-20 chars
            if (!/^[a-zA-Z0-9-]{3,20}$/.test(customSlug)) {
                return new Response(JSON.stringify({ error: 'Custom slug must be 3-20 characters (letters, numbers, hyphens only)' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Check if slug is already taken
            const { data: existing } = await supabase
                .from('links')
                .select('id')
                .eq('short_code', customSlug)
                .single();

            if (existing) {
                return new Response(JSON.stringify({ error: 'This custom slug is already taken' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            shortCode = customSlug;
            isCustom = true;
        } else {
            // Generate random short code (6 random characters)
            shortCode = Math.random().toString(36).substring(2, 8);
        }

        // Hash password if provided
        let hashedPassword: string | null = null;
        if (password) {
            hashedPassword = await hashPassword(password);
        }

        // Insert into database
        const { error: dbError } = await supabase.from('links').insert({
            short_code: shortCode,
            long_url: url,
            user_id: locals.user.id,
            clicks: 0,
            on_leaderboard: false,
            custom_slug: isCustom,
            password: hashedPassword
        });

        if (dbError) {
            console.error('Database error:', dbError);
            if (dbError.code === '23505') {
                return new Response(JSON.stringify({ error: 'This slug is already taken' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return new Response(JSON.stringify({ error: 'Failed to create short link' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            shortCode
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('API error:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
