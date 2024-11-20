import { createClient } from "edgedb";
import {
  createAI,
  EdgeDBAssistantMessage,
  EdgeDBToolMessage,
} from "@edgedb/ai";

export const dynamic = "force-dynamic";

export const client = createClient({ tlsSecurity: "insecure" });

const gpt4Ai = createAI(client, {
  model: "gpt-4-turbo-preview",
});

let booksAi = gpt4Ai.withContext({ query: "Book" });

// we handle tools calls here too
export async function POST(req: Request) {
  const messages = (await req.json()).messages;

  async function processStream(
    initialMessages: any[],
    controller: ReadableStreamDefaultController
  ) {
    let toolCalls: any[] = [];
    for await (const chunk of booksAi.streamRag({
      messages: initialMessages,
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
          let res = await getCountry(JSON.parse(call.args));
          toolResults.push(res);
        }
      }

      // add tool messages to messages
      const newMessages = [
        ...initialMessages,
        ...generateToolMessages(toolCalls, toolResults),
      ];
      console.log("new messages", newMessages);
      console.log("--");
      // recursively process the stream with the updated messages
      await processStream(newMessages, controller);
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // start processing the initial stream
        await processStream(messages, controller);
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

const countryTool = {
  type: "function",
  function: {
    name: "getCountry",
    description: "Get the country of the author",
    parameters: {
      type: "object",
      properties: {
        author: {
          type: "string",
          description: "Author name to get the country for.",
        },
      },
      required: ["author"],
    },
  },
};

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

function generateToolMessages(toolCalls: any[], results: any[]) {
  let messages: (EdgeDBAssistantMessage | EdgeDBToolMessage)[] = [];

  toolCalls.forEach((call, i) => {
    messages.push(
      ...[
        {
          role: "assistant" as const,
          content: "",
          tool_calls: [
            {
              id: call.id,
              type: "function" as const,
              function: {
                name: call.name,
                arguments: call.args,
              },
            },
          ],
        },
        {
          role: "tool" as const,
          content: JSON.stringify(results[i]),
          tool_call_id: call.id,
        },
      ]
    );
  });

  return messages;
}
