import type { FileWithPath } from "../types"

export function formatFileLabel(file: File): string {
  return ((file as FileWithPath).webkitRelativePath as string) || file.name
}

export function computeFilesFingerprint(files: File[]): string {
  const parts = files
    .map((f) => ({
      p: formatFileLabel(f),
      s: f.size,
      m: f.lastModified,
    }))
    .sort((a, b) => a.p.localeCompare(b.p))
    .map((x) => `${x.p}:${x.s}:${x.m}`)
  return parts.join('|')
}

