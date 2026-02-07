"use server";

import { createClient } from "edgedb";

const client = createClient();

export async function getCountry({ author }: { author: string }) {
  const res: { name: string; country: string } | null =
    await client.querySingle(
      `
        select Author { name, country }
        filter .name=<str>$author;`,
      { author }
    );

  return res?.country
    ? res
    : {
        ...res,
        country: `There is no available data on the country of origin for ${author}.`,
      };
}

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
