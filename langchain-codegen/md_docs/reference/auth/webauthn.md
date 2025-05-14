# WebAuthn

WebAuthn, short for Web Authentication, is a web standard published by the World Wide Web Consortium (W3C) for secure and passwordless authentication on the web. It allows users to log in using biometrics, mobile devices, or FIDO2 security keys instead of traditional passwords. This guide will walk you through integrating WebAuthn authentication with your application using Gel Auth.

## Why choose WebAuthn?

WebAuthn provides a more secure and user-friendly alternative to passwords and SMS-based OTPs. By leveraging public key cryptography, it significantly reduces the risk of phishing, man-in-the-middle, and replay attacks. For application developers, integrating WebAuthn can enhance security while improving the user experience with seamless, passwordless logins.

## What is a Passkey?

While WebAuthn focuses on authenticating users through cryptographic credentials, Passkeys extend this concept by enabling users to easily access their credentials across devices, including those they haven’t used before, without the need for a password. Passkeys are built on the WebAuthn framework and aim to simplify the user experience further by leveraging cloud synchronization of credentials.

Many operating systems and password managers have added support for Passkeys, making it easier for users to manage their credentials across devices. Gel Auth’s WebAuthn provider supports Passkeys, allowing users to log in to your application using their Passkeys.

## Security considerations

For maximum flexibility, Gel Auth’s WebAuthn provider allows multiple WebAuthn credentials per email. This means that it’s very important to verify the email before trusting a WebAuthn credential. This can be done by setting the require_verification option to true (which is the default) in your WebAuthn provider configuration. Or you can check the verification status of the factor directly.

## WebAuthn flow

The WebAuthn authentication flow is a sophisticated process that involves a coordinated effort between the server and the client-side script. Unlike the other authentication methods outlined elsewhere in this guide, WebAuthn is a coordinated flow that involves a client-side script access web browser APIs, the Web Authentication API specifically, to interact with the user’s authenticator device or passkey.

At a high level, the sign-up ceremony involves the following steps:

The sign-in ceremony is similar, but instead of creating a new credential, the client uses the Web Authentication API to authenticate the user with an existing credential.

## Example implementation

We will demonstrate the various steps below by building a NodeJS HTTP server in a single file that we will use to simulate a typical web application.

The details below show the inner workings of how data is exchanged with the Auth extension from a web app using HTTP. You can use this as a guide to integrate with your application written in any language that can send and receive HTTP requests.

