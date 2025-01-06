import { streamText, tool } from "ai";
import { z } from "zod";
import { edgedb } from "../../../../../edgedb-js/packages/vercel-ai-provider/dist";
import { getCountry } from "@/app/utils";

export async function POST(req: Request) {
  const requestData = await req.json();

  const { bookIds, messages } = requestData;

  const context = {
    query: bookIds.length
      ? "select Book filter .id in array_unpack(<array<uuid>>$bookIds)"
      : "Book",
    variables: bookIds ? { bookIds } : undefined,
  };

  const model = (await edgedb).languageModel("gpt-4-turbo", {
    context,
  });

  // const embModel = (await edgedb).textEmbeddingModel("text-embedding-3-small", {
  //   dimensions: 200,
  // });

  // const { embedding } = await embed({
  //   model: embModel,
  //   value: "what does ariadne write about",
  // });

  // console.log("DIDI emb:", embedding);

  // const { object } = await generateObject({
  //   model: model,
  //   schema: z.object({
  //     title: z.string(),
  //     summary: z.string(),
  //   }),
  //   prompt: "What does ariadne write about?",
  // });
  // console.log("didi object", object);

  // const { partialObjectStream } = streamObject({
  //   model: model,
  //   schema: z.object({
  //     title: z.string(),
  //     summary: z.string(),
  //   }),
  //   prompt: "What does ariadne write about?",
  // });

  // for await (const partialObject of partialObjectStream) {
  //   console.log(partialObject);
  // }

  const result = streamText({
    model,
    messages,
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
