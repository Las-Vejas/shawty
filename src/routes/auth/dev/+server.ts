import { redirect, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET = async ({ url, cookies }) => {
  // Only allow on localhost
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (!isLocalhost) {
    throw error(403, 'Dev login only available on localhost');
  }

  // Get or create a test user
  const { data: testUser, error: selectError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', 'dev@localhost')
    .single();

  let userId: string;

  if (testUser) {
    userId = testUser.id;
  } else {
    // Create test user if it doesn't exist
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        user: 'dev-local',
        email: 'dev@localhost',
        name: 'Dev User',
        first_name: 'Dev',
        last_name: 'User'
      })
      .select('id')
      .single();

    if (insertError || !newUser) {
      throw error(500, 'Failed to create dev user');
    }

    userId = newUser.id;
  }

  // Set session cookie
  cookies.set('hc_session', userId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24 * 30
  });

  throw redirect(302, '/dashboard');
};
