from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from app.config.settings import HF_API_KEY,HF_MODEL_REPO_ID



repo_id=HF_MODEL_REPO_ID
_hf_endpoint = HuggingFaceEndpoint(
    repo_id=repo_id,
    huggingfacehub_api_token=HF_API_KEY,
    max_new_tokens=1024,
    temperature=0.5,
    provider="auto", 
    repetition_penalty=0.1,
    # provider="hyperbolic",
    # provider="nebius",
    # provider="together",
)
#hf_endpoint expects string

llm = ChatHuggingFace(llm=_hf_endpoint) #chathuugingface returns formatted string having user, question and all
#why do we need chathuggingface and endpoint both??
# HuggingFace gives you a raw text generator,
# LangChain chat pipelines require a chat interface,
# so you wrap the raw model with ChatHuggingFace.
