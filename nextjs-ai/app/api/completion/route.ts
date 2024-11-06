import { createClient } from "edgedb";
import { createAI } from "@edgedb/ai";

export const dynamic = "force-dynamic";

export const client = createClient({ tlsSecurity: "insecure" });

const gpt4Ai = createAI(client, {
  model: "gpt-4-turbo-preview",
});

const booksAi = gpt4Ai.withContext({ query: "Book" });

export async function POST(req: Request) {
  const { prompt } = await req.json();

  return booksAi.streamRag(prompt);
}
