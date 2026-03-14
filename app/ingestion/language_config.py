import tree_sitter_python as tspython
import tree_sitter_javascript as tsjs
import tree_sitter_typescript as tsts
import tree_sitter_java as tsjava
import tree_sitter_go as tsgo
import tree_sitter_rust as tsrust
import tree_sitter_c as tsc
import tree_sitter_cpp as tscpp
import tree_sitter_json as tsjson
import tree_sitter_bash as tsbash



# Map extension → language
LANGUAGE_MAP = {
    ".py": Language(tspython.language()),
    ".js": Language(tsjs.language()),
    ".ts": Language(tsts.language_typescript()),
    ".tsx": Language(tsts.language_tsx()),
    ".java": Language(tsjava.language()),
    ".go": Language(tsgo.language()),
    ".rs": Language(tsrust.language()),
    ".c": Language(tsc.language()),
    ".cpp": Language(tscpp.language()),
    ".json": Language(tsjson.language()),
    ".sh": Language(tsbash.language()),
}

