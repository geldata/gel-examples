import { useLoaderData, Link, useActionData } from "@remix-run/react";
import auth from "~/services/auth.server";
import { UserError } from "@edgedb/auth-remix/server";
import { BackIcon } from "../icons";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import ForgotPasswordForm from "~/components/auth/ForgotPasswordForm";

export const loader = async () => {
  return json({
    providerInfo: await auth.getProvidersInfo(),
  });
};

export default function ForgotPasswordPage() {
  const { providerInfo } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  return (
    <main className="h-screen flex justify-center items-center">
      <div className="p-8 min-w-[32rem]">
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
            <h2 className="text-xl font-semibold">Send password reset email</h2>
            {providerInfo.emailPassword ? (
              <ForgotPasswordForm error={data?.error} message={data?.message} />
            ) : (
              <div className="text-slate-500 italic w-[14rem]">
                Email+Password provider is not enabled
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.emailPasswordSendPasswordResetEmail(
    request,
    async ({ error }) => {
      if (error) {
        return json({
          error:
            error instanceof UserError
              ? `Error sending password reset: ${error.message}`
              : `Unknown error occurred sending password reset`,
          message: null,
        });
      } else {
        const email = (await request.clone().formData())
          .get("email")!
          .toString();

        return json({
          error: null,
          message: `Password reset email has been sent to '${email}'`,
        });
      }
    }
  );
}
