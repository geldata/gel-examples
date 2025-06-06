import { streamText, tool } from "ai";
import { createClient } from "edgedb";
import { z } from "zod";
import { edgedb } from "../../../../../edgedb-js/packages/vercel-ai-provider/dist";

export const client = createClient();

export async function POST(req: Request) {
  const requestData = await req.json();

  const model = (await edgedb).languageModel("gpt-4-turbo", {
    context: { query: "Book" },
  });

  const result = streamText({
    model,
    messages: requestData.messages,
    tools: {
      country: tool({
        description: "Get the country of the author",
        parameters: z.object({
          author: z.string().describe("Author name to get the country for"),
        }),
        execute: getCountry,
      }),
    },
    // Required to be > 1 in order for the Vercel SDK to execute tools.
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}

async function getCountry({ author }: { author: string }) {
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
