# AUTOGENERATED FROM 'app/queries/get_chat_by_id.edgeql' WITH:
#     $ edgedb-py


from __future__ import annotations
import dataclasses
import edgedb
import uuid


class NoPydanticValidation:
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        # Pydantic 2.x
        from pydantic_core.core_schema import any_schema
        return any_schema()

    @classmethod
    def __get_validators__(cls):
        # Pydantic 1.x
        from pydantic.dataclasses import dataclass as pydantic_dataclass
        _ = pydantic_dataclass(cls)
        cls.__pydantic_model__.__get_validators__ = lambda: []
        return []


@dataclasses.dataclass
class GetChatByIdResult(NoPydanticValidation):
    id: uuid.UUID
    messages: list[GetChatByIdResultMessagesItem]
    summary: str | None
    user: list[GetChatByIdResultUserItem]


@dataclasses.dataclass
class GetChatByIdResultMessagesItem(NoPydanticValidation):
    id: uuid.UUID


@dataclasses.dataclass
class GetChatByIdResultUserItem(NoPydanticValidation):
    id: uuid.UUID


async def get_chat_by_id(
    executor: edgedb.AsyncIOExecutor,
    *,
    username: str,
    chat_id: uuid.UUID,
) -> GetChatByIdResult | None:
    return await executor.query_single(
        """\
        select ChatHistory {
            messages,
            summary,
            user := .<chats[is User],
        } filter .user.name = <str>$username and .id = <uuid>$chat_id;\
        """,
        username=username,
        chat_id=chat_id,
    )
