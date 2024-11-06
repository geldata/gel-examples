// Example with generateText and execute func provided for every tool.
// Tool execute func will be called by Vercel SDK automatically and final
// result will be sent to the client, without any additional work on the client side.

import { tool, streamText } from "ai";
import { z } from "zod";
import { createClient } from "edgedb";
import { edgedbRag } from "../../../edgedb-js/packages/edgedb-rag-sdk/dist/index";

import "../envConfig.ts";

const client = createClient();

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

// const model = "gpt-4-turbo-preview";
// const model = "mistral-large-latest";
// Use claude-3-5-sonnet, other models don't work well for complex tool requirements
const model = "claude-3-5-sonnet-20240620";

async function answerPrompt(prompt: string) {
  const textModel = (await edgedbRag).languageModel(model);

  const { textStream } = await streamText({
    model: textModel.withSettings({
      context: { query: "Book" },
    }),
    prompt,
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

  for await (const textPart of textStream) {
    console.log(textPart);
  }
}

export async function main() {
  const prompt1 = "Where is Ariadne Thread from?";
  const prompt2 = "Where are Finn Barlow and Elena Marquez from?";

  console.log(
    "\x1b[1m\x1b[33m%s\x1b[0m",
    "Tools cals with execute func provided: \n"
  );

  console.log(`Q: ${prompt1}`);
  await answerPrompt(prompt1);

  console.log(`Q: ${prompt2}`);
  await answerPrompt(prompt2);
}
