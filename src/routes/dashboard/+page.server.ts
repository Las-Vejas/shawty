import { supabase } from '$lib/supabase';
import { redirect, fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', locals.user.id)
        .order('created_at', { ascending: false });

    return { links };
};

export const actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        let url = formData.get('url')?.toString();

        if (!url) {
            return fail(400, { error: 'URL is required' });
        }

        // Add https:// if no protocol is specified
        if (!url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return fail(400, { error: 'Invalid URL format' });
        }

        // Generate short code (6 random characters)
        const shortCode = Math.random().toString(36).substring(2, 8);

        // Insert into database
        const { error } = await supabase.from('links').insert({
            short_code: shortCode,
            long_url: url,
            user_id: locals.user.id,
            clicks: 0,
            on_leaderboard: false,
        });

        if (error) {
            console.error('Database error:', error);
            return fail(500, { error: 'Failed to create short link' });
        }

        return { success: true, shortCode };
    },

    update: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const linkId = formData.get('linkId')?.toString();
        let newUrl = formData.get('newUrl')?.toString();

        console.log('Update request:', { linkId, newUrl }); // Debug log

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

        const { error } = await supabase
            .from('links')
            .update({ long_url: newUrl })
            .eq('id', linkId)
            .eq('user_id', locals.user.id);

        if (error) {
            console.error('Database error:', error);
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

        const { error } = await supabase
            .from('links')
            .update({ on_leaderboard: !currentStatus })
            .eq('id', linkId)
            .eq('user_id', locals.user.id);

        if (error) {
            console.error('Database error:', error);
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

        // Delete the link (only if it belongs to the user)
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', linkId)
            .eq('user_id', locals.user.id);

        if (error) {
            console.error('Database error:', error);
            return fail(500, { error: 'Failed to delete link' });
        }

        return { deleted: true };
    }
};
