from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from agent_memory_triggers.routers import chat_api, agent_api


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost:8501"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_api.router)
app.include_router(agent_api.router)
