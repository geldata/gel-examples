from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from http import HTTPStatus
from .searcher import fetch_text_results
from openai import OpenAI
from dotenv import load_dotenv
from edgedb import create_async_client, ConstraintViolationError

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
from .queries.create_user_async_edgeql import (
    create_user as create_user_query,
    CreateUserResult,
)
from .queries.create_chat_async_edgeql import (
    create_chat as create_chat_query,
    CreateChatResult,
)
from .queries.add_message_async_edgeql import (
    add_message as add_message_query,
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
        user = await get_user_by_name_query(db_client, name=username)
        if not user:
            raise HTTPException(
                HTTPStatus.NOT_FOUND,
                detail={"error": f"Error: user {username} does not exist."},
            )
        return user
    else:
        return await get_users_query(db_client)


@app.post("/users", status_code=HTTPStatus.CREATED)
async def post_user(username: str = Query()) -> CreateUserResult:
    try:
        return await create_user_query(db_client, username=username)
    except ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": f"Username '{username}' already exists."},
        )


@app.get("/chats")
async def get_chats(
    username: str = Query(), chat_id: str = Query(None)
) -> list[GetChatsResult] | GetChatByIdResult:
    """List user's chats or get a chat by username and id"""
    if chat_id:
        chat = await get_chat_by_id_query(db_client, username=username, chat_id=chat_id)
        if not chat:
            raise HTTPException(
                HTTPStatus.NOT_FOUND,
                detail={"error": f"Chat {chat_id} for user {username} does not exist."},
            )
        return chat
    else:
        return await get_chats_query(db_client, username=username)


@app.post("/chats", status_code=HTTPStatus.CREATED)
async def post_chat(username: str) -> CreateChatResult:
    return await create_chat_query(db_client, username=username)


@app.get("/messages")
async def get_messages(
    username: str = Query(), chat_id: str = Query()
) -> list[GetMessagesResult]:
    """Fetch all messages from a chat"""
    return await get_messages_query(db_client, username=username, chat_id=chat_id)


@app.post("/messages", status_code=HTTPStatus.CREATED)
async def post_messages(
    username: str = Query(),
    chat_id: str = Query(),
    query: str = Query(),
) -> SearchResult:
    chat_history = await get_messages_query(
        db_client, username=username, chat_id=chat_id
    )

    _ = await add_message_query(
        db_client,
        username=username,
        message_role="user",
        message_body=query,
        sources=[],
        chat_id=chat_id,
    )

    web_sources = await find_sources(query, chat_history)
    search_result = await generate_answer(query, chat_history, web_sources)

    _ = await add_message_query(
        db_client,
        username=username,
        message_role="assistant",
        message_body=search_result.response,
        sources=search_result.sources,
        chat_id=chat_id,
    )

    return search_result


async def find_sources(query: str, message_history: list[str]) -> dict[str, str]:
    system_prompt = (
        "You are a helpful assistant."
        + " Your job is to summarize chat history into a standalone google search query."
        + " Only provide the query itself as your response."
    )

    formatted_history = "\n---\n".join(message for message in message_history)
    prompt = f"Chat history: {formatted_history}\n\nUser message: {query} \n\n"

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

    llm_response = completion.choices[0].message.content
    search_results = [
        {"url": url, "text": text} for url, text in fetch_text_results(llm_response)
    ]

    return search_results


async def generate_answer(
    query: str, chat_history: str, web_sources: dict[str, str]
) -> SearchResult:
    system_prompt = (
        "You are a helpful assistant that answers user's questions"
        + " by finding relevant information in web search results"
    )

    prompt = f"User search query: {query}\n\nWeb search results:\n"

    for i, source in enumerate(web_sources):
        prompt += f"Result {i} (URL: {source['url']}):\n"
        prompt += f"{source['text']}\n\n"

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

    llm_response = completion.choices[0].message.content
    search_result = SearchResult(
        response=llm_response, sources=[source["url"] for source in web_sources]
    )

    return search_result
