from .agent import main as agent_main
import asyncio

def main() -> None:
    asyncio.run(agent_main())
