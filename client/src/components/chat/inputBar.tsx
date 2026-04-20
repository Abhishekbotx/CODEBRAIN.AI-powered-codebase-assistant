import { SendButtonIcon } from "../../assets/icons"
import type { inputBarProps } from "../../types"


export function InputBar({ value, isStreaming, textareaRef, onChange, onAutosize, onSend }: inputBarProps) {
  return (
    <div className="inputBar">
      <div className="inputWrap">
        <textarea
          ref={textareaRef}
          className="queryInput"
          rows={1}
          placeholder="Ask anything about your codebase..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onInput={onAutosize}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
        />
        <button className="sendBtn" onClick={onSend} disabled={isStreaming}>
          <SendButtonIcon/>
        </button>
      </div>
      <div className="inputHint">Enter to send · Shift+Enter for newline</div>
    </div>
  )
}