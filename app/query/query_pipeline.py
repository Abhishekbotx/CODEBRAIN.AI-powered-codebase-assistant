from app.query.search import hybrid_search
from app.query.models import SearchResult
def format_docs(results: list[SearchResult]) -> str:
    """Format retrieved chunks into a single context string for the prompt."""
    if not results:
        return "No relevant code found."

    
    #Till now we are not printing content on clientside, we can need the content aswell if we want to print it in the client side"
    # print(f"resultsss::{results}")
    parts = []
    for i, r in enumerate(results, 1): #The second argument adds a counter as the key , so you can put your start there for ex:1
        meta = r.metadata
        print(f"meta data {i}::: {r}")
        parts.append(
            f"### Chunk {i}\n"
            f"File: `{meta.get('file', 'unknown')}`  "
            f"Lines: {meta.get('start_line')}–{meta.get('end_line')}  "
            f"Type: {meta.get('type', '?')}\n\n"
            f"```python\n{r.content}\n```"
        )
    joined_chunks="\n\n---\n\n".join(parts)    
    
    print("joined_chunkss::",joined_chunks)
    return joined_chunks



