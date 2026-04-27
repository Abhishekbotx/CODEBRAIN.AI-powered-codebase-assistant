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


def chat_repl() :
    """
    Interactive multi-turn chat REPL.
    Type 'exit' or 'quit' to stop.
    Type 'clear' to reset chat history.
    """
    print("\n" + "═" * 60)
    print("  CodeBrain Chat  —  Llama 3 70B + Hybrid Search")
    print("  Commands: 'exit' to quit | 'clear' to reset history")
    print("═" * 60 + "\n")

    history: list = []

    while True:
        try:
            question = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBye!")
            break

        if not question:
            continue

        if question.lower() in ("exit", "quit"):
            print("Bye!")
            break

        if question.lower() == "clear":
            history = []
            print("History cleared.\n")
            continue
        print("history present:",history)    
        chain = make_chat_chain(history)

        print("\nAssistant: ", end="", flush=True) # 🍁flush =true, It forces Python to immediately write the output to the console.
        
        answer = ""
        for chunk in chain.stream(question):
            print(chunk, end="", flush=True)
            answer += chunk
        print("\n")

        # Update history for next turn
        history.append(HumanMessage(content=question))
        history.append(AIMessage(content=answer))




if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CodeBrain query pipeline")
    parser.add_argument("--chat", action="store_true", help="Launch interactive chat REPL")
    parser.add_argument("--question", "-q", type=str, help="Single question to answer")
    print("parseeer:",parser)
    args = parser.parse_args()

    if args.chat:
        chat_repl()
    elif args.question:
        ask(args.question,True)
    else:
        question = "where is the chromadb setup code?"
        answer = ask(question,True)
        print(f"A: {answer}\n")
            
            
#----Fixes-----
# 1. If some asks bad questions then chromdb should be hit for hybrid search it should be responded at the same time