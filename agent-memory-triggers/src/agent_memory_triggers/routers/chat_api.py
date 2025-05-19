from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from pydantic_ai import Agent
from gel import AsyncIOClient
import gel.ai

import uuid
import json

from agent_memory_triggers.agents.talker import get_talker_agent, TalkerContext
from agent_memory_triggers.common.types import CommonChat, CommonMessage
from agent_memory_triggers.db import get_gel


router = APIRouter()


class MessageRequest(BaseModel):
    chat_id: uuid.UUID
    message: CommonMessage


@router.get("/chat/{chat_id}")
async def get_chat(chat_id: uuid.UUID, gel_client=Depends(get_gel)) -> CommonChat:
    result = await gel_client.query_single(
        """
        with 
        chat_id := <uuid>$chat_id,
        chat := (select Chat filter .id = chat_id)
    select assert_exists(chat) {
        id,
        title,
        archive: {
            llm_role,
            body,
            tool_name,
            tool_args,
            created_at,
            is_evicted
        } order by .created_at,
        history: {
            llm_role,
            body,
            tool_name,
            tool_args,
            created_at,
            is_evicted
        } order by .created_at
    }
    """,
        chat_id=chat_id,
    )
    return CommonChat.from_gel_result(result)


@router.get("/chats")
async def get_chats(gel_client=Depends(get_gel)) -> list[CommonChat]:
    result = await gel_client.query(
        """
        select Chat {
            id,
            title,
            history: {
                llm_role,
                body,
                tool_name,
                tool_args,
                created_at,
                is_evicted
            } order by .created_at,
            archive: {
                llm_role,
                body,
                tool_name,
                tool_args,
                created_at,
                is_evicted
            } order by .created_at
        }
        order by .created_at desc
        """
    )
    return [CommonChat.from_gel_result(chat) for chat in result]


@router.post("/chat")
async def create_chat(gel_client=Depends(get_gel)) -> uuid.UUID:
    result = await gel_client.query_single(
        """
        insert Chat; 
        """
    )
    return result.id


@router.post("/message")
async def handle_message(
    request: MessageRequest,
    talker_agent: Agent = Depends(get_talker_agent),
    gel_client: AsyncIOClient = Depends(get_gel),
) -> StreamingResponse:
    chat = await get_chat(request.chat_id, gel_client)

    async def stream_response():
        yield "*Fetching facts...*\n"

        gel_ai_client = await gel.ai.create_async_rag_client(
            gel_client, model="gpt-4o-mini"
        )
        embedding_vector = await gel_ai_client.generate_embeddings(
            request.message.content,
            model="text-embedding-3-small",
        )

        user_facts = await gel_client.query(
            """
            with
                vector_search := ext::ai::search(Fact, <array<float32>>$embedding_vector),
                facts := (
                    select vector_search.object
                    order by vector_search.distance asc
                    limit 5
                )
            select facts.body
            """,
            embedding_vector=embedding_vector,
        )

        # user_facts = await gel_client.query(
        #     """
        #     select Fact.body
        #     """
        # )

        behavior_prompt = await gel_client.query(
            """
            select Prompt.body
            """
        )

        yield "*Gathering context...*\n"

        full_response = ""

        async with talker_agent.run_stream(
            request.message.content,
            message_history=chat.to_pydantic_ai_messages(),
            deps=TalkerContext(
                gel_client=gel_client,
                user_facts=user_facts,
                behavior_prompt=behavior_prompt,
            ),
        ) as result:
            async for text in result.stream_text(delta=True):
                full_response += text
                yield text


        new_messages = []
        for message in result.new_messages():
            for part in message.parts:
                common_message = CommonMessage.from_pydantic_ai_message_part(part)
                new_messages.append(common_message.model_dump())

        await gel_client.query(
            """
            with
                messages_json := <json>$messages_json,
                chat := assert_exists(
                    (select Chat filter .id = <uuid>$chat_id)
                ),
                new_messages := (
                    for raw_message in json_array_unpack(messages_json) 
                    union (
                        insert Message {
                            llm_role := <str>raw_message['role'],
                            body := <optional str>raw_message['content'],
                            tool_name := <optional str>raw_message['tool_name'],
                            tool_args := to_json(<optional str>raw_message['tool_args']),
                        }
                    )
                )
            update chat
            set {
                archive := distinct (.archive union new_messages)
            }
            """,
            chat_id=request.chat_id,
            messages_json=json.dumps(new_messages, default=str),
        )

    return StreamingResponse(
        stream_response(),
        media_type="text/plain",
    )
