# Webhooks

The auth extension supports sending webhooks for a variety of auth events. You can use these webhooks to, for instance, send a fully customized email for email verification, or password reset instead of our built-in email verification and password reset emails. You could also use them to trigger analytics events, start an email drip campaign, create an audit log, or trigger other side effects in your application.

If you are using Webhooks to send emails, be sure to not also configure an SMTP provider otherwise we will send the email via SMTP and also send the webhook which will trigger your custom email sending behavior.

## Configuration

You can configure webhooks with the UI or via query. The URLs you register as webhooks must be unique across all webhooks configured for each branch. If you want to send multiple events to the same URL, you can do so by adding multiple ext::auth::WebhookEvent values to the events set, like in this example.

```edgeql
configure current branch insert
  ext::auth::WebhookConfig {
    url := 'https://example.com/auth/webhook',
    events := {
      ext::auth::WebhookEvent.EmailVerificationRequested,
      ext::auth::WebhookEvent.PasswordResetRequested,
    },
    # Optional, only needed if you want to verify the webhook request
    signing_secret_key := '1234567890',
  };
```

When you receive a webhook, you’ll look at the event_type field to determine which event corresponds to this webhook request and handle it accordingly.

## Checking webhook signatures

You can provide a signing key, which you will need to generate and save in a place that your application will have access to. The extension will then add a x-ext-auth-signature-sha256 header to the request, which you can use to verify the request by comparing the signature to the SHA256 hash of the request body.

Here is an example of how you might verify the signature in a Node.js application:

```typescript
/**
 * Assert that if the request contains a signature header, that the signature
 * is valid for the request body. Will return false if there is no signature
 * header.
 *
 * @param {Request} request - The request to verify.
 * @param {string} signingKey - The key to use to verify the signature.
 * @returns {boolean} - True if the signature is present and valid, false if
 *                    the signature is not present at all.
 * @throws {AssertionError} - If the signature is present but invalid.
 */
async function assertSignature(
  request: Request,
  signingKey: string,
): Promise<boolean> {
    const signatureHeader = request.headers.get('x-ext-auth-signature-sha256');
    if (!signatureHeader) {
      return false;
    }

    const requestBody = await request.text();
    const encoder = new TextEncoder();
    const data = encoder.encode(requestBody);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(signingKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const signatureHex = Buffer.from(signature).toString('hex');

    assert.strictEqual(
      signatureHeader,
      signatureHex,
      "Signature header is set, but the signature is invalid"
    );

    return true;
};
```

## Troubleshooting webhooks

If you are having trouble receiving webhooks, you might need to look for any responses from the requests that are being scheduled by the std::net::http module. You can list all of the net::http::ScheduledRequest objects, and any returned responses with the following query:

```edgeql
select net::http::ScheduledRequest {
    **,
    response: { ** }
}
```

## Events reference

Common fields for all events:

