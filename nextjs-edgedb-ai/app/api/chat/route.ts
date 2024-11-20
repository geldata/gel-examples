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
  prompt: { name: "builtin::rag-default" },
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
      console.log("chunk", chunk);
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
    console.log("tool calls", toolCalls);
    console.log("--");

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

const x = [
  {
    role: "system",
    content:
      "You are an expert Q&A system.\nAlways answer questions based on the provided context information. Never use prior knowledge.\nFollow these additional rules:\n1. Never directly reference the given context in your answer.\n2. Never include phrases like 'Based on the context, ...' or any similar phrases in your responses. 3. When the context does not provide information about the question, answer with 'No information available.'.\nContext information is below:\nThe Maze of Many: Written by Ariadne Thread: A labyrinth with doors leading to infinite worlds becomes a battleground for those seeking ultimate power.\nAshes of the Starry Sea: Written by Orion Ember: After the stars in the sky mysteriously vanish, a band of astronomers embark on a perilous journey to retrieve them.\nWhispers of the Forgotten City: Written by Elena Marquez: In the sprawling, labyrinthine city of Velloria, ancient secrets lie buried beneath cobblestone streets and candle-lit alleyways. Ivy Donovan, a young historian, stumbles upon a cryptic map that hints at the location of the legendary Sunken Library, believed to house texts lost since the city's mysterious decline centuries ago. As Ivy delves deeper into the city’s dark past, she must dodge shadowy figures who seek to keep the library's secrets hidden. Alongside an unlikely band of allies, Ivy's quest leads her through hidden passages, haunted catacombs, and forgotten ruins, where she discovers truths that could shake the foundations of her world. As they inch closer to uncovering the city's ancient mysteries, they realize some secrets might have been better left untouched.\nNightshade’s Promise: A forbidden forest filled with nightshade flowers promises eternal youth, but at a price that could be too perilous.\nThe Gilded Mirror: A cursed mirror reflects alternative realities, trapping its viewers in a labyrinth of their potential lives.\nGiven the context information above and not prior knowledge, answer the user query.",
  },
  { role: "user", content: "Query: where is ariadne from?\nAnswer: " },
  { role: "user", content: [{ type: "text", text: "where is ariadne from?" }] },
];

const x2 = [
  {
    role: "system",
    content:
      "You are an expert Q&A system.\nAlways answer questions based on the provided context information. Never use prior knowledge.\nFollow these additional rules:\n1. Never directly reference the given context in your answer.\n2. Never include phrases like 'Based on the context, ...' or any similar phrases in your responses. 3. When the context does not provide information about the question, answer with 'No information available.'.\nContext information is below:\nThe Maze of Many: Written by Ariadne Thread: A labyrinth with doors leading to infinite worlds becomes a battleground for those seeking ultimate power.\nAshes of the Starry Sea: Written by Orion Ember: After the stars in the sky mysteriously vanish, a band of astronomers embark on a perilous journey to retrieve them.\nWhispers of the Forgotten City: Written by Elena Marquez: In the sprawling, labyrinthine city of Velloria, ancient secrets lie buried beneath cobblestone streets and candle-lit alleyways. Ivy Donovan, a young historian, stumbles upon a cryptic map that hints at the location of the legendary Sunken Library, believed to house texts lost since the city's mysterious decline centuries ago. As Ivy delves deeper into the city’s dark past, she must dodge shadowy figures who seek to keep the library's secrets hidden. Alongside an unlikely band of allies, Ivy's quest leads her through hidden passages, haunted catacombs, and forgotten ruins, where she discovers truths that could shake the foundations of her world. As they inch closer to uncovering the city's ancient mysteries, they realize some secrets might have been better left untouched.\nNightshade’s Promise: A forbidden forest filled with nightshade flowers promises eternal youth, but at a price that could be too perilous.\nThe Gilded Mirror: A cursed mirror reflects alternative realities, trapping its viewers in a labyrinth of their potential lives.\nGiven the context information above and not prior knowledge, answer the user query.",
  },
  { role: "user", content: "Query: where is ariadne from?\nAnswer: " },
  { role: "user", content: [{ type: "text", text: "where is ariadne from?" }] },
  {
    role: "assistant",
    content: "",
    tool_calls: [
      {
        id: "call_Grl1weCfPvvypSPXuUzagktJ",
        type: "function",
        function: {
          name: "getCountry",
          arguments: '{"author":"Ariadne Thread"}',
        },
      },
    ],
  },
  {
    role: "tool",
    content: '{"name":"Ariadne Thread","country":"Uruguay"}',
    tool_call_id: "call_Grl1weCfPvvypSPXuUzagktJ",
  },
];

const xx1 = [
  {
    role: "system",
    content:
      "You are an expert Q&A system.\nAlways answer questions based on the provided context information. Never use prior knowledge.\nFollow these additional rules:\n1. Never directly reference the given context in your answer.\n2. Never include phrases like 'Based on the context, ...' or any similar phrases in your responses. 3. When the context does not provide information about the question, answer with 'No information available.'.\nContext information is below:\nThe Maze of Many: Written by Ariadne Thread: A labyrinth with doors leading to infinite worlds becomes a battleground for those seeking ultimate power.\nAshes of the Starry Sea: Written by Orion Ember: After the stars in the sky mysteriously vanish, a band of astronomers embark on a perilous journey to retrieve them.\nWhispers of the Forgotten City: Written by Elena Marquez: In the sprawling, labyrinthine city of Velloria, ancient secrets lie buried beneath cobblestone streets and candle-lit alleyways. Ivy Donovan, a young historian, stumbles upon a cryptic map that hints at the location of the legendary Sunken Library, believed to house texts lost since the city's mysterious decline centuries ago. As Ivy delves deeper into the city’s dark past, she must dodge shadowy figures who seek to keep the library's secrets hidden. Alongside an unlikely band of allies, Ivy's quest leads her through hidden passages, haunted catacombs, and forgotten ruins, where she discovers truths that could shake the foundations of her world. As they inch closer to uncovering the city's ancient mysteries, they realize some secrets might have been better left untouched.\nNightshade’s Promise: A forbidden forest filled with nightshade flowers promises eternal youth, but at a price that could be too perilous.\nThe Gilded Mirror: A cursed mirror reflects alternative realities, trapping its viewers in a labyrinth of their potential lives.\nGiven the context information above and not prior knowledge, answer the user query.",
  },
  { role: "user", content: "Query: where is ariadne from?\nAnswer: " },
];
