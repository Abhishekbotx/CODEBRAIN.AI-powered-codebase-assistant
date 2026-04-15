import { formatFileLabel } from '../../lib/files'
import type { fileListProps } from '../../types'

export function FileList({ files }: fileListProps) {
  if (!files.length) return null

  return (
    <div className="fileList">
      {files.slice(0, 20).map((f) => {
        const label = formatFileLabel(f)
        const ext = f.name.includes('.') ? `.${f.name.split('.').pop()}` : ''
        return (
          <div key={label} className="fileItem">
            <div className="fileDot" />
            <div className="fileName" title={label}>{label}</div>
            <div className="fileExt">{ext}</div>
          </div>
        )
      })}
      {files.length > 20 && (
        <div className="fileItem">
          <div className="fileDot" style={{ background: 'var(--muted)' }} />
          <div className="fileName">+{files.length - 20} more files</div>
        </div>
      )}
    </div>
  )
}