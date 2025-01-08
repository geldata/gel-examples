from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from http import HTTPStatus
from .searcher import fetch_text_results
from openai import OpenAI
from dotenv import load_dotenv
from edgedb import create_async_client

from .queries.get_users_async_edgeql import get_users as get_users_query, GetUsersResult
from .queries.get_user_by_name_async_edgeql import (
    get_user_by_name as get_user_by_name_query,
    GetUserByNameResult,
)
from .queries.get_chats_async_edgeql import get_chats as get_chats_query, GetChatsResult
from .queries.get_chat_by_id_async_edgeql import (
    get_chat_by_id as get_chat_by_id_query,
    GetChatByIdResult,
)
from .queries.get_messages_async_edgeql import (
    get_messages as get_messages_query,
    GetMessagesResult,
)

_ = load_dotenv()

app = FastAPI()
llm_client = OpenAI()
db_client = create_async_client()


class SearchTerms(BaseModel):
    query: str


class SearchResult(BaseModel):
    response: str | None = None
    sources: list[str] | None = None
    error: str | None = None


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/users")
async def get_users(
    username: str = Query(None),
) -> list[GetUsersResult] | GetUserByNameResult:
    """List all users or get a user by their username"""
    if username:
        user = await get_user_by_name_query(db_client, username)
        if not user:
            raise HTTPException(
                HTTPStatus.NOT_FOUND,
                detail={"error": f"Error: user {username} does not exist."},
            )
        return user
    else:
        return await get_users_query(db_client)


@app.get("/users/{username}/chats")
async def get_chats(
    username: str, chat_id: str = Query(None)
) -> list[GetChatsResult] | GetChatByIdResult:
    """List user's chats or get a chat by username and id"""
    if chat_id:
        chat = await get_chat_by_id_query(db_client, username, chat_id)
        if not chat:
            raise HTTPException(
                HTTPStatus.NOT_FOUND,
                detail={"error": f"Chat {chat_id} for user {username} does not exist."},
            )
        return chat
    else:
        return await get_chats_query(db_client, username)


@app.get("/users/{name}/chats/{chat_id}/messages")
async def get_messages(username: str, chat_id: str) -> list[GetMessagesResult]:
    """Fetch all messages from a chat"""
    return await get_messages_query(db_client, username, chat_id)


@app.post("/search")
async def search(search_terms: SearchTerms) -> SearchResult:
    search_result = await generate(search_terms.query)
    return search_result


async def do_search(query):
    return [{"url": url, "text": text} for url, text in fetch_text_results(query)]


async def generate(query):
    web_results = await do_search(query)

    system_prompt = (
        "You are a helpful assistant that answers user's questions"
        + " by finding relevant information in web search results"
    )

    prompt = f"User search query: {query}\n\nWeb search results:\n"

    for i, result in enumerate(web_results):
        prompt += f"Result {i} (URL: {result['url']}):\n"
        prompt += f"{result['text']}\n\n"

    completion = llm_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    generated_query = completion.choices[0].message.content

    search_result = SearchResult(
        response=generated_query, sources=[result["url"] for result in web_results]
    )

    # search_result = SearchResult(sources=[result["url"] for result in web_results])
    return search_result
