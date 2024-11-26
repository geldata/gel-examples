import { createHttpClient } from "edgedb";

const client = createHttpClient({
  tlsSecurity: "insecure",
  host: "localhost ",
});

export const getBooks = async () => {
  const books: {
    id: string;
    title: string;
    author: { name: string };
    summary: string;
  }[] = await client.query(
    `
      select Book {
        id,
        title,
        author: {
            name
        },
        summary
      }`
  );

  return books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author.name,
    summary: b.summary,
  }));
};
