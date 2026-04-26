import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { computeFilesFingerprint } from '../lib/files'
import { useToast } from '../components/toast/useToast'
import type { FileWithPath, uploadStateProps } from '../types'
import { SUPPORTED_EXTENSIONS } from '../types/types.ts'


const initialUploadState: uploadStateProps = {
  mode: 'folder',
  selectedFiles: [],
  dragOver: false,
  phase: 'idle',
  progressPct: 0,
  progressLabel: '',
  lastCompletedFingerprint: null,
  lastKnownChunksIndexed: null,
}

export function useUpload(updateStatus: () => Promise<void>) {
  const { pushToast } = useToast()

  const [upload, setUpload] = useState<uploadStateProps>(initialUploadState)

  const filesInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)

  const canIngest =
    upload.selectedFiles.length > 0 &&
    upload.phase !== 'uploading' &&
    upload.phase !== 'chunking'

  
  useEffect(() => {
    const el = folderInputRef.current
    if (!el) return
    el.setAttribute('webkitdirectory', '')
    el.setAttribute('directory', '')
  }, [])

  const detectModeFromFiles = useCallback((files: FileWithPath[]): uploadStateProps['mode'] => {
    for (const f of files) {
      const rel = f.webkitRelativePath || ''
      if (rel.includes('/')) return 'folder'
    }
    return 'files'
  }, [])

  const handleFiles = useCallback(
    (files: FileWithPath[], mode?: uploadStateProps['mode']) => {
      const supported = files.filter((f) =>
        SUPPORTED_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext)),
      )
      const nextMode = mode || detectModeFromFiles(files)
      setUpload((prev) => ({ ...prev, mode: nextMode, selectedFiles: supported }))

      if (!supported.length) {
        pushToast({
          kind: 'warning',
          title: 'No supported files found',
          message: `Supported: ${SUPPORTED_EXTENSIONS.join(' ')}`,
        })
      }
    },
    [detectModeFromFiles, pushToast],
  )

  const onDrop = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault()
      setUpload((prev) => ({ ...prev, dragOver: false }))
      handleFiles(Array.from(ev.dataTransfer.files || []) as FileWithPath[])
    },
    [handleFiles],
  )

  const onIngest = useCallback(async () => {
    if (!upload.selectedFiles.length) return

    const fingerprint = computeFilesFingerprint(upload.selectedFiles)
    const isSame = upload.lastCompletedFingerprint === fingerprint

    if (isSame) {
      pushToast({
        kind: 'info',
        title: 'Same repo selection as last time',
        message: 'If you changed files, re-select the folder so the browser sees updates.',
      })
    } else {
      pushToast({
        kind: 'success',
        title: 'Files selected',
        message: `Uploading ${upload.selectedFiles.length} file(s)…`,
      })
    }

    setUpload((prev) => ({
      ...prev,
      phase: 'uploading',
      progressPct: 10,
      progressLabel: `Uploading ${upload.selectedFiles.length} files...`,
    }))

    const fd = new FormData()
    for (const f of upload.selectedFiles) {
      const fileWithPath = f as FileWithPath
      const name = fileWithPath.webkitRelativePath || f.name
      fd.append('files', f, name)
    }

    try {
      setUpload((prev) => ({ ...prev, progressPct: 40 }))
      const res = await api.upload(fd)

      pushToast({ kind: 'success', title: 'Uploaded', message: 'Creating chunks…' })

      setUpload((prev) => ({
        ...prev,
        phase: 'chunking',
        progressPct: 80,
        progressLabel: `Indexing… ${res.ingestion?.chunks ?? '?'} chunks`,
      }))

      await updateStatus()

      setUpload((prev) => ({
        ...prev,
        phase: 'done',
        progressPct: 100,
        progressLabel: `Done — ${res.ingestion?.chunks ?? '?'} chunks indexed`,
        lastCompletedFingerprint: fingerprint,
        selectedFiles: [],
      }))

      if (!isSame) {
        pushToast({ kind: 'success', title: 'Hurray!', message: 'Now ask questions from your repo.' })
      }

      if (filesInputRef.current) filesInputRef.current.value = ''
      if (folderInputRef.current) folderInputRef.current.value = ''
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed'
      setUpload((prev) => ({ ...prev, phase: 'error', progressLabel: `Error: ${msg}` }))
      pushToast({ kind: 'error', title: 'Ingestion failed', message: msg })
    } finally {
      window.setTimeout(() => {
        setUpload((prev) => ({
          ...prev,
          phase: prev.phase === 'error' ? 'error' : 'idle',
          progressPct: 0,
          progressLabel: '',
        }))
      }, 2500)
    }
  }, [pushToast, updateStatus, upload.lastCompletedFingerprint, upload.selectedFiles])

  return {
    upload,
    setUpload,
    canIngest,
    filesInputRef,
    folderInputRef,
    handleFiles,
    onDrop,
    onIngest,
  }
}