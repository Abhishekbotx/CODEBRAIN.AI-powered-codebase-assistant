import { API_URL } from "../config/envConfig"
import type {  StatusResponse,  UploadResponse } from "../types"

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

  
}

