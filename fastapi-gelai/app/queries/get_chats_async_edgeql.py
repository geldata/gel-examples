# AUTOGENERATED FROM 'app/queries/get_chats.edgeql' WITH:
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
class GetChatsResult(NoPydanticValidation):
    id: uuid.UUID
    messages: list[GetChatsResultMessagesItem]
    user: list[GetChatsResultUserItem]


@dataclasses.dataclass
class GetChatsResultMessagesItem(NoPydanticValidation):
    id: uuid.UUID
    role: str | None
    body: str | None
    sources: list[str]


@dataclasses.dataclass
class GetChatsResultUserItem(NoPydanticValidation):
    id: uuid.UUID


async def get_chats(
    executor: edgedb.AsyncIOExecutor,
    *,
    username: str,
) -> list[GetChatsResult]:
    return await executor.query(
        """\
        select Chat {
            messages: { role, body, sources },
            user := .<chats[is User],
        } filter .user.name = <str>$username;\
        """,
        username=username,
    )
