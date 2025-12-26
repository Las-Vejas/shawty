import { redirect } from "@sveltejs/kit";
import { HACKCLUB_CLIENT_ID } from "$env/static/private";

export const GET = async () => {
  // HackClub Auth OAuth configuration
  const authUrl = new URL("https://auth.hackclub.com/oauth/authorize");
  
  authUrl.searchParams.set("client_id", HACKCLUB_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", "http://localhost:5173/auth/callback");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "email");
  
  throw redirect(302, authUrl.toString());
};
