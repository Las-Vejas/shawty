import { supabase } from '$lib/supabase';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ params }) => {
  const { data } = await supabase
    .from('links')
    .select('long_url, clicks')
    .eq('short_code', params.code)
    .single();

  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  await supabase
    .from('links')
    .update({ clicks: data.clicks + 1 })
    .eq('short_code', params.code);

  throw redirect(302, data.long_url);
};
