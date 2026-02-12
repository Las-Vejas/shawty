import { redirect } from '@sveltejs/kit';
import { GITHUB_CLIENT_ID } from '$env/static/private';

export const GET = async ({ locals, url }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set('redirect_uri', `${url.origin}/auth/github/callback`);
  githubAuthUrl.searchParams.set('scope', 'user:email');

  throw redirect(302, githubAuthUrl.toString());
};