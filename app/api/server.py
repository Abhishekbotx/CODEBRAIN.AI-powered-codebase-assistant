"""
server.py
Flask API for CodeBrain — code ingestion + hybrid search + LLM streaming.

"""

import os


from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

from app.ingestion.ingestion_pipeline import ingest_repo
from app.llm.generator import rag_chain
from app.utils.logger import log

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = "uploaded_repos"
os.makedirs(UPLOAD_DIR, exist_ok=True)


if __name__ == "__main__":
    app.run(debug=True, port=5000)