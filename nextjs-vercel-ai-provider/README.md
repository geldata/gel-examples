# Chat App with EdgeDB AI and Vercel AI SDK

This is an example project built with [Next.js](https://nextjs.org/) to showcase the use of [EdgeDB's AI](https://docs.edgedb.com/ai) features with the [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction). The [Edgedb provider for Vercel AI](https://docs.edgedb.com/ai/vercel-ai-provider) is used. The application demonstrates a chat app that allows users to query a digital library of imaginary books. Users can ask about books, their authors, and related details, leveraging the EdgeDB database to store and retrieve the data, and embeddings.

## Getting Started

- Install dependencies:

  ```bash
  npm install
  ```

- Initialize EdgeDB project:

  ```bash
  edgedb project init
  edgedb migrate
  ```

  Check the schema file to see how the **deferred semantic similarity index** is defined for the Book type. This index enables the generation of embeddings for a provided expression, which are then used for retrieving relevant context from the database when users ask questions.

- Seed the database with books and authors:

  ```bash
  npm run seed
  ```

- Start the development server:

  ```bash
  npm run dev
  ```

## Features

### Chat Route (/):

Users can have a conversation with EdgeDB AI about books The conversation history is preserved.
Some example questions:

- What Ariadne writes about?
- Where is she from?
- What is the book Whispers of the Forgotten City about?

### Completion route (/completion):

A standalone query interface without persistent chat history. Each question is independent.

### Function calling:

EdgeDB AI extension supports function calling. Inside this project we defined `getCountry` tool that is used in both chat and completion routes.
This tool retrieves the author's country of origin from the database. If u ask the question **Where is Ariadne from?**, this tool will be used.
In both routes the Vercel AI SDK executes the tools and provides results back to the EdgeDB AI. Users can of course choose to execute the tools on the client side.

### Supplementary Folders:

- `generateTextExamples`

- `streamTextExamples`

These folders contain examples of how to use `generateText` or `streamText` for basic queries or queries that include tool calls.
For queries that requires tool calls, there are examples demonstrating two scenarios:

- The Vercel AI SDK runs the tools and provides the results to the AI.
- The application runs the tools client-side and supplies the results to the AI.
