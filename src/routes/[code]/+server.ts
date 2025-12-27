import { supabase } from '$lib/supabase';
import { redirect } from '@sveltejs/kit';
import { parseUserAgent, getLocationFromIP, getClientIP } from '$lib/analytics';

export const GET = async ({ params, request }) => {
  const { data:link } = await supabase
    .from('links')
    .select('id, long_url, clicks')
    .eq('short_code', params.code)
    .single();

  if (!link) {
    return new Response('Not found', { status: 404 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || '';
  const ip = getClientIP(request);

  const { device, os, browser } = parseUserAgent(userAgent);
  const location = await getLocationFromIP(ip);

  await supabase.from('link_clicks').insert({
    link_id: link.id,
    ip_address: ip,
    country: location.country,
    city: location.city,
    device,
    os, 
    browser,
    user_agent: userAgent,
    referrer
  });

  await supabase
    .from('links')
    .update({ clicks: link.clicks + 1 })
    .eq('short_code', params.code);

  throw redirect(302, link.long_url);
};
