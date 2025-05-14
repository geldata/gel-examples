# Built-in UI

To use the built-in UI for Gel Auth, enable the built-in Auth UI by clicking the “Enable UI” button under “Login UI” in the configuration section of the Gel UI. Set these configuration values:

## Example Implementation

We will demonstrate the various steps below by building a NodeJS HTTP server in a single file that we will use to simulate a typical web application.

We are in the process of publishing helper libraries that you can use with popular languages and web frameworks. The details below show the inner workings of how data is exchanged with the Auth extension from a web app using HTTP. You can use this as a guide to integrate with your application written in any language that can send and receive HTTP requests.

We secure authentication tokens and other sensitive data by using PKCE (Proof Key of Code Exchange).

