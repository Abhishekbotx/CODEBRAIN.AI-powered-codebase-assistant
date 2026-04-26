import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api' 

type StatusState = {
  phase: 'checking' | 'ok' | 'error' | 'offline'
  chunksIndexed: number | null
  text: string
}

const initialStatusState: StatusState = {
  phase: 'checking',
  chunksIndexed: null,
  text: 'Checking...',
}

export function useStatus() {
    const [status, setStatus] = useState<StatusState>(initialStatusState)
    const updateStatus = useCallback(async () => {
      try {
        const res = await api.status()
        setStatus({ phase: 'ok', chunksIndexed: res.chunks_indexed, text: 'Index ready' })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Server offline'
        if (msg.toLowerCase().includes('failed to fetch')) {
          setStatus({ phase: 'offline', chunksIndexed: null, text: 'Server offline' })
        } else {
          setStatus({ phase: 'error', chunksIndexed: null, text: 'Index error' })
        }
      }
    }, [])


    useEffect(() => {
    async function fetchOnMount() {
        await updateStatus()   // ← async, setState only fires after API responds
    }

    void fetchOnMount()
    const id = window.setInterval(() => void updateStatus(), 15000)
    return () => window.clearInterval(id)
    }, [updateStatus])

  return { status, updateStatus }
}