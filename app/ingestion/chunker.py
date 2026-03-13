from pathlib import Path
from app.utils.helpers import count_tokens


def chunk_nodes(node,code:bytes,max_token,filepath:str):
    chunks=[]
    current_tokens=0
    current_chunks=[]
    
    
    for child in node.children:
        node_text=code[child.start_byte:child.end_byte].decode("utf-8")
        
        node_token=count_tokens(node_text)
        
        #case 1: if nodesize is greater than max_tokens
        if(node_token>max_token):
            if current_chunks:
                chunks.append(build_chunks(current_chunks,code,filepath))
                current_chunks=[]
                current_tokens=0
            
            
            #recurse down in the same loop
            chunks.extend(chunk_nodes(child,code,max_token,filepath))
            continue;
        
        
        #case 2: if 2 out of 4 tokens was in token limit
        
        if(node_token+current_tokens>max_token):
                
            if current_chunks:
                chunks.append(build_chunks(current_chunks,code,filepath))
                current_chunks=[]
                current_tokens=0;
            
            current_chunks=[child]
            current_tokens+=node_token
            
        else:
            # here in this case if loop ended there are still some tokens in current_chunks which 
            # are not added to chunks because the token limit was not breached, so we add them to chunks here
            # it should hold nodes not dict
            current_chunks.append(child)
            current_tokens+=node_token
    
    #flush the remaining chunks which were in the current_chunks but not added to chunks because the token limit was not breached
    if current_chunks:
        chunks.append(build_chunks(current_chunks,code,filepath))
    
    return chunks                       
    
    
    
#same thing is map function in javascript 
# const content = nodes
#   .map(n => code.slice(n.start_byte, n.end_byte).toString("utf-8")).join("\n");   
 
#Simpler version  in pythons  
# texts = []
# for n in nodes:
#     text = code[n.start_byte:n.end_byte].decode("utf-8")
#     texts.append(text)   
 
# items = ["A", "B", "C"]
# result = "-".join(items)
# print(result)
# Output:

# A-B-C   
 
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
    
    
