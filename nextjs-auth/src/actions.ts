"use server";

import { revalidatePath } from "next/cache";

import { Octokit } from "@octokit/core";

import { BuiltinProviderNames, TokenData } from "@edgedb/auth-nextjs/app";
import { auth, client } from "@/edgedb";

// Auth actions

export const {
  signout,
  emailPasswordSignIn,
  emailPasswordSignUp,
  emailPasswordSendPasswordResetEmail,
  emailPasswordResetPassword,
  emailPasswordResendVerificationEmail,
} = auth.createServerActions();

export async function createUser(
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

// Todo actions

export async function addTodo(content: string) {
  const session = auth.getSession();

  await session.client
    // workaround for this bug: https://github.com/edgedb/edgedb/issues/6535
    .withConfig({ apply_access_policies: false })
    .query(
      `
      insert Todo {
        content := <str>$content
      }`,
      { content }
    );
  revalidatePath("/");
}

export async function updateTodo(id: string, completed: boolean) {
  const session = auth.getSession();

  await session.client.query(
    `
    update Todo
    filter .id = <uuid>$id
    set {
      completed := <bool>$completed
    }`,
    { id, completed }
  );
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const session = auth.getSession();

  await session.client.query(
    `
    delete Todo
    filter .id = <uuid>$id`,
    { id }
  );
  revalidatePath("/");
}
