from app.db.collection  import get_collection
from app.ingestion.chunker import chunk_nodes
from app.db.collection import chunk_to_chromadb
from app.ingestion.language_config import get_parser,LANGUAGE_MAP
import os
from app.utils.logger import log 
from app.utils.helpers import split_extension
# derived directly from language_config — no duplication
SUPPORTED_EXTENSIONS = tuple(LANGUAGE_MAP.keys())
SKIP_DIRS = {"__pycache__", "node_modules", ".git", ".venv", "venv", "dist", "build"}
collection = get_collection()

