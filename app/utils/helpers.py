import os
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("hf-internal-testing/llama-tokenizer")

def count_tokens(code):
    encoding = tokenizer.encode(code, add_special_tokens=False)
    return len(encoding)

def tokenize_text(text):
    return tokenizer.encode(text, add_special_tokens=False)

