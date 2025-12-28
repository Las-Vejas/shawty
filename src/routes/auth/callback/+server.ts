import { redirect } from "@sveltejs/kit";
import { HACKCLUB_CLIENT_ID, HACKCLUB_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_URL } from "$env/static/public";
import { supabase } from "$lib/supabase";

export const GET = async ({ url, cookies, locals }) => {
  // If already logged in, just redirect to home
  if (locals.user) {
    throw redirect(302, "/");
  }

  const code = url.searchParams.get("code");
  
  if (!code) {
    throw redirect(302, "/login?error=no_code");
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://auth.hackclub.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: HACKCLUB_CLIENT_ID,
        client_secret: HACKCLUB_CLIENT_SECRET,
        code,
        redirect_uri: `${PUBLIC_URL}/auth/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
    }

    // Get user info from HackClub Auth API (not OIDC endpoint)
    const userResponse = await fetch("https://auth.hackclub.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userData.identity?.id) {
      throw new Error(`Failed to get user info: ${JSON.stringify(userData)}`);
    }

    // Debug: Log to both console and redirect with data
    console.log('Hack Club user data:', JSON.stringify(userData, null, 2));
    console.log('Identity fields:', Object.keys(userData.identity || {}));

    // Extract first and last name from identity
    const firstName = userData.identity.first_name || null;
    const lastName = userData.identity.last_name || null;
    
    // Use email prefix as username
    const userName = userData.identity.primary_email?.split('@')[0] || 'user';
    
    console.log('Extracted:', { userName, firstName, lastName });

    // Store or update user in database
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("slack_id", userData.identity.id)
      .single();

    let userId: string;

    if (existingUser) {
      // Update existing user's data in case it changed
      await supabase
        .from("users")
        .update({
          name: userName,
          email: userData.identity.primary_email,
          first_name: firstName,
          last_name: lastName,
        })
        .eq("id", existingUser.id);
      
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          slack_id: userData.identity.id,
          email: userData.identity.primary_email,
          name: userName,
          first_name: firstName,
          last_name: lastName,
        })
        .select("id")
        .single();

      if (error || !newUser) {
        throw new Error("Failed to create user");
      }

      userId = newUser.id;
    }

    // Set session cookie
    cookies.set("hc_session", userId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Always false in development
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Redirect to home page instead of dashboard to avoid loops
    throw redirect(302, "/");
  } catch (error) {
    // Re-throw redirects (they're not actual errors)
    if (error instanceof Response) {
      throw error;
    }
    console.error('Auth callback error:', error);
    throw redirect(302, "/login?error=oauth_failed");
  }
};
