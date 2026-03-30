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




def print_results(results: list[SearchResult], show_code: bool = True) -> None:
    print(f"\n{'═' * 60}  {len(results)} result(s)\n")
    for i, r in enumerate(results, 1):
        print(f"[{i}] {r.metadata.get('file')}  "
              f"lines {r.metadata.get('start_line')}–{r.metadata.get('end_line')}  "
              f"score={r.score:.4f}")
        if show_code:
            print("     ┌─────────────────────────────────────────")
            for line in r.content.splitlines()[:10]: #printing only 10 lines
                print(f"     │ {line}")
            if len(r.content.splitlines()) > 10:
                print(f"     │ … ({len(r.content.splitlines())} lines total)")
            print("     └─────────────────────────────────────────")
        print()
