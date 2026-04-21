import type { messageListProps } from '../../types'


export function MessageList({ messages, isStreaming }: messageListProps) {
  return (
    <div className="messages">
      {messages.map((m, idx) => {
        const isUser = m.role === 'user'
        const showCursor = !isUser && isStreaming && idx === messages.length - 1
        return (
          <div key={m.id} className="msg">
            <div className={`msgAvatar ${isUser ? 'msgAvatarUser' : 'msgAvatarBot'}`}>
              {isUser ? 'You' : 'AI'}
            </div>
            <div className="msgBody">
              <div className="msgRole">{isUser ? 'You' : 'AI'}</div>
              <div className={`msgText ${isUser ? 'msgTextUser' : ''}`}>
                {m.text ? m.text : showCursor ? '' : '(no response)'}
                {showCursor && <span className="cursor" />}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}