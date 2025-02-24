import os
import torch
import clip
from dotenv import load_dotenv

load_dotenv()

# Needed for requests to OpenAI API GPT-4o model.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# This gets the directory where the script is located - app directory.
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)  # todod explain this better in the tutorial

# Folder where images are stored relative to the app directory.
IMAGES_DIR = os.path.join(BASE_DIR, "images")

# Folder where HTML templates are stored.
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

# CLIP model to use for generating embeddings.
CLIP_MODEL = "ViT-B/32"

# Device on which to load CLIP model. CUDA is for GPU devices.
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Load CLIP model on device.
model, preprocess = clip.load(CLIP_MODEL, device=DEVICE)
