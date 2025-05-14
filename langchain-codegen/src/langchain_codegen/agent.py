from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver
from dotenv import load_dotenv
from langchain_codegen.rag import load_vectorstore


load_dotenv()

checkpointer = InMemorySaver()
vector_store = load_vectorstore()


def search_docs(query: str) -> str:
    """Use vector search to find relevant documentation about the Gel database."""
    results = vector_store.similarity_search(query)
    return results


agent = create_react_agent(
    model="openai:gpt-4o-mini",
    tools=[search_docs],
    checkpointer=checkpointer,
    prompt="You are a code generation agent who helps users write code for the Gel database.",
)

if __name__ == "__main__":
    config = {"configurable": {"thread_id": "1"}}

    response = agent.invoke(
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
    print(response)
