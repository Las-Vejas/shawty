import { supabase } from '$lib/supabase';
import { redirect, fail, error } from '@sveltejs/kit';
import { PUBLIC_URL } from '$env/static/public';
import { SLACK_WEBHOOK_URL } from '$env/static/private';

// Get the hostname from PUBLIC_URL to block self-referencing links
const getHostname = (url: string): string | null => {
    try {
        return new URL(url).hostname.toLowerCase();
    } catch {
        return null;
    }
};

const BLOCKED_HOSTNAMES = [
    getHostname(PUBLIC_URL), // e.g., www.shawty.app
    'www.shawty.app',
    'shawty.app',
].filter(Boolean) as string[];

// Validate that URL doesn't point to our own domain (prevents loops)
const validateUrlNotSelfReferencing = (url: string): boolean => {
    const hostname = getHostname(url);
    if (!hostname) return false;
    
    // Check if hostname matches any blocked hostname
    return !BLOCKED_HOSTNAMES.some(blocked => 
        hostname === blocked || hostname.endsWith(`.${blocked}`)
    );
};

// Send Slack notification
const sendSlackAlert = async (user: any, attemptedUrl: string, action: 'create' | 'update') => {
    if (!SLACK_WEBHOOK_URL) {
        console.warn('SLACK_WEBHOOK_URL not configured, skipping Slack notification');
        return;
    }

    const displayName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.name || user.email;

    const slackMention = user.slack_id ? `<@${user.slack_id}>` : displayName;

    const message = {
        text: `🚨 Loop Protection Alert`,
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "🚨 Attempted Self-Referencing Link",
                    emoji: true
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*User:*\n${slackMention}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Action:*\n${action === 'create' ? 'Create new link' : 'Update existing link'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Email:*\n${user.email || 'N/A'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Slack ID:*\n${user.slack_id || 'N/A'}`
                    }
                ]
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Attempted URL:*\n\`${attemptedUrl}\``
                }
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `Blocked at ${new Date().toISOString()}`
                    }
                ]
            }
        ]
    };

    try {
        await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });
    } catch (err) {
        console.error('Failed to send Slack notification:', err);
    }
};

export const load = async ({ locals, url }) => {
    if (!locals.user) throw redirect(302, '/login');

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    const { data: links, count } = await supabase
        .from('links')
        .select('*', { count: 'exact' })
        .eq('user_id', locals.user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    return { links, page, limit, total: count || 0 };
};


export const actions = {
    update: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const linkId = formData.get('linkId')?.toString();
        let newUrl = formData.get('newUrl')?.toString();

        if (!linkId) {
            return fail(400, { error: 'Link ID is required' });
        }

        if (!newUrl || newUrl.trim() === '') {
            return fail(400, { error: 'URL cannot be empty' });
        }

        if (!newUrl.match(/^https?:\/\//i)) {
            newUrl = 'https://' + newUrl;
        }

        try {
            new URL(newUrl);
        } catch {
            return fail(400, { error: 'Invalid URL format' });
        }

        // Prevent self-referencing links (loop protection)
        if (!validateUrlNotSelfReferencing(newUrl)) {
            // Send Slack alert asynchronously (don't await to avoid blocking response)
            sendSlackAlert(locals.user, newUrl, 'update').catch(err =>
                console.error('Failed to send Slack alert:', err)
            );
            // Throw 404 error
            throw error(404, 'Cannot update to a URL that points to this domain');
        }

        const { error: dbError } = await supabase
            .from('links')
            .update({ long_url: newUrl })
            .eq('id', linkId)
            .eq('user_id', locals.user.id);

        if (dbError) {
            console.error('Database error:', dbError);
            return fail(500, { error: 'Failed to update link' });
        }

        return { updated: true };
    },

    toggleLeaderboard: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const linkId = formData.get('linkId')?.toString();
        const currentStatus = formData.get('currentStatus') === 'true';

        if (!linkId) {
            return fail(400, { error: 'Link ID is required' });
        }

        const { error: dbError } = await supabase
            .from('links')
            .update({ on_leaderboard: !currentStatus })
            .eq('id', linkId)
            .eq('user_id', locals.user.id);

        if (dbError) {
            console.error('Database error:', dbError);
            return fail(500, { error: 'Failed to update leaderboard status' });
        }

        return { toggled: true };
    },

    delete: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const linkId = formData.get('linkId')?.toString();

        if (!linkId) {
            return fail(400, { error: 'Link ID is required' });
        }

        const { error: dbError } = await supabase
            .from('links')
            .delete()
            .eq('id', linkId)
            .eq('user_id', locals.user.id);

        if (dbError) {
            console.error('Database error:', dbError);
            return fail(500, { error: 'Failed to delete link' });
        }

        return { deleted: true };
    }
};
