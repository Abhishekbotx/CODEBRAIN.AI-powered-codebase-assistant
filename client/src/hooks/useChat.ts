import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { useToast } from '../components/toast/useToast'
import type { UploadPhase,ChatMessage } from '../types'

type ChatState = {
  input: string
  messages: ChatMessage[]
  isStreaming: boolean
}

const initialChatState: ChatState = {
  input: '',
  messages: [],
  isStreaming: false,
}

export function useChat(uploadPhase: UploadPhase) {
  const { pushToast } = useToast()
  const [chat, setChat] = useState<ChatState>(initialChatState)
  const queryTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const autosizeTextarea = useCallback(() => {
    const el = queryTextareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [])

  useEffect(() => {
    autosizeTextarea()
  }, [chat.input, autosizeTextarea])

  const clearChat = useCallback(() => {
    setChat((prev) => ({ ...prev, messages: [] }))
  }, [])

  const fillQuery = useCallback((text: string) => {
    setChat((prev) => ({ ...prev, input: text }))
    window.setTimeout(() => {
      queryTextareaRef.current?.focus()
      queryTextareaRef.current?.dispatchEvent(new Event('input', { bubbles: true }))
    }, 0)
  }, [])

  const sendMessage = useCallback(async () => {
    if (chat.isStreaming) return
    const query = chat.input.trim()
    if (!query) return

    if (uploadPhase === 'uploading' || uploadPhase === 'chunking') {
      pushToast({
        kind: 'warning',
        title: 'Indexing in progress',
        message: 'Results may reflect older chunks until indexing finishes.',
      })
    }

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: query }
    const botMsg: ChatMessage  = { id: crypto.randomUUID(), role: 'bot',  text: '' }
    const botIndex = chat.messages.length + 1

    setChat((prevChat) => ({
      ...prevChat,
      input: '',
      isStreaming: true,
      messages: [...prevChat.messages, userMsg, botMsg],
    }))

    try {
      let accumulated = ''
      for await (const chunk of api.chatStream({ query })) {
        if (chunk?.type === 'done') break
        if (chunk?.type === 'error') {
          accumulated += `\n[error: ${chunk.value}]`
          break
        }
        if (chunk?.type === 'token') {
          console.log("chunk::",chunk.value)
          accumulated += chunk.value
          setChat((prevChat) => {

            const updatedMessage=prevChat.messages.map((msg,index)=>
              index===botIndex?{...msg,text:accumulated}:msg
            )

            return { ...prevChat, messages: updatedMessage }
          })
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Connection error'
      setChat((prev) => {
        const next = [...prev.messages]
        const bot = next[botIndex]
        if (!bot) return prev
        next[botIndex] = { ...bot, text: `Connection error: ${msg}` }
        return { ...prev, messages: next }
      })
    } finally {
      setChat((prev) => ({ ...prev, isStreaming: false }))
    }
  }, [chat.input, chat.isStreaming, chat.messages, pushToast, uploadPhase])

  return {
    chat,
    setChat,
    queryTextareaRef,
    autosizeTextarea,
    clearChat,
    fillQuery,
    sendMessage,
  }
}