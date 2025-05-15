# Auth

Gel Auth is a batteries-included authentication solution for your app built into the Gel server. Here’s how you can integrate it with your app.

## Enable extension in your schema

Auth is a Gel extension. To enable it, you will need to add the extension to your app’s schema:

```sdl
using extension auth;
```

## Extension configuration

The best and easiest way to configure the extension for your database is to use the built-in UI. To access it, run  gel ui. If you have the extension enabled in your schema as shown above and have migrated that schema change, you will see the “Auth Admin” icon in the left-hand toolbar.

The auth admin UI exposes these values:

## Webhooks

The auth extension supports sending webhooks for a variety of auth events. You can use these webhooks to, for instance, send a fully customized email for email verification, or password reset instead of our built-in email verification and password reset emails. You could also use them to trigger analytics events, start an email drip campaign, create an audit log, or trigger other side effects in your application.

See the webhooks documentation for more details on how to configure and use webhooks.

## Configuring SMTP

For email-based factors, you can configure SMTP to allow the extension to send emails on your behalf. You should either configure SMTP, or webhooks for the relevant events.

The easiest way to configure SMTP is to use the built-in UI. Here is an example of configuring SMTP for local development using EdgeQL directly, using something like Mailpit.

Gel Cloud users, rejoice! If you are using Gel Cloud, you can use the built-in development SMTP provider without any configuration. This special provider is already configured for development usage and is ready to send emails while you are developing your application. This provider is tuned specifically for development: it is  rate limited and the sender is hardcoded. Do not use it in production, it will not work for that purpose.

```edgeql
# Create a new SMTP provider:
#
configure current branch
  insert cfg::SMTPProviderConfig {
    # This name must be unique and is used to reference the provider
    name := 'local_mailpit',
    sender := 'hello@example.com',
    host := 'localhost',
    port := <int32>1025,
    username := 'smtpuser',
    password := 'smtppassword',
    security := 'STARTTLSOrPlainText',
    validate_certs := false,
    timeout_per_email := <duration>'60 seconds',
    timeout_per_attempt := <duration>'15 seconds',
  };

# Set this provider as the current email provider by name:
#
configure current branch
  set current_email_provider_name := 'local_mailpit';
```

## Enabling authentication providers

In order to use the auth extension, you’ll need to enable at least one of these authentication providers. Providers can be added from the “Providers” section of the admin auth UI by clicking “Add Provider.” This will add a form to the UI allowing for selection of the provider and configuration of the values described below.

You can also enable providers via query. We’ll demonstrate how in each section below.

## Integrating your application

In the end, what we want to end up with is an authentication token created by Gel that we can set as a global in any authenticated queries executed from our application, which will set a computed global linked to an ext::auth::Identity.

💡 If you want your own User type that contains application specific information like name, preferences, etc, you can link to this ext::auth::Identity to do so.

You can then use the ext::auth::Identity (or custom User type) to define access policies and make authenticated queries.

Select your method for detailed configuration:

## Example usage

Here’s an example schema that we can use to show how you would use the auth_token you get back from Gel to make queries against a protected resource, in this case being able to insert a Post.

```sdl
using extension auth;

module default {
  global current_user := (
    assert_single((
      select User
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
    required name: str;
    required identity: ext::auth::Identity;
  }

  type Post {
    required text: str;
    required author: User;

    access policy author_has_full_access
      allow all
      using (.author ?= global current_user);

    access policy others_read_only
      allow select;
  }
}
```

Let’s now insert a Post.

```tsx
const client = createClient().withGlobals({
  "ext::auth::client_token": auth_token,
});

const inserted = await client.querySingle(
  `
  insert Post {
    text := <str>$text,
    author := global current_user,
  }`,
  {
    text: 'if your grave doesnt say "rest in peace" on it you are automatically drafted into the skeleton war'
  }
);
```

I can even delete it, since I have access through the global:

```tsx
await client.query(`delete Post filter .id = <str>$id`, {
  id: inserted.id
});
```

