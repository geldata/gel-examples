from pydantic import BaseModel, Field
import uuid
import datetime
from pydantic_ai.messages import ModelMessage
from pydantic_ai.messages import (
    SystemPromptPart,
    UserPromptPart,
    TextPart,
    ToolReturnPart,
    RetryPromptPart,
    ToolCallPart,
)
from pydantic_ai.messages import ModelRequest, ModelResponse


class CommonMessage(BaseModel):
    role: str
    content: str | None = None
    tool_name: str | None = None
    tool_args: dict | None = None
    created_at: datetime.datetime | None = None
    is_evicted: bool = False

    @classmethod
    def from_gel_result(cls, result: dict):
        return cls(
            role=result.llm_role,
            content=result.body,
            tool_name=result.tool_name,
            tool_args=result.tool_args,
            created_at=result.created_at,
            is_evicted=result.is_evicted,
        )

    @classmethod
    def from_pydantic_ai_message_part(cls, message: ModelMessage):
        match getattr(message, "part_kind", "unknown"):
            case "system-prompt":
                role = "system"
            case "user-prompt":
                role = "user"
            case "text":
                role = "assistant"
            case "tool-return":
                role = "tool-return"
            case "retry-prompt":
                role = "retry-prompt"
            case "tool-call":
                role = "tool-call"
            case _:
                role = "unknown"

        if hasattr(message, "content"):
            if isinstance(message.content, str):
                content = message.content
            elif isinstance(message.content, list):
                content = "\n".join([part for part in message.content])
        else:
            content = None

        tool_name = message.tool_name if hasattr(message, "tool_name") else None
        tool_args = message.tool_args if hasattr(message, "tool_args") else None

        return cls(
            role=role,
            content=content,
            tool_name=tool_name,
            tool_args=tool_args,
            created_at=message.timestamp if hasattr(message, "timestamp") else None,
        )

    def to_pydantic_ai_message_part(self):
        """Convert CommonMessage to appropriate Pydantic AI message part."""

        match self.role:
            case "system":
                return SystemPromptPart(content=self.content, timestamp=self.created_at)
            case "user":
                return UserPromptPart(content=self.content, timestamp=self.created_at)
            case "assistant":
                return TextPart(content=self.content)
            case "tool-return":
                return ToolReturnPart(content=self.content)
            case "retry-prompt":
                return RetryPromptPart(content=self.content)
            case "tool-call":
                return ToolCallPart(content=self.content)
            case _:
                return UserPromptPart(
                    content=f"[Unknown role message: {self.content}]",
                    timestamp=self.created_at,
                )


def to_common_messages(messages: list[ModelMessage]):
    common_messages = []
    for message in messages:
        for part in message.parts:
            common_messages.append(CommonMessage.from_pydantic_ai_message_part(part))
    return common_messages


class CommonChat(BaseModel):
    id: uuid.UUID | None = None
    title: str | None = None
    history: list[CommonMessage] = Field(default_factory=list)
    archive: list[CommonMessage] = Field(default_factory=list)

    @classmethod
    def from_gel_result(cls, result: dict):
        return cls(
            id=result.id,
            title=result.title,
            history=[CommonMessage.from_gel_result(msg) for msg in result.history],
            archive=[CommonMessage.from_gel_result(msg) for msg in result.archive],
        )

    def to_pydantic_ai_messages(self):
        turns = []
        current_turn: ModelMessage | None = None

        for message in self.history:
            turn_type = (
                ModelRequest if message.role in ["system", "user"] else ModelResponse
            )

            if current_turn is None or type(current_turn) is not turn_type:
                # If we have messages in the current chunk, save it
                if current_turn:
                    turns.append(current_turn)
                # Start a new chunk
                current_turn = turn_type(parts=[message.to_pydantic_ai_message_part()])
            else:
                # Add to the current chunk
                current_turn.parts.append(message.to_pydantic_ai_message_part())

        if current_turn:
            turns.append(current_turn)

        return turns
