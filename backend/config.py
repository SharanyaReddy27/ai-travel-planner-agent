from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env from backend folder or root
backend_dir = Path(__file__).resolve().parent
load_dotenv(dotenv_path=backend_dir / ".env")
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")