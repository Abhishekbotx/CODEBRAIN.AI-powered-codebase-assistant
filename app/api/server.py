"""
server.py
Flask API for CodeBrain — code ingestion + hybrid search + LLM streaming.

Endpoints:
  POST /upload   — upload files, ingest into ChromaDB
  POST /chat     — streaming LLM answer via Server-Sent Events
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


# APIS

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

    # clearing previous upload
    if os.path.exists(repo_path):
        shutil.rmtree(repo_path)
    os.makedirs(repo_path, exist_ok=True)

    saved = []
    skipped = []

    for file in files:
        # file.filename carries the relative path when sent correctly
        relative = file.filename.replace("\\", "/")
        dest = os.path.join(repo_path, relative)
        os.makedirs(os.path.dirname(dest), exist_ok=True)

        try:
            file.save(dest)
            saved.append(relative)
        except Exception as e:
            skipped.append({"file": relative, "reason": str(e)})

    if not saved:
        return jsonify({"error": "All files failed to save", "details": skipped}), 500

    # then ingestion
    try:
        stats = ingest_repo(repo_path)   # returns {"files": n, "chunks": n, "skipped": n}
        return jsonify({
            "message":      "Ingestion complete",
            "files_saved":  len(saved),
            "files_skipped": len(skipped),
            "ingestion":    stats,
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Ingestion failed: {str(e)}"}), 500




@app.route("/chat", methods=["POST"])
def chat():
    """
    Streaming chat endpoint using Server-Sent Events (SSE).

    Request JSON:
        { "query": "where is chromadb setup?" }

    Response: text/event-stream
        data: {"token": "Here"}
        data: {"token": " is"}
        ...
        data: {"done": true}
    """
    data = request.json or {}
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Query required"}), 400

    def generate():
        try: 
            for chunk in rag_chain.stream(query):
                payload = json.dumps({'type': 'token', 'value': chunk})
                yield f"data: {payload}\n\n"
        #  json.dumps, its used to convert python objects suchs as dict or list as json formatted string 
        #  The yield keyword turns a function into a function generator.
        #  The function generator returns an iterator.(which can be iterated using loop)          
            # LLM finished generating, then send done =true for you frontend handling using sse
            # yield f"data: {json.dumps({'done': True})}\n\n" XX Bad
            payload = json.dumps({'type': 'done', 'value': True})
            yield f"data: {payload}\n\n" # Better
        #SSE protocol rule: Server-Sent Events require:    
        #data: <message>\n\n
        #That double newline means:
        # “this message is complete, send it to client”    
        except Exception as e:
            traceback.print_exc()
            yield f"data: {json.dumps({'type':'error','value': str(e)})}\n\n"





    

if __name__ == "__main__":
    app.run(debug=True, port=5000)