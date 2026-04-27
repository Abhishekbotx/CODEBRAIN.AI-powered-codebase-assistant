import { MessageList } from './messageList'
import { EmptyState } from './emptyState'
import { InputBar } from './inputBar'
import type { chatPanelProps } from '../../types'


export function ChatPanel({
  messages, isStreaming, input,
  textareaRef, onInputChange, onAutosize,
  onSend, onClear, onSuggestionClick,
}: chatPanelProps) {
  return (
    <main className="main">
      <div className="topbar">
        <div className="topbarTitle">
          chat with <span>your codebase</span>
        </div>
        <button className="clearBtn" onClick={onClear}>
          clear chat
        </button>
      </div>

      {messages.length ? (
        <MessageList messages={messages} isStreaming={isStreaming} />
      ) : (
        <EmptyState onSuggestionClick={onSuggestionClick} />
      )}

      <InputBar
        value={input}
        isStreaming={isStreaming}
        textareaRef={textareaRef}
        onChange={onInputChange}
        onAutosize={onAutosize}
        onSend={onSend}
      />
    </main>
  )
}