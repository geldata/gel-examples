import os
import torch
from PIL import Image
from typing import List
from gel.ai import InsertRecord
from vector_store import vector_store
from constants import DEVICE, IMAGES_DIR, model, preprocess


def load_images(image_paths: List[str]) -> torch.Tensor:
    """Load and preprocess images as a batch tensor."""
    images = [
        preprocess(Image.open(path).convert("RGB")) for path in image_paths
    ]
    return torch.stack(images).to(DEVICE)


def generate_embeddings(image_paths: List[str]) -> List[List[float]]:
    """Generate CLIP embeddings for a list of images."""
    image_input = load_images(image_paths)
    with torch.no_grad():
        embeddings = model.encode_image(image_input).float()
    return embeddings.cpu().numpy().tolist()


def store_embeddings():
    """Process all images and store their embeddings in the vectorstore."""

    # Get all jpg files
    image_files = [
        f for f in os.listdir(IMAGES_DIR) if f.lower().endswith(".jpg")
    ]

    if not image_files:
        print("No images found in the images directory.")
        return

    print(f"🔍 Found {len(image_files)} images. Generating embeddings...")

    # Process all files at once
    file_paths = [os.path.join(IMAGES_DIR, file) for file in image_files]
    embeddings = generate_embeddings(file_paths)

    # Create records for all images
    records = [
        InsertRecord(
            embedding=emb,
            text=file,
        )
        for emb, file in zip(embeddings, image_files)
    ]

    # Store all records
    if records:
        vector_store.add_vectors(records)
        print(f"✅ Stored {len(records)} image records.")


if __name__ == "__main__":
    store_embeddings()
