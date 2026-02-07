import { AssistantMessage, ToolMessage } from "@gel/ai";
import type { Client } from "gel";

export const countryTool = {
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

export async function getCountry(client: Client, author: string) {
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

export function generateToolMessages(toolCalls: any[], results: any[]) {
  let messages: (AssistantMessage | ToolMessage)[] = [];

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
