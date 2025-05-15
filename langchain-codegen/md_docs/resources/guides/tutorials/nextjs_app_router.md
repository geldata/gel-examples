# Next.js (App Router)

We’re going to build a simple blog application with Next.js and Gel. Let’s start by scaffolding our app with Next.js’s create-next-app tool.

You’ll be prompted to provide a name (we’ll use nextjs-blog) for your app and choose project options. For this tutorial, we’ll go with the recommended settings including TypeScript, App Router, and opt-ing out of the src/ directory.

```bash
$ npx create-next-app@latest
  ✔ Would you like to use TypeScript? Yes
  ✔ Would you like to use ESLint? Yes
  ✔ Would you like to use Tailwind CSS? Yes
  ✔ Would you like to use src/ directory? No
  ✔ Would you like to use App Router? (recommended) Yes
  ✔ Would you like to customize the default import alias (@/*) Yes
```

The scaffolding tool will create a simple Next.js app and install its dependencies. Once it’s done, you can navigate to the app’s directory and start the development server.

```bash
$ cd nextjs-blog
$ npm dev # or yarn dev or pnpm dev or bun run dev
```

When the dev server starts, it will log out a local URL. Visit that URL to see the default Next.js homepage. At this point the app’s file structure looks like this:

```default
README.md
tsconfig.json
package.json
next.config.js
next-env.d.ts
postcss.config.js
tailwind.config.js
app
├── page.tsx
├── layout.tsx
├── globals.css
└── favicon.ico
public
├── next.tsx
└── vercel.svg
```

There’s an async function Home defined in app/page.tsx that renders the homepage. It’s a Server Component which lets you integrate server-side logic directly into your React components. Server Components are executed on the server and can fetch data from a database or an API. We’ll use this feature to load blog posts from a Gel database.

## Updating the homepage

Let’s start by implementing a simple homepage for our blog application using static data. Replace the contents of app/page.tsx with the following.

*app/page.tsx*

```tsx
import Link from 'next/link'

type Post = {
  id: string
  title: string
  content: string
}

export default async function Home() {
  const posts: Post[] = [
    {
      id: 'post1',
      title: 'This one weird trick makes using databases fun',
      content: 'Use Gel',
    },
    {
      id: 'post2',
      title: 'How to build a blog with Gel and Next.js',
      content: "Let's start by scaffolding our app with `create-next-app`.",
    },
  ]

  return (
    <div className="container mx-auto p-4 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            className="mb-4"
          >
            <Link
              href={`/post/${post.id}`}
              className="text-blue-500"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

After saving, you can refresh the page to see the blog posts. Clicking on a post title will take you to a page that doesn’t exist yet. We’ll create that page later in the tutorial.

## Initializing Gel

Now let’s spin up a database for the app. You have two options to initialize a Gel project: using $ npx gel without installing the CLI, or installing the gel CLI directly. In this tutorial, we’ll use the first option. If you prefer to install the CLI, see the Gel CLI guide for more information.

From the application’s root directory, run the following command:

```bash
$ npx gel project init
No `gel.toml` found in `~/nextjs-blog` or above
Do you want to initialize a new project? [Y/n]
> Y
Specify the name of Gel instance to use with this project [default:
nextjs_blog]:
> nextjs_blog
Checking Gel versions...
Specify the version of Gel to use with this project [default: x.x]:
>
┌─────────────────────┬──────────────────────────────────────────────┐
│ Project directory   │ ~/nextjs-blog                                │
│ Project config      │ ~/nextjs-blog/gel.toml                       │
│ Schema dir (empty)  │ ~/nextjs-blog/dbschema                       │
│ Installation method │ portable package                             │
│ Start configuration │ manual                                       │
│ Version             │ x.x                                          │
│ Instance name       │ nextjs_blog                                  │
└─────────────────────┴──────────────────────────────────────────────┘
Initializing Gel instance...
Applying migrations...
Everything is up to date. Revision initial.
Project initialized.
```

This process has spun up a Gel instance called nextjs_blog and associated it with your current directory. As long as you’re inside that directory, CLI commands and client libraries will be able to connect to the linked instance automatically, without additional configuration.

To test this, run the gel command to open a REPL to the linked instance.

```bash
$ gel
Gel x.x (repl x.x)
Type \help for help, \quit to quit.
gel> select 2 + 2;
{4}
>
```

From inside this REPL, we can execute EdgeQL queries against our database. But there’s not much we can do currently, since our database is schemaless. Let’s change that.

The project initialization process also created a new subdirectory in our project called dbschema. This is folder that contains everything pertaining to Gel. Currently it looks like this:

```default
dbschema
├── default.gel
└── migrations
```

The default.gel file will contain our schema. The migrations directory is currently empty, but will contain our migration files. Let’s update the contents of default.gel with the following simple blog schema.

*dbschema/default.gel*

```sdl
module default {
  type BlogPost {
    required title: str;
    required content: str {
      default := ""
    }
  }
}
```

Gel lets you split up your schema into different modules but it’s common to keep your entire schema in the default module.

Save the file, then let’s create our first migration.

```bash
$ npx gel migration create
did you create object type 'default::BlogPost'? [y,n,l,c,b,s,q,?]
> y
Created ./dbschema/migrations/00001.edgeql
```

The dbschema/migrations directory now contains a migration file called 00001.edgeql. Currently though, we haven’t applied this migration against our database. Let’s do that.

```bash
$ npx gel migrate
Applied m1fee6oypqpjrreleos5hmivgfqg6zfkgbrowx7sw5jvnicm73hqdq (00001.edgeql)
```

Our database now has a schema consisting of the BlogPost type. We can create some sample data from the REPL. Run the gel command to re-open the REPL.

```bash
$ gel
Gel x.x (repl x.x)
Type \help for help, \quit to quit.
gel>
```

Then execute the following insert statements.

```edgeql-repl
gel> insert BlogPost {
....   title := "This one weird trick makes using databases fun",
....   content := "Use Gel"
.... };
{default::BlogPost {id: 7f301d02-c780-11ec-8a1a-a34776e884a0}}
gel> insert BlogPost {
....   title := "How to build a blog with Gel and Next.js",
....   content := "Let's start by scaffolding our app..."
.... };
{default::BlogPost {id: 88c800e6-c780-11ec-8a1a-b3a3020189dd}}
```

## Loading posts with React Server Components

Now that we have a couple posts in the database, let’s load them into our Next.js app. To do that, we’ll need the gel client library. Let’s install that from NPM:

```bash
$ npm install gel
# or 'yarn add gel' or 'pnpm add gel' or 'bun add gel'
```

Then go to the app/page.tsx file to replace the static data with the blogposts fetched from the database.

To fetch these from the homepage, we’ll create a Gel client and use the .query() method to fetch all the posts in the database with a select statement.

*app/page.tsx*

```tsx-diff
  import Link from 'next/link'
+ import { createClient } from 'gel';

  type Post = {
    id: string
    title: string
    content: string
  }
+ const client = createClient();

  export default async function Home() {
-   const posts: Post[] = [
-     {
-       id: 'post1',
-       title: 'This one weird trick makes using databases fun',
-       content: 'Use Gel',
-     },
-     {
-       id: 'post2',
-       title: 'How to build a blog with Gel and Next.js',
-       content: "Start by scaffolding our app with `create-next-app`.",
-     },
-   ]
+   const posts = await client.query<Post>(`\
+    select BlogPost {
+      id,
+      title,
+      content
+   };`)

    return (
      <div className="container mx-auto p-4 bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Posts</h1>
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              className="mb-4"
            >
              <Link
                href={`/post/${post.id}`}
                className="text-blue-500"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
```

When you refresh the page, you should see the blog posts.

## Generating the query builder

Since we’re using TypeScript, it makes sense to use Gel’s powerful query builder. This provides a schema-aware client API that makes writing strongly typed EdgeQL queries easy and painless. The result type of our queries will be automatically inferred, so we won’t need to manually type something like type Post = { id: string; ... }.

First, install the generator to your project.

```bash
$ npm install --save-dev @gel/generate
$ # or yarn add --dev @gel/generate
$ # or pnpm add --dev @gel/generate
$ # or bun add --dev @gel/generate
```

Then generate the query builder with the following command.

```bash
$ npx @gel/generate edgeql-js
Generating query builder...
Detected tsconfig.json, generating TypeScript files.
   To override this, use the --target flag.
   Run `npx @gel/generate --help` for full options.
Introspecting database schema...
Writing files to ./dbschema/edgeql-js
Generation complete! 🤘
Checking the generated query builder into version control
is not recommended. Would you like to update .gitignore to ignore
the query builder directory? The following line will be added:

   dbschema/edgeql-js

[y/n] (leave blank for "y")
> y
```

This command introspected the schema of our database and generated some code in the dbschema/edgeql-js directory. It also asked us if we wanted to add the generated code to our .gitignore; typically it’s not good practice to include generated files in version control.

Back in app/page.tsx, let’s update our code to use the query builder instead.

*app/page.tsx*

```typescript-diff
  import Link from 'next/link'
  import { createClient } from 'gel';
+ import e from '@/dbschema/edgeql-js';

- type Post = {
-   id: string
-   title: string
-   content: string
- }
  const client = createClient();

  export default async function Home() {
-   const posts = await client.query(`\
-    select BlogPost {
-      id,
-      title,
-      content
-   };`)
+   const selectPosts = e.select(e.BlogPost, () => ({
+     id: true,
+     title: true,
+     content: true,
+   }));
+   const posts = await selectPosts.run(client);

    return (
      <div className="container mx-auto p-4 bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Posts</h1>
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              className="mb-4"
            >
              <Link
                href={`/post/${post.id}`}
                className="text-blue-500"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
```

Instead of writing our query as a plain string, we’re now using the query builder to declare our query in a code-first way. As you can see, we import the query builder as a single default import e from the dbschema/edgeql-js directory.

Now, when we update our selectPosts query, the type of our dynamically loaded posts variable will update automatically — no need to keep our type definitions in sync with our API logic!

## Rendering blog posts

Our homepage renders a list of links to each of our blog posts, but we haven’t implemented the page that actually displays the posts. Let’s create a new page at app/post/[id]/page.tsx. This is a dynamic route that includes an id URL parameter. We’ll use this parameter to fetch the appropriate post from the database.

Add the following code in app/post/[id]/page.tsx:

*app/post/[id]/page.tsx*

```tsx
import { createClient } from 'gel'
import e from '@/dbschema/edgeql-js'
import Link from 'next/link'

const client = createClient()

export default async function Post({ params }: { params: { id: string } }) {
  const post = await e
    .select(e.BlogPost, (post) => ({
      id: true,
      title: true,
      content: true,
      filter_single: e.op(post.id, '=', e.uuid(params.id)),
    }))
    .run(client)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="container mx-auto p-4 bg-black text-white">
      <nav>
        <Link
          href="/"
          className="text-blue-500 mb-4 block"
          replace
        >
          Back to list
        </Link>
      </nav>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

We are again using a Server Component to fetch the post from the database. This time, we’re using the filter_single method to filter the BlogPost type by its id. We’re also using the uuid function from the query builder to convert the id parameter to a UUID.

Now, click on one of the blog post links on the homepage. This should bring you to /post/<uuid>.

## Deploying to Vercel

You can deploy a Gel instance on the Gel Cloud or on your preferred cloud provider. We’ll cover both options here.

## Wrapping up

This tutorial demonstrates how to work with Gel in a Next.js app, using the App Router. We’ve created a simple blog application that loads posts from a database and displays them on the homepage. We’ve also created a dynamic route that fetches a single post from the database and displays it on a separate page.

The next step is to add a /newpost page with a form for writing new blog posts and saving them into Gel. That’s left as an exercise for the reader.

To see the final code for this tutorial, refer to github.com/geldata/gel-examples/tree/main/nextjs-blog.

