from chromadb.utils.embedding_functions import (
    DefaultEmbeddingFunction,
    ChromaCloudSpladeEmbeddingFunction
)
from app.db.client import client
from app.db.schema import schema
from chromadb import  SparseVectorIndexConfig, K

