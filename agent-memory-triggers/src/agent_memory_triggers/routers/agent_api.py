from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import httpx
import os

from agent_memory_triggers.db import get_gel
from agent_memory_triggers.agents.summarizer import get_summarizer_agent
from agent_memory_triggers.agents.extractor import get_extractor_agent, ExtractorContext
from agent_memory_triggers.common.types import CommonChat


router = APIRouter()


class SummarizeRequest(BaseModel):
    chat_id: str
    messages: list[str]
    cutoff: str
    summary_datetime: str


@router.post("/summarize")
async def summarize(
    request: SummarizeRequest,
    summarizer_agent=Depends(get_summarizer_agent),
    gel_client=Depends(get_gel),
):
    formatted_messages = "\n\n".join([m for m in request.messages])

    response = await summarizer_agent.run(
        f"""
        Summarize the following messages:
        {formatted_messages}
        Only respond with the summary, no other text.
        """
    )

    summary = response.output

    await gel_client.query(
        """
        select insert_summary(
            <uuid>$chat_id,
            <datetime><str>$cutoff,
            <str>$summary,
            <datetime><str>$summary_datetime
        )
        """,
        chat_id=request.chat_id,
        cutoff=request.cutoff,
        summary=summary,
        summary_datetime=request.summary_datetime,
    )

    return {"summary": summary}


class ExtractRequest(BaseModel):
    chat_id: str


@router.post("/extract")
async def extract(
    request: ExtractRequest,
    gel_client=Depends(get_gel),
    extractor_agent=Depends(get_extractor_agent),
):
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
        chat_id=request.chat_id,
    )
    chat = CommonChat.from_gel_result(result)

    formatted_messages = "\n\n".join([f"{m.role}: {m.content}" for m in chat.history])

    response = await extractor_agent.run(
        f"""
        Conversation history:
        {formatted_messages}
        """,
        deps=ExtractorContext(
            gel_client=gel_client,
        ),
    )

    return {"response": response.output}


class GetTitleRequest(BaseModel):
    chat_id: str
    messages: list[str]


@router.post("/get_title")
async def get_title(
    request: GetTitleRequest,
    gel_client=Depends(get_gel),
    summarizer_agent=Depends(get_summarizer_agent),
):
    formatted_messages = "\n\n".join([m for m in request.messages])

    response = await summarizer_agent.run(
        f"""
        Generate a concise descriptive title (5 words or less) for the following conversation.
        {formatted_messages}
        Only respond with the title, no other text.
        """
    )

    title = response.output

    await gel_client.query(
        """
        update Chat
        filter .id = <uuid>$chat_id
        set {
            title := <str>$title
        }
        """,
        chat_id=request.chat_id,
        title=title,
    )

    return {"title": title}
