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

    