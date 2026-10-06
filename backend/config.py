from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env from backend folder or root
backend_dir = Path(__file__).resolve().parent
load_dotenv(dotenv_path=backend_dir / ".env")
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
FALLBACK_MODELS = [
    GEMINI_MODEL,
    "gemini-flash-latest",
    "gemini-3.5-flash",
    "gemini-2.5-flash-lite",
]

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "")

def get_allowed_origins() -> list[str]:
    """
    Returns allowed origins for CORS.
    Includes local development ports by default, plus any production origins
    specified via the FRONTEND_ORIGIN environment variable (supports comma-separated values).
    """
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    if FRONTEND_ORIGIN:
        for origin in FRONTEND_ORIGIN.split(","):
            cleaned = origin.strip().rstrip("/")
            if cleaned and cleaned not in origins:
                origins.append(cleaned)
    return origins