import { redirect } from '@sveltejs/kit';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { supabase } from '$lib/supabase';

export const GET = async ({ url, cookies, locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }

  const code = url.searchParams.get('code');
  if (!code) {
    throw redirect(302, '/login?error=no_code');
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      }
    });

    const githubUser = await userResponse.json();

    // Get email if not public
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      }
    });
    const emails = await emailResponse.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email || githubUser.email;

    const [firstName, ...lastNameParts] = (githubUser.name || '').split(' ');
    const lastName = lastNameParts.join(' ') || null;

    // Check if user exists by email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', primaryEmail)
      .single();

    let userId: string;

    if (existingUser) {
      // Update existing user
      await supabase
        .from('users')
        .update({
          name: githubUser.login,
          first_name: firstName || null,
          last_name: lastName
        })
        .eq('id', existingUser.id);

      userId = existingUser.id;
    } else {
      // Create new user - slack_id can be null for GitHub users
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: primaryEmail,
          name: githubUser.login,
          first_name: firstName || null,
          last_name: lastName,
          slack_id: null  // Make sure your DB allows NULL here!
        })
        .select('id')
        .single();

      if (error || !newUser) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }

      userId = newUser.id;
    }

    // Same cookie pattern as Hack Club
    cookies.set('hc_session', userId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30
    });

    throw redirect(302, '/');
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('GitHub auth error:', error);
    throw redirect(302, '/login?error=oauth_failed');
  }
};