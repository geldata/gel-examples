// Example with generateText and without execute func provided for the tool.
// Tool execute func should be called on the client side and results should
// be sent to the AI, after what AI will generate the final result.

import { tool, generateText } from "ai";
import { z } from "zod";
import { createClient } from "edgedb";
import { edgedb } from "@edgedb/vercel-ai-provider";

import "../envConfig";

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

const model = "gpt-4-turbo-preview";
// const model = "mistral-large-latest";
// Use claude-3-5-sonnet, other models don't work well for complex tool requirements
// const model = "claude-3-5-sonnet-20240620";

async function answerPrompt(prompt: string) {
  const textModel = (await edgedb).languageModel(model);

  const res = await generateText({
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
      }),
    },
  });

  const toolResults: any = [];

  if (res.finishReason == "tool-calls" && res.toolCalls.length) {
    for (const toolCall of res.toolCalls) {
      const country = await getCountry(toolCall.args);
      toolResults.push(
        ...[
          {
            role: "assistant",
            content: res.text,
            tool_calls: [
              {
                id: toolCall.toolCallId,
                type: "function",
                function: {
                  name: toolCall.toolName,
                  arguments: JSON.stringify(toolCall.args),
                },
              },
            ],
          },
          {
            role: "tool",
            content: JSON.stringify({
              author: toolCall.args.author,
              country,
            }),
            tool_call_id: toolCall.toolCallId,
          },
        ]
      );
    }
  }

  const { text } = await generateText({
    model: textModel.withSettings({
      context: { query: "Book" },
      prompt: {
        custom: toolResults,
      },
    }),
    prompt,
    tools: {
      country: tool({
        description: "Get the country of the author",
        parameters: z.object({
          author: z.string().describe("Author name to get the country for"),
        }),
      }),
    },
  });

  return text;
}

export async function main() {
  const prompt1 = "Where is Ariadne Thread from?";
  const prompt2 = "Where are Finn Barlow and Elena Marquez from?";

  console.log(
    "\x1b[1m\x1b[33m%s\x1b[0m",
    "Tools cals without execute func provided: \n"
  );

  console.log(`Q: ${prompt1}`);
  console.log(`A: ${await answerPrompt(prompt1)}\n`);

  console.log(`Q: ${prompt2}`);
  console.log(`A: ${await answerPrompt(prompt2)}\n`);
}
