import torch
import clip
import openai
from pathlib import Path
from fastapi import FastAPI, Form, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from .vector_store import vector_store
from .constants import IMAGES_DIR, TEMPLATES_DIR, DEVICE, OPENAI_API_KEY


# Load CLIP model on device.
model, preprocess = clip.load("ViT-B/32", device=DEVICE)

app = FastAPI()

# Set up templates and static files
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

# Set OpenAI API key
openai.api_key = OPENAI_API_KEY


def generate_gpt_response(prompt: str, base64_images: list):
    """Generate a text response using OpenAI's GPT-4o."""

    image_data = [
        {
            "type": "image_url",
            "image_url": {
                "url": f"{img}",
                # "detail": "low",
            },
        }
        for img in base64_images
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

    image_uris = [
        f'images/{result.metadata["filename"]}'
        for result in filtered_results
    ]

    print("image_uris", image_uris)

    base64_images = [result.text for result in filtered_results]

    return image_uris, base64_images


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
                "results": [],
            },
        )

    if not query:
        return templates.TemplateResponse(
            "search.html",
            {
                "request": request,
                "query": None,
                "response": "Please enter a query.",
                "results": [],
            },
        )

    image_uris, base64_images = query_similar_images(query)

    if not image_uris:
        return templates.TemplateResponse(
            "search.html",
            {
                "request": request,
                "query": query,
                "response": "No images found.",
                "results": [],
            },
        )

    response_text = generate_gpt_response(query, base64_images)

    return templates.TemplateResponse(
        "search.html",
        {
            "request": request,
            "query": query,
            "response": response_text,
            "results": image_uris,
        },
    )
