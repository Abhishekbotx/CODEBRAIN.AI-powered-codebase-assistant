"""
server.py
Flask API for CodeBrain — code ingestion + hybrid search + LLM streaming.

Endpoints:
  POST /upload   — upload files, ingest into ChromaDB
"""

import os
import shutil
import json
import traceback

from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

from app.ingestion.ingestion_pipeline import ingest_repo
from app.llm.generator import rag_chain
from app.utils.logger import log

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = "uploaded_repos"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ── /upload ───────────────────────────────────────────────────────────────────

@app.route("/upload", methods=["POST"])
def upload_files():
    """
    Accept multipart file upload (files[] field).
    Preserves relative paths via the filename field (e.g. "src/utils.py").
    Runs ingestion after saving.
    """
    files = request.files.getlist("files")
    log.info(f"---> all filess: {files}")
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    repo_path = os.path.join(UPLOAD_DIR, "repo")

if __name__ == "__main__":
    app.run(debug=True, port=5000)