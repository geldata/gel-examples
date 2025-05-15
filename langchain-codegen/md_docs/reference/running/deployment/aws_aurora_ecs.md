# AWS

Gel Cloud: The easiest way to run Gel Gel Cloud is the official hosted service managed by the Gel team, offering the simplest and most reliable way to run Gel in production. While self-hosting is possible (as shown in these guides), Gel Cloud provides a seamlessly integrated experience with perfect compatibility between local development and production environments. It includes a generous free tier, Vercel and GitHub (deploy previews work out of the box), a hosted UI, and using it directly supports the development of Gel itself! Try Gel Cloud today at cloud.geldata.com

In this guide we show how to deploy Gel on AWS using Amazon Aurora and Elastic Container Service.

## Prerequisites

## Quick Install with CloudFormation

We maintain a CloudFormation template for easy automated deployment of Gel in your AWS account.  The template deploys Gel to a new ECS service and connects it to a newly provisioned Aurora PostgreSQL cluster. The created instance has a public IP address with TLS configured and is protected by a password you provide.

## Health Checks

Using an HTTP client, you can perform health checks to monitor the status of your Gel instance. Learn how to use them with our health checks guide.

