import { supabase } from '$lib/supabase';
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const linkId = params.linkId;

    const { data: link } = await supabase
        .from('links')
        .select('*')
        .eq('id', linkId)
        .eq('user_id', locals.user.id)
        .single();

    if (!link) {
        throw error(404, 'Link not found');
    }

    const { data: clicks } = await supabase
        .from('link_clicks')
        .select('*')
        .eq('link_id', linkId)
        .order('clicked_at', { ascending: false });

    const analytics = {
        totalClicks: clicks?.length || 0,
        byCountry: {} as Record<string, number>,
        byDevice: {} as Record<string, number>,
        byOS: {} as Record<string, number>,
        byBrowser: {} as Record<string, number>,
        byDate: {} as Record<string, number>,
    };

    clicks?.forEach((click) => {

        const country = click.country || 'Unknown';
        analytics.byCountry[country] = (analytics.byCountry[country] || 0) + 1;

        const device = click.device || 'Unknown';
        analytics.byDevice[device] = (analytics.byDevice[device] || 0) + 1;

        const os = click.os || 'Unknown';
        analytics.byOS[os] = (analytics.byOS[os] || 0) + 1;

        const browser = click.browser || 'Unknown';
        analytics.byBrowser[browser] = (analytics.byBrowser[browser] || 0) + 1;

        const date = new Date(click.clicked_at).toLocaleDateString();
        analytics.byDate[date] = (analytics.byDate[date] || 0) + 1;
    });

    return { link, clicks, analytics };
};