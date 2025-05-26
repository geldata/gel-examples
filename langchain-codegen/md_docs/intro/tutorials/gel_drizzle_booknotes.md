# Build a Book Notes App with Drizzle

In this tutorial we’re going to walk you through building a Book Notes application that lets you keep track of books you’ve read along with your personal notes. We’ll be using Gel as the database, Drizzle as the ORM layer, and Next.js as our full-stack framework.

Gel is a data layer designed to supercharge PostgreSQL with a graph-like object model, access control, Auth, and many other features. It provides a unified schema and tooling experience across multiple languages, making it ideal for projects with diverse tech stacks. With Gel, you get access to EdgeQL, which eliminates n+1 query problems, supports automatic embeddings, and offers a seamless developer experience.

Drizzle, on the other hand, is a TypeScript ORM that offers type safety and a great developer experience. By combining Gel with Drizzle, you can leverage Gel’s powerful features while using Drizzle as a familiar ORM layer to interact with your database. This approach is perfect for developers who want to start learning Gel or prefer using Drizzle for their projects. experience. Next.js is a React framework for building production-ready web applications with features like server components, built-in routing, and API routes. By the end of this tutorial, you will see how these technologies work together to create a modern, full-stack web application with a great developer experience.

The complete source code for this tutorial is available in our Gel Examples repository.

We will start by creating a Gel schema, setting up Drizzle, and then building a Next.js application with API routes and a simple UI to manage your book collection and notes.

## 1. Initialize the project

## 2. Define the Gel schema

Now that we have our project environment set up, let’s define our database schema. For our Book Notes app, we’ll create two main types:

Let’s edit the dbschema/default.gel file that was created during initialization.

## 3. Install and set up Drizzle

Now that we have our Gel schema in place, we can integrate Drizzle ORM with our Next.js application. Drizzle will provide a type-safe way to interact with our Gel database.

## 4. Creating the database client

## 5. Implementing API Routes

Next, let’s implement the API routes for our book notes application. With Next.js, we can create API endpoints in the app/api directory to handle HTTP requests.

## 6. Building the UI

Now that we have our API routes in place, we can build a user interface for our book notes application. We’ll use Tailwind CSS for styling, which was included when we created our Next.js application.

We won’t go into extensive UI details, but here’s a basic implementation for the home page that lists all books.

## 7. Testing the application

## 8. Next steps

Congratulations! You’ve built a Book Notes application using Gel, Drizzle, and Next.js. This tutorial demonstrated how these technologies can work together to create a full-stack application.

Here are some ideas for extending the application:

To further explore the capabilities of Gel and Drizzle, you can check out these resources:

Remember, you can find the complete source code for this tutorial in our Gel Examples repository.

Happy coding!

