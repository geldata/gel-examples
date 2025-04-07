# Chat App with Gel AI and Vercel AI SDK

This is an example project built with [Next.js](https://nextjs.org/) to showcase the use of [Gel's AI](https://docs.geldata.com/reference/ai) features. The application demonstrates a chat app that allows users to query a digital library of imaginary books. Users can ask about books, their authors, and related details, leveraging the Gel database to store and retrieve the data, and embeddings. For the LLM models, you can use any of the `OpenAI`, `Mistral`, or `Anthropic` models that Gel AI supports.

## Getting Started

- Install dependencies:

  ```bash
  npm install
  ```

- Initialize Gel project:

  ```bash
  gel project init
  gel migrate
  ```

  Check the schema file to see how the **deferred semantic similarity index** is defined for the Book type. This index enables the generation of embeddings for a provided expression, which are then used for retrieving relevant context from the database when users ask questions.

- Configure OpenAI secret key:

  ```
  # .env.local
  OPENAI_API_KEY=<secret key here>
  ```

- Seed the database with books and authors:

  ```bash
  npm run seed
  ```

- Start the development server:

  ```bash
  npm run dev
  ```

## Features

### Chat Route (/)

Users can have a conversation with Gel AI about books. The conversation history is preserved.  
Some example questions:

- What does Ariadne write about?
- Where is she from?
- What is the book "Whispers of the Forgotten City" about?

### Completion route (/completion)

A standalone query without persistent chat history. Each question is independent.

### Function calling

Gel AI extension supports function calling. In this project we defined `getCountry` tool which is utilized in both the chat and completion routes.
This tool retrieves an author's country of origin from the database. For example, if a user asks, **"Where is Ariadne from?"**, the getCountry tool should be invoked.

The `processStream` function is responsible for parsing response chunks. When a tool call response is detected, the function executes the corresponding tool, updates the messages array with the tool's results, and provides the updated array back to the AI.

**NOTE**: It is advisable to create a system query in a way that ensures it is aware of the available tools and understands when to call each tool. We achieved this in the seed script by updating the `builtin::rag-default` prompt. However, you can also update this prompt using the Gel UI or via the REPL. Additionally, you can create a new prompt for this purpose using the UI or the REPL with an `INSERT` query.

### Feedback and Contributions

Feel free to fork this project, suggest improvements, or raise issues.
This project is a simple starting point for exploring how Gel can integrate with Vercel AI SDK.
