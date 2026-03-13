from pathlib import Path
from app.utils.helpers import count_tokens

def build_chunks(nodes,code:bytes,filepath:str):
    content="\n".join([code[n.start_byte:n.end_byte].decode("utf-8") for n in nodes])
    return {
        "content": content,
        "type": ", ".join([n.type for n in nodes]),
        "start_line": nodes[0].start_point[0]+1,
        "end_line": nodes[-1].end_point[0]+1,
        "file_path": str(filepath),
        "parent_context": nodes[0].parent.type if nodes[0].parent else "module level",
        "tokens": count_tokens(content),
        "node_count": len(nodes)
}
    
    
