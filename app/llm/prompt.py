from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Single-turn prompt (used in basic chain)
SINGLE_TURN_PROMPT = ChatPromptTemplate.from_template(
    """You are an expert code assistant. Use the retrieved code chunks below to answer the question.
Be specific — mention file names and line numbers when relevant.
If the answer is not in the retrieved chunks, say so clearly.

{context}

Question: {question}

Answer:"""
)

