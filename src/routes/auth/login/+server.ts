import { redirect } from "@sveltejs/kit";
import { HACKCLUB_CLIENT_ID } from "$env/static/private";
import { PUBLIC_URL } from "$env/static/public";

export const GET = async () => {
  // HackClub Auth OAuth configuration
  const authUrl = new URL("https://auth.hackclub.com/oauth/authorize");
  
  authUrl.searchParams.set("client_id", HACKCLUB_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", `${PUBLIC_URL}/auth/callback`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "email profile name");
  
  throw redirect(302, authUrl.toString());
};
