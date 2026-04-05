# from tree_sitter import Language, Parser, Node
# import tree_sitter_python as tspython
# from pathlib import Path
# PY_LANGUAGE = Language(tspython.language())

# print("python language loaded:", PY_LANGUAGE)
# parser = Parser(PY_LANGUAGE)

# BASE_DIR = Path(__file__).parent
# # file_path = BASE_DIR / "loader.py"
# file_path = "C:/Users/Abhishek Raj/Desktop/CODEBRAIN/app/ingestion/loader.py"

# print("file path:", file_path)
# code = open(file_path, "rb").read()

# # print("code loaded,",code)
# tree = parser.parse(code)


# # def extract_chunks(node: Node, code: bytes):
# #     chunks = []
# #     for child in node.children:
#                         ## eg startPoint: Point(row=0, column=28) 
#                         # the purpose was to slice the code based on the byte offsets of the node, but it seems to be giving an error because the byte offsets are not being calculated correctly.
# #         chunk_text = code[child.start_byte : child.end_byte].decode("utf-8")
# #         chunks.append(
# #             {
# #                 "type": child.type,
# #                 "start_line": child.start_point[0] + 1,
# #                 "end_line": child.end_point[0] + 1,
# #                 "content": chunk_text,
# #             }
# #         )
# #     return chunks


# # chunks = extract_chunks(tree.root_node, code)

# # for i, chunk in enumerate(chunks):
# #     print(f"\n--- Chunk {i+1} ---")
# #     print(f"  Type:  {chunk['type']}")
# #     print(f"  Lines: {chunk['start_line']}-{chunk['end_line']}")
# #     print(f"  Code:\n{chunk['content']}")

# # print(f"  Code:\n{tree.root_node.children[0].text.decode('utf-8')}")
# # print(f"  Code:\n{tree.root_node.children[0].start_line}")


# node0 = tree.root_node.children[0]

# # see everything available on the node
# print(f"node.start_point): {node0.start_point[0]}")
# print(f"node.end_point): {node0.end_point[0]}")

# # start_point and end_point are tuples of (line, column) - both 0-indexed
# # eg : Point(row=0, column=28) & Point(row=2, column=31) for the first line of loader.py
# # so extracting start_line and end_line is just a matter of taking the first element of these tuples and adding 1 to convert to 1-indexed

# print(f"parent node type: {node0.type}")
# print(f"node0 text: {node0.text.decode('utf-8')}")

# print("\n\nNow checking the 2rd node which is the class")

# node1 = tree.root_node.children[1]

# print(f"node1.start_point): {node1.start_point[0]}")
# print(f"node1.end_point): {node1.end_point[0]}")
# print(f"parent node type: {node1.type}")
# print(f"node1 text: {node1.text.decode('utf-8')}")


# print("\n\nNow checking the 4th node which is the class definition - to see how it captures the whole class body including the methods\n")
# node3 = tree.root_node.children[3]

# print(f"node3.start_point): {node3.start_point[0]}")
# print(f"node3.end_point): {node3.end_point[0]}")
# print(f"parent node type: {node3.type}")
# print(f"node3 text: {node3.text}")
# # print(f"children of node3: {node3.children}")

