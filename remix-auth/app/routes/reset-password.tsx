import { useLoaderData, Link, useActionData } from "@remix-run/react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import auth from "~/services/auth.server";
import { UserError } from "@edgedb/auth-remix/server";
import { BackIcon } from "../icons";
import ResetPasswordForm from "~/components/auth/ResetPasswordForm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const providers = await auth.getProvidersInfo();
  let resetToken = new URL(request.url).searchParams.get("reset_token");

  if (Array.isArray(resetToken)) {
    resetToken = resetToken[0];
  }

  const isTokenValid =
    (resetToken && auth.isPasswordResetTokenValid(resetToken)) || false;

  return json({
    providers,
    isTokenValid,
    resetToken,
  });
};

export default function ResetPasswordPage() {
  const { providers, isTokenValid, resetToken } =
    useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  return (
    <main className="my-auto p-8 min-w-[32rem]">
      <Link
        to={"/"}
        className="text-slate-600 inline-flex gap-1 items-center mb-2"
      >
        <BackIcon />
        Home
      </Link>
      <h1 className="text-3xl font-semibold mb-6">Email+Password</h1>

      <div className="flex gap-[5rem] w-max">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Reset password</h2>
          {providers.emailPassword ? (
            resetToken && isTokenValid ? (
              <ResetPasswordForm error={data?.error} resetToken={resetToken} />
            ) : (
              <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3 w-[22rem]">
                Reset token is invalid, it may have expired.{" "}
                <Link to="/forgot-password" className="text-sky-600">
                  Try sending another reset email
                </Link>
              </div>
            )
          ) : (
            <div className="text-slate-500 italic w-[14rem]">
              Email+Password provider is not enabled
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  return auth.emailPasswordResetPassword(request, ({ error }) => {
    if (error) {
      return json({
        error:
          error instanceof UserError
            ? `Error resetting password: ${error.message}`
            : `Unknown error occurred resetting password`,
      });
    } else {
      return redirect("/");
    }
  });
};
