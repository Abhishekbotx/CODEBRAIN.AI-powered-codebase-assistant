from chromadb import Schema, SparseVectorIndexConfig, K
from chromadb.utils.embedding_functions import (ChromaCloudSpladeEmbeddingFunction)

sparse_embed_fn = ChromaCloudSpladeEmbeddingFunction()
schema = Schema()
schema.create_index(
    config=SparseVectorIndexConfig(
        source_key=K.DOCUMENT,
        embedding_function=sparse_embed_fn,
    ),
    key="sparse_embedding",
)