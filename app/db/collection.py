from chromadb.utils.embedding_functions import (
    DefaultEmbeddingFunction,
    ChromaCloudSpladeEmbeddingFunction
)
from app.db.client import client
from app.db.schema import schema
from chromadb import  SparseVectorIndexConfig, K

dense_embed_fn = DefaultEmbeddingFunction()
sparse_embed_fn = ChromaCloudSpladeEmbeddingFunction()


def get_collection():
    
    
    """
    Call ONCE to create collection with sparse index.
    After this, re-run scanner.py to re-ingest all chunks.
    """
    schema.create_index(
        config=SparseVectorIndexConfig(
            source_key=K.DOCUMENT,
            embedding_function=sparse_embed_fn,
        ),
        key="sparse_embedding",
    )
