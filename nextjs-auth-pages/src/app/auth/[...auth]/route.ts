import { redirect } from "next/navigation";

import { Octokit } from "@octokit/core";

import {
  BuiltinProviderNames,
  TokenData,
} from "@edgedb/auth-nextjs/pages/server";
import { auth, client } from "@/edgedb";

async function createUser(
  tokenData: TokenData,
  provider?: BuiltinProviderNames
) {
  let username: string | null = null;
  if (tokenData.provider_token && provider === "builtin::oauth_github") {
    const { data } = await new Octokit({
      auth: tokenData.provider_token,
    }).request("get /user");

    username = data.login;
  }
  await client.query(
    `
  with identity := (select ext::auth::Identity filter .id = <uuid>$identity_id),
  insert User {
    identity := identity,
    name := <optional str>$username ?? (
      select ext::auth::EmailFactor filter .identity = identity
    ).email
  } unless conflict on .identity`,
    {
      identity_id: tokenData.identity_id,
      username: username,
    }
  );
}

export const { GET, POST } = auth.createAuthRouteHandlers({
  async onOAuthCallback({ error, tokenData, provider, isSignUp }) {
    if (error) {
      return redirect(
        `/signin?oauth_error=${encodeURIComponent(
          `OAuth sign in failed: ${error.message}`
        )}`
      );
    }
    if (isSignUp) {
      await createUser(tokenData, provider);
    }
    redirect("/");
  },
  async onEmailVerify({ error, tokenData, verificationToken }) {
    if (error) {
      const params = new URLSearchParams({
        email_verification_error: `Email verification failed: ${error.message}`,
      });
      if (verificationToken) {
        params.set("verification_token", verificationToken);
      }
      return redirect(`/signup?${params.toString()}`);
    }
    await createUser(tokenData);
    redirect("/");
  },
  async onBuiltinUICallback({ error, tokenData, provider, isSignUp }) {
    if (error) {
      return redirect(
        `/?error=${encodeURIComponent(
          `Sign in with built-in UI failed: ${error.message}`
        )}`
      );
    }
    if (!tokenData) {
      return redirect(
        `/?info=${encodeURIComponent(
          `Your email address requires validation before you can sign in. ` +
            `Follow the link in the verification email to continue.`
        )}`
      );
    }
    if (isSignUp) {
      await createUser(tokenData, provider);
    }
    redirect("/");
  },
  async onEmailPasswordSignUp({ error, tokenData }) {
    if (error) throw error;
    if (!tokenData) {
      return Response.json(
        `Email verification required: ` +
          `Follow the link in the verification email to finish registration`
      );
    }
    await createUser(tokenData);
    redirect("/");
  },
  onSignout() {
    redirect("/");
  },
});
