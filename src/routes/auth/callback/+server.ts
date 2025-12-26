import { redirect } from "@sveltejs/kit";
import { HACKCLUB_CLIENT_ID, HACKCLUB_CLIENT_SECRET } from "$env/static/private";
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
        redirect_uri: "http://localhost:5173/auth/callback",
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
    }

    // Get user info from HackClub Auth API
    const userResponse = await fetch("https://auth.hackclub.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userData.identity?.id) {
      throw new Error(`Failed to get user info: ${JSON.stringify(userData)}`);
    }

    // Store or update user in database
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("slack_id", userData.identity.id)
      .single();

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          slack_id: userData.identity.id,
          email: userData.identity.primary_email,
          name: userData.identity.primary_email?.split('@')[0] || 'User',
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
    throw redirect(302, "/login?error=oauth_failed");
  }
};
