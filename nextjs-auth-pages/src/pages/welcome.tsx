import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

import { auth, client } from "@/edgedb";
import { auth as clientAuth } from "@/edgedb.client";

export const getServerSideProps = (async ({ req }) => {
  const session = auth.getSession(req);

  if (await session.isSignedIn()) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const builtinUIEnabled = await client.queryRequiredSingle<boolean>(
    `select exists ext::auth::UIConfig`
  );

  return {
    props: { builtinUIEnabled },
  };
}) satisfies GetServerSideProps<{
  builtinUIEnabled: boolean;
}>;

export default function WelcomePage({
  builtinUIEnabled,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const searchParams = useRouter().query;

  return (
    <main className="my-auto p-8 min-w-[32rem] w-min">
      <h1 className="text-3xl font-semibold">Todo Example App</h1>
      <h2 className="text-xl text-slate-600">
        Next.js (Pages router) + EdgeDB Auth
      </h2>

      <p className="my-4">
        This is a simple todo example app to demonstrate how to integrate EdgeDB
        Auth into your{" "}
        <a href="https://nextjs.org" className="text-sky-600">
          Next.js
        </a>{" "}
        app, with the help of the{" "}
        <code className="bg-slate-50 p-1 rounded-md">@edgedb/auth-nextjs</code>{" "}
        library.
      </p>

      <p className="my-4">
        To start you need to login with either the custom login page, built
        using api's provided by the auth helper library, or with the EdgeDB's
        Builtin login UI.
      </p>

      {searchParams.error || searchParams.info ? (
        <div
          className={`${
            searchParams.error
              ? "bg-rose-100 text-rose-950"
              : "bg-sky-200 text-sky-950"
          } px-4 py-3 rounded-md`}
        >
          {searchParams.error || searchParams.info}
        </div>
      ) : null}

      <div className="flex gap-5 mt-6 items-start w-max">
        <Link
          className="block rounded-lg bg-slate-50 py-3 px-5 font-medium shadow-md shrink-0 hover:bg-white hover:scale-[1.03] transition-transform"
          href="/signin"
        >
          Sign in with custom UI
        </Link>
        <div className="w-min">
          <Link
            className={`block rounded-lg bg-slate-50 py-3 px-5 font-medium shadow-md shrink-0 whitespace-nowrap hover:bg-white hover:scale-[1.03] transition-transform ${
              !builtinUIEnabled ? "opacity-60 pointer-events-none" : ""
            }`}
            href={clientAuth.getBuiltinUIUrl()}
          >
            Sign in with ✨Built-in UI✨
          </Link>
          {!builtinUIEnabled ? (
            <div className="text-center mx-3 mt-3 text-slate-600 text-sm">
              You need to enable the built-in UI in the auth config
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
