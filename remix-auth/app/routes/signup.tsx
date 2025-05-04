import {
  useLoaderData,
  Link,
  useSearchParams,
  useActionData,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import auth from "~/services/auth.server";
import { UserError } from "@edgedb/auth-remix/server";
import { BackIcon } from "../icons";
import SignupForm from "../components/auth/SignupForm";
import { type ActionFunctionArgs } from "@remix-run/node";
import { createUser, transformSearchParams } from "~/utils";
import ResendVerificationEmail from "~/components/auth/ResendVerificationEmail";

export const loader = async () => {
  const providerInfo = await auth.getProvidersInfo();

  return json({
    providerInfo,
  });
};

export default function SignUpPage() {
  const { providerInfo } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const [searchParams] = useSearchParams();
  const params = transformSearchParams(searchParams);

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
        <h1 className="text-3xl font-semibold mb-6">Sign up</h1>

        <div className="flex gap-[5rem] w-max">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Email+Password</h2>
            {params.email_verification_error ? (
              <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md w-[22rem] flex flex-col items-start">
                {params.email_verification_error}
                {params.verification_token ? (
                  <ResendVerificationEmail
                    error={data?.error}
                    message={data?.message}
                    verificationToken={
                      Array.isArray(params.verification_token)
                        ? params.verification_token[0]
                        : params.verification_token
                    }
                  />
                ) : null}
              </div>
            ) : null}

            {providerInfo.emailPassword ? (
              <SignupForm error={data?.error} message={data?.message} />
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const action = formData.get("action");

  if (action && action === "resendVerEmail")
    return auth.emailPasswordResendVerificationEmail(request, async (error) => {
      if (error) {
        return json({ error: error.message, message: null });
      } else
        return json({
          error: null,
          message: "Verification email sent!",
        });
    });
  else
    return auth.emailPasswordSignUp(request, async ({ error, tokenData }) => {
      if (error) {
        return json({
          error:
            error instanceof UserError
              ? `Error signing up: ${error.message}`
              : `Unknown error occurred signing up`,
          message: null,
        });
      } else {
        try {
          if (!tokenData) {
            return json({
              error: null,
              message:
                `Email verification required: ` +
                `Follow the link in the verification email to finish registration`,
            });
          }

          await createUser(tokenData);

          return redirect("/");
        } catch (e) {
          return json({
            error: `Error signing up: ${
              e instanceof Error ? e.message : String(e)
            }`,
            message: null,
          });
        }
      }
    });
};
