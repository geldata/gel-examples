# Email and password

Along with using the built-in UI, you can also create your own UI that calls to your own web application backend.

## UI considerations

Similar to how the built-in UI works, you can query the database configuration to discover which providers are configured and dynamically build the UI.

```edgeql
select cfg::Config.extensions[is ext::auth::AuthConfig].providers {
    name,
    [is ext::auth::OAuthProviderConfig].display_name,
};
```

The name is a unique string that identifies the Identity Provider. OAuth providers also have a display_name that you can use as a label for links or buttons. In later steps, you’ll be providing this name as the provider in various endpoints.

## Example implementation

We will demonstrate the various steps below by building a NodeJS HTTP server in a single file that we will use to simulate a typical web application. For this example, we will require email verification to demonstrate the full flow, but you can configure your provider to not require verification by setting the require_verification setting to false.

The details below show the inner workings of how data is exchanged with the Auth extension from a web app using HTTP. You can use this as a guide to integrate with your application written in any language that can send and receive HTTP requests.

