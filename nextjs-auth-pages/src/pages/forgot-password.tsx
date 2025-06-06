import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

import { auth } from "@/edgedb";
import { BackIcon } from "@/components/icons";

import { SendResetEmailForm } from "@/components/auth";

export const getServerSideProps = (async ({ req }) => {
  return {
    props: { providerInfo: await auth.getProvidersInfo() },
  };
}) satisfies GetServerSideProps<{
  providerInfo: any;
}>;

export default function ForgotPasswordPage({
  providerInfo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="my-auto p-8 min-w-[32rem]">
      <Link
        href={"/"}
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
            <SendResetEmailForm />
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
