import { supabase } from '$lib/supabase';
import { redirect, fail, error } from '@sveltejs/kit';
import { validateUrlNotSelfReferencing, validateAndNormalizeUrl } from '$lib/urlValidation';
import { sendSlackAlert } from '$lib/slack';
import { fetchUserLinks } from '$lib/database';

export const load = async ({ locals, url }) => {
    if (!locals.user) throw redirect(302, '/login');

    const page = parseInt(url.searchParams.get('page') || '1');
    // Clamp page to valid range
    const validPage = Math.max(1, page);
    
    const result = await fetchUserLinks({ userId: locals.user.id, page: validPage, limit: 20 });
    
    return {
        ...result,
        // Cache hints for browser
        cache: {
            maxAge: 60  // Cache for 1 minute
        }
    };
};


export const actions = {
    update: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const linkId = formData.get('linkId')?.toString();
        const urlInput = formData.get('newUrl')?.toString();

        if (!linkId) {
            return fail(400, { error: 'Link ID is required' });
        }

        if (!urlInput || urlInput.trim() === '') {
            return fail(400, { error: 'URL cannot be empty' });
        }

        const urlValidation = validateAndNormalizeUrl(urlInput);
        if (!urlValidation.valid) {
            return fail(400, { error: urlValidation.error });
        }

        const newUrl = urlValidation.normalizedUrl!;
        
        if (!validateUrlNotSelfReferencing(newUrl)) {
            throw error(400, 'Cannot update to a URL that points to this domain');
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
