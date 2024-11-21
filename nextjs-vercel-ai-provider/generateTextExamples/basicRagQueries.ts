// Example with generateText and without execute func provided for the tool.
// Tool execute func should be called on the client side and results should
// be sent to the LLM, after what LLM will generate the final result.

import { generateText } from "ai";
import { edgedb } from "@edgedb/vercel-ai-provider";

import "../envConfig";

// const model = "gpt-4-turbo-preview";
// const model = "mistral-large-latest";
const model = "claude-3-5-sonnet-20240620";

async function answerPrompt(prompt: string) {
  const textModel = (await edgedb).languageModel(model);

  const { text } = await generateText({
    model: textModel.withSettings({
      context: { query: "Book" },
    }),
    prompt,
  });

  return text;
}

export async function main() {
  const prompt1 = "What's the book 'Echoes of the Void' about?";
  const prompt2 =
    "What's the title of the book that talks about the expedition beneath the ice?";

  console.log("\x1b[1m\x1b[33m%s\x1b[0m", "Basic RAG queries: \n");

  console.log(`Q: ${prompt1}`);
  console.log(`A: ${await answerPrompt(prompt1)}\n`);

  console.log(`Q: ${prompt2}`);
  console.log(`A: ${await answerPrompt(prompt2)}\n`);
}
