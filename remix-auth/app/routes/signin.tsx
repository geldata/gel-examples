import {
  useLoaderData,
  Link,
  useSearchParams,
  useActionData,
} from "@remix-run/react";
import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import auth from "~/services/auth.server";
import { UserError } from "@edgedb/auth-remix/server";
import clientAuth from "~/services/auth";
import { BackIcon, OAuthIcons } from "../icons";
import SigninForm from "../components/auth/SigninForm";
import { transformSearchParams } from "~/utils";

export const loader = async () => {
  const providers = await auth.getProvidersInfo();

  return json({
    providers,
  });
};

export default function SignInPage() {
  const { providers } = useLoaderData<typeof loader>();
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
        <h1 className="text-3xl font-semibold mb-6">Sign in</h1>

        <div className="flex gap-[5rem] w-max">
          <div className="flex flex-col gap-4 w-[18rem]">
            <h2 className="text-xl font-semibold">OAuth</h2>

            {params.oauth_error ? (
              <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md">
                {params.oauth_error}
              </div>
            ) : null}

            {providers.oauth.length ? (
              providers.oauth.map((provider) => (
                <a
                  key={provider.name}
                  href={clientAuth.getOAuthUrl(provider.name)}
                  className="rounded-lg bg-slate-50 p-3 font-medium shadow-md shrink-0 hover:bg-white hover:scale-[1.03] transition-transform
                flex items-center"
                >
                  {OAuthIcons[provider.name]}
                  <span className="ml-3">{provider.display_name}</span>
                </a>
              ))
            ) : (
              <div className="text-slate-500 italic w-[14rem]">
                No OAuth providers configured
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Email+Password</h2>
            {providers.emailPassword ? (
              <SigninForm error={data?.error} />
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

export const action = ({ request }: ActionFunctionArgs) => {
  return auth.emailPasswordSignIn(request, ({ error }) => {
    if (error) {
      return json({
        error:
          error instanceof UserError
            ? `Error signing in: ${error.message}`
            : `Unknown error occurred signing in`,
      });
    } else {
      return redirect("/");
    }
  });
};
