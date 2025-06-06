"use client";

import { useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { auth } from "@/edgedb.client";

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={`bg-sky-500 text-white p-3 rounded-md mt-3 shadow-md hover:scale-[1.03] transition-transform ${
        pending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {label}
    </button>
  );
}

export function SignInForm() {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        setPending(true);
        setError(null);
        try {
          await auth.emailPasswordSignIn(new FormData(e.currentTarget));
          router.push("/");
        } catch (e) {
          let err: any = e instanceof Error ? e.message : String(e);
          try {
            err = JSON.parse(err);
          } catch {}
          setError(
            `Error signing in: ${err?.error?.message ?? JSON.stringify(err)}`
          );
        } finally {
          setPending(false);
        }
      }}
      className="flex flex-col w-[22rem]"
    >
      {error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {error}
        </div>
      ) : null}

      <label htmlFor="email" className="font-medium text-sm mb-1 ml-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <div className="flex text-sm">
        <label htmlFor="password" className="font-medium mb-1 ml-2">
          Password
        </label>
        <Link
          href="/forgot-password"
          className="ml-auto text-slate-600 hover:text-sky-600"
        >
          Forgot password?
        </Link>
      </div>
      <input
        type="password"
        id="password"
        name="password"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <SubmitButton
        label={pending ? "Signing in..." : "Sign in"}
        pending={pending}
      />

      <div className="text-slate-500 mt-3">
        Don't have an account?{" "}
        <Link href="/signup" className="text-sky-600 hover:text-sky-700">
          Sign up
        </Link>
      </div>
    </form>
  );
}

export function SignUpForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        setPending(true);
        setError(null);
        setMessage(null);
        try {
          const message = await auth.emailPasswordSignUp(
            new FormData(e.currentTarget)
          );
          if (message) {
            setMessage(message);
          }
        } catch (e) {
          let err: any = e instanceof Error ? e.message : String(e);
          try {
            err = JSON.parse(err);
          } catch {}
          setError(
            `Error signing up: ${err?.error?.message ?? JSON.stringify(err)}`
          );
        } finally {
          setPending(false);
        }
      }}
      className="flex flex-col w-[22rem]"
    >
      {error || message ? (
        <div
          className={`${
            error ? "bg-rose-100 text-rose-950" : "bg-sky-200 text-sky-950"
          } px-4 py-3 rounded-md mb-3`}
        >
          {error || message}
        </div>
      ) : null}

      <label htmlFor="email" className="font-medium text-sm mb-1 ml-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <label htmlFor="password" className="font-medium text-sm mb-1 ml-2">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <SubmitButton
        label={pending ? "Signing up..." : "Sign up"}
        pending={pending}
      />

      <div className="text-slate-500 mt-3">
        Already have an account?{" "}
        <Link href="/signin" className="text-sky-600 hover:text-sky-700">
          Sign in
        </Link>
      </div>
    </form>
  );
}

export function SendResetEmailForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        setPending(true);
        setError(null);
        setMessage(null);
        try {
          const email = new FormData(e.currentTarget).get("email")!.toString();
          await auth.emailPasswordSendPasswordResetEmail({ email });
          setMessage(`Password reset email has been sent to '${email}'`);
        } catch (e) {
          let err: any = e instanceof Error ? e.message : String(e);
          try {
            err = JSON.parse(err);
          } catch {}
          setError(
            `Error sending password reset: ${
              err?.error?.message ?? JSON.stringify(err)
            }`
          );
        } finally {
          setPending(false);
        }
      }}
      className="flex flex-col w-[22rem]"
    >
      {error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="bg-sky-200 text-sky-950 px-4 py-3 rounded-md mb-3">
          {message}
        </div>
      ) : (
        <>
          <label htmlFor="email" className="font-medium text-sm mb-1 ml-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
          />
          <SubmitButton
            label={pending ? "Sending..." : "Send reset email"}
            pending={pending}
          />
        </>
      )}
    </form>
  );
}

export function ResetPasswordForm({ resetToken }: { resetToken: string }) {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        setPending(true);
        setError(null);
        try {
          await auth.emailPasswordResetPassword({
            reset_token: resetToken,
            password: new FormData(e.currentTarget).get("password")!.toString(),
          });
          router.push("/");
        } catch (e) {
          console.log(e);
          let err: any = e instanceof Error ? e.message : String(e);
          try {
            err = JSON.parse(err);
          } catch {}
          setError(
            `Error resetting password: ${
              err?.error?.message ?? JSON.stringify(err)
            }`
          );
        } finally {
          setPending(false);
        }
      }}
      className="flex flex-col w-[22rem]"
    >
      {error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {error}
        </div>
      ) : null}

      <label htmlFor="password" className="font-medium text-sm mb-1 ml-2">
        New password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <SubmitButton
        label={pending ? "Updating password..." : "Update password"}
        pending={pending}
      />
    </form>
  );
}

export function ResendVerificationEmail({
  verificationToken,
}: {
  verificationToken: string;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  return sent || sending ? (
    <div className="text-slate-600 mt-2">
      {sent ? "Verification email sent!" : "Sending verification email..."}
    </div>
  ) : (
    <button
      type="button"
      onClick={async () => {
        setSending(true);
        await auth.emailPasswordResendVerificationEmail({
          verification_token: verificationToken,
        });
        setSending(false);
        setSent(true);
      }}
      className="text-sky-600 mt-2"
    >
      Resend verification email
    </button>
  );
}
