from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_codegen.rag import load_vectorstore
from langchain_mcp_adapters.client import MultiServerMCPClient
import asyncio
from pathlib import Path
from pprint import pprint


load_dotenv()

ROOT_PATH = Path(".").resolve()
print(ROOT_PATH)


async def main():
    vector_store = await load_vectorstore()
    checkpointer = InMemorySaver()

    async with MultiServerMCPClient(
        {
            "gel": {
                "command": "uvx",
                "args": [
                    "--refresh",
                    "--directory",
                    "/Users/andrey/local/projects/gel_content_cooked/gel-examples/langchain-codegen",
                    "--from",
                    "git+https://github.com/geldata/gel-mcp.git@update-fastmcp",
                    "gel-mcp",
                    "--workflows-file",
                    "/Users/andrey/local/projects/mcp_server_built/gel_workflows/workflows.jsonl",
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
                        "content": "Write a minimal example of a schema with a computed backlink",
                    }
                ]
            },
            config,
        )

        pprint(response)
    
    print(response["messages"][-1].content)


if __name__ == "__main__":
    asyncio.run(main())

