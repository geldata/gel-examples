import { createClient } from "edgedb";
import { createAI } from "@edgedb/ai";

export const dynamic = "force-dynamic";

export const client = createClient({ tlsSecurity: "insecure" });

const gpt4Ai = createAI(client, {
  model: "gpt-4-turbo-preview",
});

const booksAi = gpt4Ai.withContext({ query: "Book" });

// tool calls aren't handled, check the chat route for tool calls handling
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // stream data from booksAi and enqueue each text chunk as plain text
        for await (const chunk of booksAi.streamRag({
          prompt,
        })) {
          if (chunk.type == "content_block_delta") {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
      } catch (error) {
        console.error("Error streaming data:", error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
