import torch
import clip
import base64
import contextlib
from pathlib import Path
from PIL import Image
from typing import List
from gel.ai import RecordToInsert
from upyloadthing.client import UTApi
from upyloadthing.schemas import UTApiOptions
from vector_store import vector_store
from constants import IMAGES_DIR, DEVICE, UPLOADTHING_TOKEN


# Load CLIP model on device.
model, preprocess = clip.load("ViT-B/32", device=DEVICE)


# Initialize uploadthing client.
api = UTApi(UTApiOptions(token=UPLOADTHING_TOKEN))


def load_images(image_paths: List[str]) -> torch.Tensor:
    """Load and preprocess images as a batch tensor."""
    images = [
        preprocess(Image.open(path).convert("RGB")) for path in image_paths
    ]

    # Stack into a batch tensor
    return torch.stack(images).to(DEVICE)


def generate_embeddings(image_paths: List[str]) -> List[List[float]]:
    """Generate CLIP embeddings for a list of images."""

    image_input = load_images(image_paths)

    with torch.no_grad():
        embeddings = model.encode_image(image_input).float()

    return embeddings.cpu().numpy().tolist()  # Convert tensor to list


def encode_image_base64(image_path):
    """Convert an image to a base64 string for the LLM."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def upload_to_uploadthing(image_paths):
    """Upload an image to UploadThing and return the URL."""

    with contextlib.ExitStack() as stack:
        files = [stack.enter_context(open(path, "rb")) for path in image_paths]
        response = api.upload_files(files)

        return [result.url for result in response]


def store_embeddings(batch_size: int = 30):
    """Processes images and stores their embeddings in the vectorstore."""

    image_files = [
        f.name for f in IMAGES_DIR.iterdir() if f.suffix.lower() == ".jpg"
    ]

    if not image_files:
        print("No images found in the images directory.")
        return

    print(
        f"🔍 Found {len(image_files)} images. "
        f"Generating embeddings in batches of {batch_size}..."
    )

    for i in range(0, len(image_files), batch_size):
        files = image_files[i : i + batch_size]
        file_paths = [Path(IMAGES_DIR) / file for file in files]
        embeddings = generate_embeddings(file_paths)
        urls = upload_to_uploadthing(file_paths)

        records = [
            RecordToInsert(
                embedding=emb,
                text=url,
                metadata={"filename": file},
            )
            for emb, file, url in zip(embeddings, files, urls)
        ]

        if records:
            vector_store.add_vectors(records)
            print(f"✅ Stored {len(records)} image records.")


if __name__ == "__main__":
    store_embeddings()
