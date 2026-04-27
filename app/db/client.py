import chromadb
from dotenv import load_dotenv
from app.config.settings import CHROMA_DATABASE_ID,CHROMA_API_KEY,CHROMA_TENANT_ID


client = chromadb.CloudClient(
    api_key=CHROMA_API_KEY,
    tenant=CHROMA_TENANT_ID,
    database=CHROMA_DATABASE_ID,
)
