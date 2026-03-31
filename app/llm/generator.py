import sys
import os
from langchain.messages import AIMessage, HumanMessage
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import argparse
from app.llm.chain import rag_chain,make_chat_chain


#🍁Till now we are not printing content on clientside, we can need the content aswell if we want to print it in the client side"


def ask(question: str, stream: bool = False) -> str:
    """
    Single-turn question answering.

    Args:
        question: natural language question about the codebase
        stream:   if True, prints tokens as they arrive and returns full string

    Returns:
        answer string
    """
    if stream:
        full = ""
        for chunk in rag_chain.stream(question): #use stream mode when agent is involved with toools
            
            print(chunk, end="", flush=True)
            full += chunk
        print("fulll:",full)
        return full
    else:
        return rag_chain.invoke(question)
