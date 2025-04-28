import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

import { auth } from "@/edgedb";
import { BackIcon } from "@/components/icons";

import { ResendVerificationEmail, SignUpForm } from "@/components/auth";

export const getServerSideProps = (async ({ req }) => {
  return {
    props: { providerInfo: await auth.getProvidersInfo() },
  };
}) satisfies GetServerSideProps<{
  providerInfo: any;
}>;

export default function SignUpPage({
  providerInfo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const searchParams = useRouter().query;

  return (
    <main className="my-auto p-8 min-w-[32rem]">
      <Link
        href={"/"}
        className="text-slate-600 inline-flex gap-1 items-center mb-2"
      >
        <BackIcon />
        Home
      </Link>
      <h1 className="text-3xl font-semibold mb-6">Sign up</h1>

      <div className="flex gap-[5rem] w-max">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Email+Password</h2>

          {searchParams.email_verification_error ? (
            <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md w-[22rem] flex flex-col items-start">
              {searchParams.email_verification_error}
              {searchParams.verification_token ? (
                <ResendVerificationEmail
                  verificationToken={
                    Array.isArray(searchParams.verification_token)
                      ? searchParams.verification_token[0]
                      : searchParams.verification_token
                  }
                />
              ) : null}
            </div>
          ) : null}

          {providerInfo.emailPassword ? (
            <SignUpForm />
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
