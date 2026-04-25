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
      
    }
  },
}

