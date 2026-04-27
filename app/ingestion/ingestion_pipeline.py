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

def process_file(file_path):
    parser = get_parser(file_path)
    if not parser:
        return  # skip unsupported file
    
    with open(file_path, "rb") as f:
        code = f.read()

    tree = parser.parse(code)
    chunks = chunk_nodes(tree.root_node, code, 1000, file_path)
    return chunks


def ingest_repo(folder_path):
    total = 0
    skip=0
    for dirpath, dirnames, filenames in os.walk(folder_path):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for file in filenames:
            # if file.endswith(".py"):
            file_path=os.path.join(dirpath, file).replace("\\", "/")
            
            print(f"Processing file: {file_path}")
            
            ext=split_extension(file_path)
            
            # print(f"file path: {file_path.endswith(('.py','.ts'))}")
            #🍁 tuple in python is defined with parentheses, so we can use it to check for multiple extensions at once.
            
            if ext in LANGUAGE_MAP:
            
                log.info(f" - - - - Processing: {file_path}")
                try:
                    
                    chunks = process_file(file_path)

                    stored, skipped = chunk_to_chromadb(chunks,collection=collection)
                    skip+=skipped
                    total += stored
                except Exception as e:
                    log.error(f"   failed: {file_path} → {e}")
    

    print(f"\nTotal stored: {total}, \nTotal skipped:{skipped}")