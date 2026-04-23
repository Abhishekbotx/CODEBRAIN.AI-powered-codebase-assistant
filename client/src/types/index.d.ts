import type { RefObject } from 'react'

export type FileWithPath = File & { webkitRelativePath?: string }

export type fileListProps = {
  files: File[]
}

type StatusPhase = 'checking' | 'ok' | 'error' | 'offline'

export type statusBadgeProps = {
  phase: StatusPhase
  text: string
  chunksIndexed: number | null
}

type UploadPhase = 'idle' | 'uploading' | 'chunking' | 'done' | 'error'

export type uploadZoneProps = {
  mode: 'files' | 'folder'
  dragOver: boolean
  selectedFiles: File[]
  phase: UploadPhase
  progressPct: number
  progressLabel: string
  canIngest: boolean
  filesInputRef: RefObject<HTMLInputElement>
  folderInputRef: RefObject<HTMLInputElement>
  onDrop: (e: React.DragEvent) => void
  onDragOver: () => void
  onDragLeave: () => void
  onFilesChange: (files: File[], mode: 'files') => void
  onFolderChange: (files: File[], mode: 'folder') => void
  onModeSwitch: (mode: 'files' | 'folder') => void
  onIngest: () => void
}


export type sideBarProps = {
  statusPhase: StatusPhase
  statusText: string
  chunksIndexed: number | null
  mode: 'files' | 'folder'
  dragOver: boolean
  selectedFiles: File[]
  uploadPhase: UploadPhase
  progressPct: number
  progressLabel: string
  canIngest: boolean
  filesInputRef: RefObject<HTMLInputElement> | null,
  folderInputRef: RefObject<HTMLInputElement> | null,
  onDrop: (e: React.DragEvent) => void
  onDragOver: () => void
  onDragLeave: () => void
  onFilesChange: (files: File[], mode: 'files') => void
  onFolderChange: (files: File[], mode: 'folder') => void
  onModeSwitch: (mode: 'files' | 'folder') => void
  onIngest: () => void
}

export type ToastKind = 'success' | 'info' | 'warning' | 'error'

export type ToastInput = {
  kind: ToastKind
  title: string
  message?: string
  ttlMs?: number
}

export type ToastItem = ToastInput & {
  id: string
  createdAt: number
}

export type ToastContextValue = {
  pushToast: (toast: ToastInput) => void
}

export type inputBarProps = {
  value: string
  isStreaming: boolean
  textareaRef: RefObject<HTMLTextAreaElement>
  onChange: (value: string) => void
  onAutosize: () => void
  onSend: () => void
}


export type messageListProps = {
  messages: ChatMessage[]
  isStreaming: boolean
}

export type emptyStateProps = {
  onSuggestionClick: (text: string) => void
}


export type chatPanelProps = {
  messages: ChatMessage[]
  isStreaming: boolean
  input: string
  textareaRef: RefObject<HTMLTextAreaElement>
  onInputChange: (value: string) => void
  onAutosize: () => void
  onSend: () => void
  onClear: () => void
  onSuggestionClick: (text: string) => void
}


export type uploadStateProps = {
  mode: 'files' | 'folder'
  selectedFiles: File[]
  dragOver: boolean
  phase: UploadPhase
  progressPct: number
  progressLabel: string
  lastCompletedFingerprint: string | null
  lastKnownChunksIndexed: number | null
}
