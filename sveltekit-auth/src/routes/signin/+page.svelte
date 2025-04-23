<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { transformSearchParams } from "$lib/utils";
  import SignInForm from "$lib/components/auth/SignInForm.svelte";
  import clientAuth from "$lib/auth.js";

  const providerIcons = {
    "builtin::oauth_apple": "logos:apple",
    "builtin::oauth_azure": "logos:microsoft-azure",
    "builtin::oauth_discord": "logos:discord-icon",
    "builtin::oauth_github": "logos:github-icon",
    "builtin::oauth_google": "logos:google-icon",
    "builtin::oauth_slack": "logos:slack-icon",
  };

  export let params = transformSearchParams($page.url.searchParams);
  export let data;
  export let form;
</script>

<h1 class="text-3xl font-semibold mb-6">Sign in</h1>
<div class="flex gap-[5rem] w-max">
  <div class="flex flex-col gap-4 w-[18rem]">
    <h2 class="text-xl font-semibold">OAuth</h2>
    {#if params.oauth_error}
      <div class="bg-rose-100 text-rose-950 px-4 py-3 rounded-md">
        {params.oauth_error}
      </div>
    {/if}

    {#if data.providers.oauth.length}
      {#each data.providers.oauth as provider (provider.name)}
        <a
          href={clientAuth.getOAuthUrl(provider.name)}
          class="rounded-lg bg-slate-50 p-3 font-medium shadow-md shrink-0 hover:bg-white hover:scale-[1.03] transition-transform
flex items-center"
        >
          <Icon icon={providerIcons[provider.name]} />
          <span class="ml-3">{provider.display_name}</span>
        </a>
      {/each}
    {:else}
      <div class="text-slate-500 italic w-[14rem]">
        No OAuth providers configured
      </div>
    {/if}
  </div>

  <div class="flex flex-col gap-4">
    <h2 class="text-xl font-semibold">Email+Password</h2>
    {#if data.providers.emailPassword}
      <SignInForm error={form?.error} />
    {:else}
      <div class="text-slate-500 italic w-[14rem]">
        Email+Password provider is not enabled
      </div>
    {/if}
  </div>
</div>
