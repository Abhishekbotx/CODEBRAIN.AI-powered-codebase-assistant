from app.query.models import SearchResult
from typing import Optional
from chromadb import Search, K, Knn, Rrf
from app.db.collection import get_collection


def hybrid_search(
    query: str,
    n_results:       int   = 5,
    file_filter:     Optional[str] = None,
    type_filter:     Optional[str] = None,
    semantic_weight: float = 0.7,
    keyword_weight:  float = 0.3,
    knn_limit:       int   = 200,
    k:               int   = 60,
) -> list[SearchResult]:

    hybrid_rank = Rrf(
        ranks=[
            Knn(query=query, key="#embedding",        return_rank=True, limit=knn_limit),
            Knn(query=query, key="sparse_embedding",  return_rank=True, limit=knn_limit),
        ],
        weights=[semantic_weight, keyword_weight],
        k=k,
    )

    search_obj = Search().rank(hybrid_rank).limit(n_results)

    if file_filter and type_filter:
        search_obj = search_obj.where(K("file").contains(file_filter) & K("type").contains(type_filter))
    elif file_filter:
        search_obj = search_obj.where(K("file").contains(file_filter))
    elif type_filter:
        search_obj = search_obj.where(K("type").contains(type_filter))

    search_obj = search_obj.select(
        K.DOCUMENT, K.SCORE, K.ID,
        "file", "start_line", "end_line", "type", "tokens", "node_count", "parent_context",
    )
    collection=get_collection()
    rows = collection.search(search_obj).rows()[0]

    return [
        SearchResult(
            id       = row["id"],
            content  = row["document"],
            score    = row["score"],
            metadata = row["metadata"],
        )
        for row in rows
    ]

