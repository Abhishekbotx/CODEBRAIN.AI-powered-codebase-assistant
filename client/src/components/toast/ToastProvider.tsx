import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toastContext'
import type { ToastInput, ToastItem } from '../../types'
import '../../index.css'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const pushToast = useCallback((toast: ToastInput) => {
    const item: ToastItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ttlMs: toast.ttlMs ?? 3500,
      ...toast,
    }
    setToasts((prev) => [item, ...prev].slice(0, 5))
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== item.id))
    }, item.ttlMs)
  }, [])

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite" aria-relevant="additions removals">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`}>
            <div className="toastTitle">{t.title}</div>
            {t.message ? <div className="toastMsg">{t.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}