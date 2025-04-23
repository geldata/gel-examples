import { fail, redirect } from "@sveltejs/kit";
import { UserError } from "@edgedb/auth-sveltekit/server";
import type { Actions } from "./$types";

export const load = async ({ locals }) => ({
  providers: await locals.auth.getProvidersInfo(),
});

export const actions = {
  default: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      await locals.auth.emailPasswordSignIn(formData);
    } catch (e) {
      return fail(400, {
        error:
          e instanceof UserError
            ? `Error signing in: ${e.message}`
            : `Unknown error occurred signing in`,
      });
    }

    redirect(303, "/");
  },
} satisfies Actions;
