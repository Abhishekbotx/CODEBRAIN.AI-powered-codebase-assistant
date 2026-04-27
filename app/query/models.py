from dataclasses import dataclass, field

@dataclass
class SearchResult:
    id: str
    content: str
    score: float
    metadata: dict = field(default_factory=dict)

    def __repr__(self):
        return (
            f"SearchResult(\n"
            f"  file   = {self.metadata.get('file', '?')}\n"
            f"  lines  = {self.metadata.get('start_line')}–{self.metadata.get('end_line')}\n"
            f"  type   = {self.metadata.get('type', '?')}\n"
            f"  tokens = {self.metadata.get('tokens', '?')}\n"
            f"  score  = {self.score:.4f}\n"
            f")"
        )