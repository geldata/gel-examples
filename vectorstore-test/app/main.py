import os
import openai
import base64
import torch
import clip
from fastapi import FastAPI, Form, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from .vector_store import vector_store
from .constants import IMAGES_DIR, TEMPLATES_DIR, OPENAI_API_KEY, DEVICE, model

app = FastAPI()

# Set up templates and static files
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

# Set OpenAI API key
openai.api_key = OPENAI_API_KEY


def encode_image_base64(image_path):
    """Convert an image to a base64 string for the LLM."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def generate_gpt_response(prompt: str, filenames: list):
    """Generate a text response using OpenAI's GPT-4o."""

    image_data = [
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{encode_image_base64(os.path.join(IMAGES_DIR, file))}",
                "detail": "low",
            },
        }
        for file in filenames
    ]

    messages = [
        {
            "role": "system",
            "content": """You are a helpful asistant that can answer 
            questions about nature images.""",
        },
        {
            "role": "user",
            "content": [{"type": "text", "text": f"{prompt}"}, *image_data],
        },
    ]

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=messages,
    )
    return response.choices[0].message.content


def generate_text_embedding(text: str) -> list:
    """Generate CLIP embedding for text query."""
    with torch.no_grad():
        text_tokens = clip.tokenize([text]).to(DEVICE)
        embedding = model.encode_text(text_tokens).numpy().flatten()
    return embedding.tolist()


def query_similar_images(query: str):
    """Retrieve the most similar images from Gel vectorstore."""
    query_embedding = generate_text_embedding(query)

    # By default vectorstore will return up to 4 results.
    results = vector_store.search_by_vector(vector=query_embedding)

    # Filter results by cosine similarity and then limit to 2 results.
    filtered_results = [
        result for result in results if result.cosine_similarity > 0.17
    ][0:2]

    images = [result.text for result in filtered_results]

    return images


@app.get("/")
@app.post("/")
async def search(request: Request, query: str = Form(None)):
    """Search images based on a text query and display results."""

    if request.method == "GET":
        return templates.TemplateResponse(
            "search.html",
            {
                "request": request,
                "query": None,
                "response": None,
                "images": [],
            },
        )

    if not query:
        return templates.TemplateResponse(
            "search.html",
            {
                "request": request,
                "query": None,
                "response": "Please enter a query.",
                "images": [],
            },
        )

    images = query_similar_images(query)

    if not images:
        return templates.TemplateResponse(
            "search.html",
            {
                "request": request,
                "query": query,
                "response": "Sorry, but we couldn't find have any relevant images in our database for your query.",
                "images": [],
            },
        )

    response_text = generate_gpt_response(query, images)

    return templates.TemplateResponse(
        "search.html",
        {
            "request": request,
            "query": query,
            "response": response_text,
            "images": images,
        },
    )
