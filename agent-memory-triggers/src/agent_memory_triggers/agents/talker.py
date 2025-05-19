from pydantic_ai import Agent, RunContext
from pydantic import BaseModel, ConfigDict
from gel import AsyncIOClient
import gel.ai


class TalkerContext(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    gel_client: AsyncIOClient
    user_facts: list[str]
    behavior_prompt: list[str]


agent = Agent("openai:gpt-4o-mini", deps_type=TalkerContext)


PROMPT_TEMPLATE = """
You are a helpful assistant that can answer questions and help with tasks.

You have the following facts about the user:
{user_facts}

You need to follow these behavior preferences:
{behavior_prompt}
"""


@agent.system_prompt
async def get_system_prompt(context: RunContext[TalkerContext]):
    return PROMPT_TEMPLATE.format(
        user_facts="\n".join(context.deps.user_facts),
        behavior_prompt=context.deps.behavior_prompt,
    )


@agent.tool
async def search_resources(context: RunContext[TalkerContext], query: str) -> list[str]:
    gel_ai_client = await gel.ai.create_async_rag_client(
        context.deps.gel_client, model="gpt-4o-mini"
    )
    embedding_vector = await gel_ai_client.generate_embeddings(
        query,
        model="text-embedding-3-small",
    )

    resources = await context.deps.gel_client.query(
        """
        with 
            vector_search := ext::ai::search(Resource, <array<float32>>$embedding_vector),
            resources := (
                select vector_search.object
                order by vector_search.distance asc 
                limit 5
            )
        select resources.body
        """,
        embedding_vector=embedding_vector,
    )

    return resources


async def get_talker_agent() -> Agent:
    return agent
