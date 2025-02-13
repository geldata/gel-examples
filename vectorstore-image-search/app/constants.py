import os
import torch
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# This gets the directory where the script is running - app directory.
BASE_DIR = Path(__file__).resolve().parent

# Folder where images are stored relative to the app directory.
IMAGES_DIR = BASE_DIR / "images"

# Folder where HTML templates are stored.
TEMPLATES_DIR = BASE_DIR / "templates"

# Device on which to load CLIP model. CUDA is for GPU devices.
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Needed for requests to OpenAI API GPT-4o model.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables")
