import type { Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get('hc_session');
  const path = event.url.pathname;

  console.log(`[HOOKS] Request to ${path}`);
  console.log(`[HOOKS] Session cookie present:`, !!sessionId);

  if (sessionId) {
    console.log(`[HOOKS] Validating session:`, sessionId);
    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, first_name, last_name, slack_id')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error(`[HOOKS] Error fetching user:`, error);
    }

    if (user) {
      console.log(`[HOOKS] User authenticated:`, user.email);
      event.locals.user = { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        first_name: user.first_name,
        last_name: user.last_name,
        slack_id: user.slack_id,
        isAdmin: user.email === 'dev@localhost'
      };
    } else {
      console.log(`[HOOKS] No user found for session ID`);
    }
  }

  return resolve(event);
};
