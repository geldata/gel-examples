from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver
from dotenv import load_dotenv
from langchain_codegen.rag import load_vectorstore
from langchain_mcp_adapters.client import MultiServerMCPClient
import asyncio
from pathlib import Path
from pprint import pprint
import argparse


load_dotenv()

ROOT_PATH = Path(".").resolve()
print(ROOT_PATH)


async def main(query: str):
    vector_store = await load_vectorstore()
    checkpointer = InMemorySaver()

    async with MultiServerMCPClient(
        {
            "gel": {
                "command": "uvx",
                "args": [
                    "--refresh",
                    "--directory",
                    ROOT_PATH,
                    "--from",
                    "git+https://github.com/geldata/gel-mcp.git",
                    "gel-mcp",
                ],
                "transport": "stdio",
            }
        }
    ) as client:
        async def search_docs(query: str) -> str:
            """Use vector search to find relevant documentation about the Gel database."""
            results = await vector_store.asimilarity_search(query)
            return results

        agent = create_react_agent(
            model="openai:gpt-4o",
            tools=[*client.get_tools(), search_docs],
            checkpointer=checkpointer,
            prompt="You are a code generation agent who helps users write code for the Gel database.",
        )

        config = {"configurable": {"thread_id": "1"}}
        response = await agent.ainvoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": query,
                    }
                ]
            },
            config,
        )

        pprint(response)
    
    print(response["messages"][-1].content)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gel LangChain Agent")
    parser.add_argument("query", help="The query to process")
    args = parser.parse_args()
    asyncio.run(main(args.query))

