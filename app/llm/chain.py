from langchain_core.runnables import (
    RunnableParallel,
    RunnableLambda,
    RunnablePassthrough,
)

from langchain_core.output_parsers import StrOutputParser
from app.llm.prompt import SINGLE_TURN_PROMPT,CHAT_PROMPT
from app.query.query_pipeline import format_docs
from app.query.models import SearchResult
from app.query.search import hybrid_search
from app.config.hf_config import llm
from app.utils.helpers import debug_prompt


def retriever_fn(query: str) -> list[SearchResult]:
    """Run hybrid search and return ranked results."""
    return hybrid_search(
        query=query,
        n_results=3,
        # verbose=False,
    )


retriever = RunnableLambda(retriever_fn)
formatter = RunnableLambda(format_docs)


rag_chain = (
    RunnableParallel({
        "context":  retriever | formatter, #"context": "### Chunk 1...\n### Chunk 2..."
        "question": RunnablePassthrough(), #"question": "where is chromadb setup?" (same question which was asked)
    }) #{
#           "context": "### Chunk 1...\n...",
#           "question": "where is chromadb setup?"
#       }
#In Runnable parallel: They(context and question) run independently in parallel, then get merged.
    | SINGLE_TURN_PROMPT
    | RunnableLambda(debug_prompt)
    | llm
    | StrOutputParser()
)
