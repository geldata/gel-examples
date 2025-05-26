from pydantic_ai import Agent


agent = Agent("openai:gpt-4o-mini")


@agent.system_prompt
def get_system_prompt():
    return "You are a summarizer that can summarize interactions between a user and an AI assistant."


def get_summarizer_agent():
    return agent
