import { supabaseAdmin } from '$lib/supabaseAdmin';
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ params, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login');

	const linkId = params.linkId;
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 100;
	const offset = (page - 1) * limit;

	// Verify the link belongs to the user (admin client, but enforce ownership) - optimized column selection
	const { data: link, error: linkError } = await supabaseAdmin
		.from('links')
		.select('id,short_code,long_url,clicks,created_at')
		.eq('id', linkId)
		.eq('user_id', locals.user.id)
		.single();

	if (linkError || !link) {
		console.error('Link query error:', linkError);
		throw error(404, 'Link not found');
	}

	// Get paginated clicks for this link (admin client; ownership enforced above) - optimized column selection
	const { data: clicks, count, error: clicksError } = await supabaseAdmin
		.from('link_clicks')
		.select('country,device,os,browser,clicked_at,city,referrer', { count: 'exact' })
		.eq('link_id', linkId)
		.order('clicked_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (clicksError) {
		console.error('Clicks query error:', clicksError);
	}

	console.log(`Found ${count || 0} total clicks for link ${linkId}`);

	// Calculate analytics
	const analytics = {
		totalClicks: count || 0,
		byCountry: {} as Record<string, number>,
		byDevice: {} as Record<string, number>,
		byOS: {} as Record<string, number>,
		byBrowser: {} as Record<string, number>,
		byDate: {} as Record<string, number>,
	};

	clicks?.forEach((click) => {
		// Group by country
		const country = click.country || 'Unknown';
		analytics.byCountry[country] = (analytics.byCountry[country] || 0) + 1;

		// Group by device
		const device = click.device || 'Unknown';
		analytics.byDevice[device] = (analytics.byDevice[device] || 0) + 1;

		// Group by OS
		const os = click.os || 'Unknown';
		analytics.byOS[os] = (analytics.byOS[os] || 0) + 1;

		// Group by browser
		const browser = click.browser || 'Unknown';
		analytics.byBrowser[browser] = (analytics.byBrowser[browser] || 0) + 1;

		// Group by date
		const date = new Date(click.clicked_at).toLocaleDateString();
		analytics.byDate[date] = (analytics.byDate[date] || 0) + 1;
	});

	return { link, clicks: clicks || [], analytics, page, limit, total: count || 0 };
};