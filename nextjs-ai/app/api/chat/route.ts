import { createClient } from "edgedb";
import { createAI } from "@edgedb/ai";

export const dynamic = "force-dynamic";

export const client = createClient({ tlsSecurity: "insecure" });

const gpt4Ai = createAI(client, {
  model: "gpt-4-turbo-preview",
});

let booksAi = gpt4Ai.withContext({ query: "Book" });

export async function POST(req: Request) {
  const requestData = await req.json();
  const query = requestData.messages.at(-1).content;

  // provide history with withConfig -> prompt.custom,
  // and the name of the prompt that has the system msg
  booksAi = booksAi.withConfig({
    prompt: {
      custom: requestData.messages,
      name: "light-rag",
    },
  });

  const res = await booksAi.streamRag(query);
  // const stream = EdgeDBStream(res);
  // return new StreamingTextResponse(stream);
}
