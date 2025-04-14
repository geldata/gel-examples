# Book Notes App

This is a demo application showcasing the integration of [Drizzle ORM](https://orm.drizzle.team/) with [Gel](https://gel.dev/) and [Next.js](https://nextjs.org). The app allows users to manage books and their associated notes.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/) for package management

---

### 1. Clone the Repository

```bash
git clone https://github.com/geldata/gel-examples.git
cd drizzle-book-notes-app
```

---

### 2. Install Dependencies

Install the required dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

---

### 3. Initialize the Gel database

1. **Start the Gel server**:
   
   ```bash
   npx gel project init
   ```

2. **Apply migrations**:

   ```bash
   npx gel migrate
   ```

---

### 4. Configure Drizzle ORM

Drizzle is already configured in the project. The schema and relations are defined in the following files:

- Schema: [`drizzle/schema.ts`](drizzle/schema.ts)
- Relations: [`drizzle/relations.ts`](drizzle/relations.ts)

The database connection is initialized in [`src/db/index.ts`](src/db/index.ts).

---

### 5. Run the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## Project Structure

- **`app/`**: Contains the Next.js pages and components.
- **`drizzle/`**: Contains the database schema and relations for Drizzle ORM.
- **`src/db/`**: Contains the database initialization logic.
- **`dbschema/`**: Contains Gel schema files and migrations.

---

## Deployment

The easiest way to deploy this app is via [Vercel](https://vercel.com). Follow these steps:

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Set up environment variables for your Gel database connection.
4. Deploy the app.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Learn More

To learn more about the tools used in this project, check out the following resources:

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Gel Documentation](https://docs.geldata.com)
- [Next.js Documentation](https://nextjs.org/docs)

