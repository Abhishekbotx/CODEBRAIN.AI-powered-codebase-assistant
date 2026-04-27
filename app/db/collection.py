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

    # try:
    #     client.delete_collection("codebase")
    # except Exception:
    #     pass

    collection =client.get_or_create_collection(
                    name="codebase",
                    embedding_function=dense_embed_fn,
                    schema=schema
    )
    print("Collection created with sparse index. Now re-run scanner.py.")
    return collection





def chunk_to_chromadb(chunks,collection):
    stored=0;
    skipped=0;
    for chunk in chunks:
        print(f"Chunk: {chunk['type']} | Lines: {chunk['start_line']}-{chunk['end_line']} | Tokens: {chunk['tokens']} | Parent Context: {chunk['parent_context']}")

        try:
            collection.add(
                ids=[
                    f"{chunk['file_path']}:{chunk['start_line']}-{chunk['end_line']}"
                    
                ],
                documents=[
                    chunk["content"]      # ← raw code text, chroma embeds THIS
                    
                ],
                metadatas=[
                    {
                        "type":       chunk["type"],
                        "file":       chunk["file_path"],
                        "start_line": chunk["start_line"],
                        "end_line":   chunk["end_line"],
                        "tokens":     chunk["tokens"],
                        "node_count": chunk["node_count"],
                        "parent_context": chunk["parent_context"],
                    }
                    
                ]
                # no embeddings here → as chroma calls embed_fn(documents) internally
            )
            stored+=1
        except Exception as e:
            print(f"Error storing chunk: {e}")
            skipped+=1    

    print(f"stored: {stored} chunks")
    print(f"skipped: {skipped} chunks")
    
    return stored, skipped