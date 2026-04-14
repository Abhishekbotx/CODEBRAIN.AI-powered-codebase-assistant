import { SUPPORTED_EXTENSIONS } from '../../types/types.ts';
import { type uploadZoneProps } from '../../types';
import { FileList } from './fileList'


export function UploadZone({
  mode,  selectedFiles, phase, progressPct, progressLabel, canIngest,
  filesInputRef, folderInputRef,
  onFilesChange, onFolderChange, onModeSwitch, onIngest,
}: uploadZoneProps) {
  const isWorking = phase === 'uploading' || phase === 'chunking'

  return (
    <div>
      <input
        ref={filesInputRef}
        type="file" 
        multiple
        accept={SUPPORTED_EXTENSIONS.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => onFilesChange(Array.from(e.target.files || []), 'files')}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        accept={SUPPORTED_EXTENSIONS.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => onFolderChange(Array.from(e.target.files || []), 'folder')}
      />


      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        {(['files', 'folder'] as const).map((m) => (
          <button
            key={m}
            type="button"
            className="btn"
            style={{
              marginTop: 0,
              background: mode === m ? 'var(--panel)' : 'transparent',
              border: `1px solid ${mode === m ? 'var(--accent2)' : 'var(--border2)'}`,
              color: 'var(--text2)',
            }}
            onClick={() => {
              onModeSwitch(m)
              if (m === 'files') filesInputRef.current?.click()
              else folderInputRef.current?.click()
            }}
          >
            Upload {m}
          </button>
        ))}
      </div>

      <FileList files={selectedFiles} />

      {progressPct > 0 && (
        <div className="progressWrap" aria-live="polite">
          <div className="progressBarBg">
            <div className="progressBar" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progressLabel">{progressLabel}</div>
        </div>
      )}

      <button className="btn btnPrimary" onClick={onIngest} disabled={!canIngest}>
        {isWorking ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  )
}