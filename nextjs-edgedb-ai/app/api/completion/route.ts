import { createClient } from "edgedb";
import { createAI, EdgeDBMessage, EdgeDBUserMessage } from "@edgedb/ai";
import {
  countryTool,
  getCountry,
  generateToolMessages,
} from "../getCountryTool";

export const dynamic = "force-dynamic";

export const client = createClient();

const gpt4Ai = createAI(client, {
  model: "gpt-4-turbo-preview",
});

const booksAi = gpt4Ai.withContext({ query: "Book" });

// we handle tool calls here too
export async function POST(req: Request) {
  const { prompt } = await req.json();

  async function processStream(
    prompt: string | EdgeDBMessage[],
    controller: ReadableStreamDefaultController
  ) {
    let toolCalls: any[] = [];

    // if the AI response finishes with a tool call,
    // next prompt will be an array of messages that includes tool results
    const isStrPrompt = typeof prompt == "string";

    for await (const chunk of booksAi.streamRag({
      ...(isStrPrompt ? { prompt } : { messages: prompt }),
      tools: [countryTool],
    })) {
      // if it is content_block_delta text chunk (type==text_delta) enqueue the text, if it is
      // content_block_delta tool call chunk (type==tool_call_delta) add it to the toolCalls list
      if (chunk.type === "content_block_delta") {
        if (chunk.delta.type === "text_delta") {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        } else {
          toolCalls[toolCalls.length - 1].args += chunk.delta.args;
        }
      } else if (
        chunk.type === "content_block_start" &&
        chunk.content_block.type === "tool_use"
      ) {
        toolCalls.push(chunk.content_block);
      }
    }

    // call the tool function for every tool call and get results
    if (toolCalls.length > 0) {
      let toolResults: any[] = [];
      for (const call of toolCalls) {
        // we only have one tool so using if statement is fine
        // if there are more tools, some toolMap object can be used
        if (call.name === "getCountry") {
          let res = await getCountry(client, JSON.parse(call.args).author);
          toolResults.push(res);
        }
      }

      // add tool messages to messages
      const initialMessages = isStrPrompt
        ? [
            {
              role: "user" as const,
              content: [{ type: "text" as const, text: prompt }],
            },
          ]
        : prompt;

      const newMessages = [
        ...initialMessages,
        ...generateToolMessages(toolCalls, toolResults),
      ];

      // recursively process the stream with the updated messages
      await processStream(newMessages, controller);
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // start processing the initial stream
        await processStream(prompt, controller);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : error;
        console.error("Error streaming data:\n", errMsg);
        controller.error(errMsg);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
