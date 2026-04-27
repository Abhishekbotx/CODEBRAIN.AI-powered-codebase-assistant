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

# Multi-turn prompt (used in chat chain)
CHAT_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are an expert code assistant for a Python codebase.
        Use the retrieved code chunks to answer questions accurately.
        Reference filenames and line numbers when relevant.
        If the answer is not in the context, say so clearly.""",
    ),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "Retrieved code context:\n\n{context}\n\nQuestion: {question}"),
])