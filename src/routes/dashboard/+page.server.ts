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
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const formData = await request.formData();
		const url = formData.get('url')?.toString();

		if (!url) {
			return fail(400, { error: 'URL is required' });
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
		});

		if (error) {
			console.error('Database error:', error);
			return fail(500, { error: 'Failed to create short link' });
		}

		return { success: true, shortCode };
	},
};
