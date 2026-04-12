import os
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY=os.getenv("HUGGINGFACE_API_KEY")
HF_MODEL_REPO_ID=os.getenv("HUGGINGFACE_MODEL_REPO_ID")
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT_ID = os.getenv("CHROMA_TENANT_ID")
CHROMA_DATABASE_ID = os.getenv("CHROMA_DATABASE_ID")
PORT=os.getenv("PORT")
