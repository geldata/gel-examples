import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

import { auth } from "@/edgedb";
import { BackIcon } from "@/components/icons";

import { ResetPasswordForm } from "@/components/auth";

export const getServerSideProps = (async ({ req, query }) => {
  let resetToken = query["reset_token"];
  if (Array.isArray(resetToken)) {
    resetToken = resetToken[0];
  }

  return {
    props: {
      providerInfo: await auth.getProvidersInfo(),
      resetToken,
      resetTokenValid:
        resetToken !== undefined
          ? auth.isPasswordResetTokenValid(resetToken)
          : false,
    },
  };
}) satisfies GetServerSideProps<{
  providerInfo: any;
  resetToken: string | undefined;
  resetTokenValid: boolean;
}>;

export default function ResetPasswordPage({
  providerInfo,
  resetToken,
  resetTokenValid,
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
          <h2 className="text-xl font-semibold">Reset password</h2>
          {providerInfo.emailPassword ? (
            resetToken && resetTokenValid ? (
              <ResetPasswordForm resetToken={resetToken} />
            ) : (
              <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3 w-[22rem]">
                Reset token is invalid, it may have expired.{" "}
                <Link href="/forgot-password" className="text-sky-600">
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
