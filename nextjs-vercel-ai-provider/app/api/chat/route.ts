import { streamText, tool } from "ai";
import { createClient } from "edgedb";
import { z } from "zod";
import { edgedb } from "../../../../../edgedb-js/packages/vercel-ai-provider/dist";

export const client = createClient();

export async function POST(req: Request) {
  const requestData = await req.json();

  const textModel = (await edgedb).languageModel("gpt-4-turbo-preview");
  // const textModel = edgedbRag.languageModel("mistral-large-latest");
  // const textModel = edgedbRag.languageModel("claude-3-5-sonnet-20240620");

  const result = await streamText({
    model: textModel.withSettings({
      context: { query: "Book" },
    }),
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
