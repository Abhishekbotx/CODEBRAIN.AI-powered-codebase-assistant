import { API_URL } from "../config/envConfig"
import type { ChatStreamEvent, StatusResponse,  UploadResponse } from "../types"

const API_BASE = API_URL

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

export const api = {
  async status() {
    const res = await fetch(`${API_BASE}/status`)
    const data = await parseJsonSafe<StatusResponse>(res)
    if (!res.ok || !data || (data as { status?: string }).status !== 'ok') {
      const detail = (data as { detail?: string })?.detail || `HTTP ${res.status}`
      throw new Error(detail)
    }
    return data as Extract<StatusResponse, { status: 'ok' }>
  },

  async upload(formData: FormData) {
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData })
    const data = (await parseJsonSafe<UploadResponse>(res)) || {}
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return data
  },

  async *chatStream(body: { query: string }): AsyncGenerator<ChatStreamEvent, void, void> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    console.log("res::",res)

    if (!res.ok || !res.body) {
      const err = await parseJsonSafe<{ error?: string }>(res)
      throw new Error(err?.error || `HTTP ${res.status}`)
    }

    //what is getReader? 
    // it gives you a low level stream reader, to read chunk by chunk rather than waiting
    //  for the whole response.
    //Backend → sends chunks
    //Reader → receives chunks

    const reader = res.body.getReader() //This is the heart of streaming
    console.log("reader::",reader)
    const decoder = new TextDecoder() //Converts binary → string 👉encoding to utf-8
    let buffer = ''

    //Keep reading until stream ends
    while (true) {
      const { done, value } = await reader.read() //done are value are internal output of reader
      // keep in mind in apis either you get token or in the last done (ref , file;server.py ln:113)
      console.log("done, value::",done, decoder.decode(value))
      if (done) break

      buffer += decoder.decode(value, { stream: true })// why ?{ stream: true } 👉 prevents breaking UTF-8 characters across chunks , means it can handle broken words aswell
      const parts = buffer.split('\n') //Because SSE sends: data: {...}\n\n
      // WHY split('\n')?
      // One reader.read() call can return MULTIPLE SSE messages jammed together:
      // "data: {"type":"token","value":"hello"}\n\ndata: {"type":"token","value":"world"}\n\n"
      //
      // If you JSON.parse the whole buffer directly → 💥 SyntaxError (multiple JSON objects)
      // Split by '\n' → separates each message → parse one at a time ✅

      // ✨The key insight is — JSON.parse doesn't fail because of \n, 
      // it fails because you'd be trying to parse two JSON objects at once which is invalid JSON

      // In our case Flask flushes one message per chunk so split is not strictly
      // needed locally, but in production behind nginx/proxies chunks can merge —
      // split + pop protects against that.
      console.log("parts::",parts)
      buffer = parts.pop() || '' //Last line might be incomplete → keep it in buffer for next round
      /* ✨here its not important to have parts.pop coz chunks are comming in right manner   Your local dev works perfectly because there's no proxy
       in between.But The moment you deploy behind nginx or any reverse proxy, chunks can merge and the 
       split+pop saves you from mysterious production bugs. */
      for (const line of parts) { // Process complete lines
        if (!line.startsWith('data: ')) continue // SSE format: lines start with "data: "
        console.log("line:",line)
        const raw = line.slice(6) //removes "data: " prefix
        console.log("raw::",raw)

        try {
          const payload = JSON.parse(raw) as ChatStreamEvent
          console.log("payload:",payload)
          yield payload
        } catch (error){
          console.error("Error parsing SSE message:", error)
        }
      }
    }
  },
}

