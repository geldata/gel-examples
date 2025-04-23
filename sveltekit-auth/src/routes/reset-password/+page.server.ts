import { fail, redirect } from "@sveltejs/kit";
import { UserError } from "@edgedb/auth-sveltekit/server";
import type { Actions } from "./$types";

export const load = async ({ locals, url }) => {
  const providers = await locals.auth.getProvidersInfo();
  let resetToken = url.searchParams.get("reset_token");

  if (Array.isArray(resetToken)) {
    resetToken = resetToken[0];
  }

  const isTokenValid =
    (resetToken && locals.auth.isPasswordResetTokenValid(resetToken)) || false;

  return {
    providers,
    isTokenValid,
    resetToken,
  };
};

export const actions = {
  default: async ({ locals, request }) => {
    try {
      const formData = await request.formData();
      await locals.auth.emailPasswordResetPassword(formData);
    } catch (e) {
      return fail(400, {
        error:
          e instanceof UserError
            ? `Error resetting password: ${e.message}`
            : `Unknown error occurred resetting password`,
      });
    }

    redirect(303, "/");
  },
} satisfies Actions;
