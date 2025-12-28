import type { Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get('hc_session');

  if (sessionId) {
    // Fetch user from database
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, first_name, last_name')
      .eq('id', sessionId)
      .single();

    if (user) {
      event.locals.user = { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        first_name: user.first_name,
        last_name: user.last_name
      };
    }
  }

  return resolve(event);
};
