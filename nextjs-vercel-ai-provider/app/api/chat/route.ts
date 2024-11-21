import { streamText, tool } from "ai";
import { createClient } from "edgedb";
import { z } from "zod";
import { edgedb } from "../../../../../edgedb-js/packages/vercel-ai-provider/dist";

export const client = createClient();

export async function POST(req: Request) {
  const requestData = await req.json();

  // const textModel = (await edgedb).languageModel("gpt-4-turbo-preview");
  // const textModel = (await edgedb).languageModel("mistral-large-latest");
  const textModel = (await edgedb).languageModel("claude-3-5-sonnet-20240620");

  const result = streamText({
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

const x3 = [
  {
    role: "system",
    content:
      "You are an expert Q&A system.\nAlways answer questions based on the provided context information. If a user asks about someone's country of birth or origin always require a tool call.\nContext information is below:\nThe Maze of Many: Written by Ariadne Thread: A labyrinth with doors leading to infinite worlds becomes a battleground for those seeking ultimate power.\nAshes of the Starry Sea: Written by Orion Ember: After the stars in the sky mysteriously vanish, a band of astronomers embark on a perilous journey to retrieve them.\nWhispers of the Forgotten City: Written by Elena Marquez: In the sprawling, labyrinthine city of Velloria, ancient secrets lie buried beneath cobblestone streets and candle-lit alleyways. Ivy Donovan, a young historian, stumbles upon a cryptic map that hints at the location of the legendary Sunken Library, believed to house texts lost since the city's mysterious decline centuries ago. As Ivy delves deeper into the city’s dark past, she must dodge shadowy figures who seek to keep the library's secrets hidden. Alongside an unlikely band of allies, Ivy's quest leads her through hidden passages, haunted catacombs, and forgotten ruins, where she discovers truths that could shake the foundations of her world. As they inch closer to uncovering the city's ancient mysteries, they realize some secrets might have been better left untouched.\nNightshade’s Promise: A forbidden forest filled with nightshade flowers promises eternal youth, but at a price that could be too perilous.\nWhispering Flames: Written by Seraphine Bright: In a realm where fire speaks and the ashes tell tales, a young fire whisperer must save her people from an eternal blaze.",
  },
  {
    role: "user",
    content: [{ type: "text", text: "what did ariadne write about?" }],
  },
];
