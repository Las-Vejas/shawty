import { redirect } from "@sveltejs/kit";

export const GET = async ({ cookies }) => {
  cookies.delete("hc_session", { path: "/" });
  throw redirect(302, "/");
};
