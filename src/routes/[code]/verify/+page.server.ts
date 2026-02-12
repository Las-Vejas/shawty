import { supabase } from '$lib/supabase';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const { data: link } = await supabase
    .from('links')
    .select('short_code, password')
    .eq('short_code', params.code)
    .single();

  if (!link || !link.password) {
    throw redirect(302, `/${params.code}`);
  }

  return { code: params.code };
};

export const actions = {
  default: async ({ request, params, cookies }) => {
    const formData = await request.formData();
    const password = formData.get('password')?.toString();

    if (!password) {
      return fail(400, { error: 'Password is required' });
    }

    const { data: link } = await supabase
      .from('links')
      .select('password')
      .eq('short_code', params.code)
      .single();

    if (!link) {
      return fail(404, { error: 'Link not found' });
    }

    // Compare password
    if (password === link.password) {
      // Set cookie to remember verification (expires in 1 hour)
      cookies.set(`verified_${params.code}`, 'true', {
        path: '/',
        maxAge: 60 * 60,
        httpOnly: true,
        sameSite: 'lax'
      });
      
      throw redirect(302, `/${params.code}`);
    }

    return fail(401, { error: 'Incorrect password' });
  }
};
