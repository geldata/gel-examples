from dotenv import load_dotenv
from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.vector_stores.gel import GelVectorStore
import gel
import asyncio
import sys


load_dotenv()


gel_client = gel.create_async_client()
vector_store = GelVectorStore()


async def search_docs(query: str) -> str:
    """Search Gel documentation RAG for the query"""
    return await vector_store.aquery(query)


async def execute_query(query: str) -> str:
    """Execute Gel query"""
    return await gel_client.query(query)


llm = OpenAI(model="gpt-4o-mini")

SYSTEM_PROMPT = """
You are an agent that acts as a natural language interface to Gel.
You can search Gel documentation and execute Gel queries.

Here are some examples of Gel queries you might wanna run:

1. Introspect the schema

```edgeql
describe schema as sdl;
```

2. Select

```edgeql
select Type {
    id,
    some_property,
    some_link: {
        property_of_a_linked_type, 
    }
} limit 1;
```

3. Insert (note that ids are generated automatically)

```edgeql
insert Type {
    some_property := "some value",
}
```

4. Update

```edgeql
with some_obj := (
    select Type filter .id = <uuid>'...'
)
update some_obj 
set {
    some_property: "some new value",
}
```

5. Delete

```edgeql
delete Type filter .id = <uuid>'...';
```

If you need more information about a specific Gel concept, 
you can search the Gel documentation RAG for it.
"""

workflow = FunctionAgent(
    tools=[search_docs, execute_query],
    llm=llm,
    system_prompt=SYSTEM_PROMPT,
)


async def run_agent(query: str):
    response = await workflow.run(user_msg=query)
    print(response)


async def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        await run_agent(query)
    else:
        await run_agent("What kinds of plants do we have in the database?")
        
        new_plant_query = """
        I'd like to add a new plant to my collection. It's called a 'String of Pearls' 
        and it's a succulent with trailing stems covered in small, bead-like leaves that 
        resemble a pearl necklace. To care for it properly, water sparingly when the soil
        is completely dry, provide bright indirect light, and be careful not to overwater
        as it's prone to root rot. Could you add this to my plant database?
        """
        
        await run_agent(new_plant_query)


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
