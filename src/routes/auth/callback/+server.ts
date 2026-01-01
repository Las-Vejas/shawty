import { redirect } from "@sveltejs/kit";
import { HACKCLUB_CLIENT_ID, HACKCLUB_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_URL } from "$env/static/public";
import { supabase } from "$lib/supabase";

export const GET = async ({ url, cookies, locals }) => {
  if (locals.user) {
    throw redirect(302, "/");
  }

  const code = url.searchParams.get("code");
  if (!code) {
    throw redirect(302, "/login?error=no_code");
  }

  try {
    const tokenResponse = await fetch("https://auth.hackclub.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

    const userResponse = await fetch("https://auth.hackclub.com/api/v1/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();
    if (!userData.identity?.id) {
      throw new Error(`Failed to get user info: ${JSON.stringify(userData)}`);
    }

    console.log("userData:", JSON.stringify(userData, null, 2));

    const firstName = userData.identity.first_name || null;
    const lastName = userData.identity.last_name || null;
    const userName = userData.identity.primary_email?.split('@')[0] || 'user';
    const slack_id = userData.identity.slack_id || null;

    // Store or update user in database, always sync slack_id
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("user", userData.identity.id)
      .single();

    console.log("existingUser:", JSON.stringify(existingUser, null, 2));

    let userId: string;

    if (existingUser) {
      const { error, data } = await supabase
        .from("users")
        .update({
          name: userName,
          email: userData.identity.primary_email,
          slack_id: slack_id, // always sync slack_id
          first_name: firstName,
          last_name: lastName,
        })
        .eq("id", existingUser.id);

      console.log("update error:", error, "data:", data);

      userId = existingUser.id;
    } else {
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          user: userData.identity.id,
          slack_id: slack_id, // always sync slack_id
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

    cookies.set("hc_session", userId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 24 * 30,
    });

    throw redirect(302, "/");
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Auth callback error:', error);
    throw redirect(302, "/login?error=oauth_failed");
  }
};
