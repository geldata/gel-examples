# HTTP API

Your application server will interact with the Gel extension primarily by sending HTTP requests to the Gel server. This page describes the HTTP API exposed by the Gel server. For more in-depth guidance about integrating Gel Auth into your application, see Auth for a reference example.

The following sections are organized by authentication type.

## Responses

Responses typically include a JSON object that include a code property that can be exchanged for an access token by providing the matching PKCE verifier associated with the code. Some endpoints can be configured to return responses as redirects and include response data in the redirect location’s query string.

## General

## Email and password

## Email verification

These endpoints apply to the Email and password provider, as well as the WebAuthn provider. Verification emails are sent even if you do not require verification. The difference between requiring verification and not is that if you require verification, the user must verify their email before they can authenticate. If you do not require verification, the user can authenticate without verifying their email.

## OAuth

## WebAuthn

## Magic link

