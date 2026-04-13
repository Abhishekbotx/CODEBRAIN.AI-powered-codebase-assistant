import type { FileWithPath } from "../types"

export function formatFileLabel(file: File): string {
  return ((file as FileWithPath).webkitRelativePath as string) || file.name
}

