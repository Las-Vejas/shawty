import { redirect } from "@sveltejs/kit";

export const GET = async ({ cookies }) => {
  cookies.delete("hc_session", { path: "/" });
  cookies.delete("hc_session2", { path: "/" });
  throw redirect(302, "/");
};
