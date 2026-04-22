
import { DEFAULT_SUGGESTIONS } from '../../types/types.ts'
import type { emptyStateProps} from '../../types'


export function EmptyState({ onSuggestionClick }: emptyStateProps) {
  return (
    <div className="emptyState">
      <div className="emptyBig">Ask your codebase anything</div>
      <div className="emptySub">
        Upload your files on the left, then ask questions in natural language.
      </div>
      <div className="suggestions">
        {DEFAULT_SUGGESTIONS.map((s) => (
          <div key={s} className="suggestion" onClick={() => onSuggestionClick(s)}>
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}