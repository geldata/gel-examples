# Magic Link Auth

Magic Link is a passwordless authentication method that allows users to log in via a unique, time-sensitive link sent to their email. This guide will walk you through integrating Magic Link authentication with your application using Gel Auth.

## Enable Magic Link provider

Before you can use Magic Link authentication, you need to enable the Magic Link provider in your Gel Auth configuration. This can be done through the Gel UI under the “Providers” section.

## Magic Link flow

The Magic Link authentication flow involves three main steps:

## UI considerations

Similar to how the built-in UI works, you can query the database configuration to discover which providers are configured and dynamically build the UI.

```edgeql
select cfg::Config.extensions[is ext::auth::AuthConfig].providers {
    name,
    [is ext::auth::OAuthProviderConfig].display_name,
};
```

The name is a unique string that identifies the Identity Provider. OAuth providers also have a display_name that you can use as a label for links or buttons.

## Example implementation

We will demonstrate the various steps below by building a NodeJS HTTP server in a single file that we will use to simulate a typical web application.

The details below show the inner workings of how data is exchanged with the Auth extension from a web app using HTTP. You can use this as a guide to integrate with your application written in any language that can send and receive HTTP requests.

