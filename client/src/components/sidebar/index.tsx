import { StatusBadge } from './statusBadge'
import { UploadZone } from './uploadZone'
import type { sideBarProps } from '../../types'
import { CodebrainIcon } from '../../assets/icons'
import { MODEL } from '../../config/envConfig'

export const Sidebar = ({
  statusPhase, statusText, chunksIndexed,
  mode, dragOver, selectedFiles, uploadPhase,
  progressPct, progressLabel, canIngest,
  filesInputRef, folderInputRef,
  onDrop, onDragOver, onDragLeave,
  onFilesChange, onFolderChange, onModeSwitch, onIngest,
}: sideBarProps) => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logoMark" aria-hidden>
          <CodebrainIcon />
        </div>
        <div>
          <div className="logoText">CodeBrain</div>
          <div className="logoSub">codebase Q&amp;A</div>
        </div>
      </div>

      <div className="divider" />

      <div>
        <div className="sectionLabel">index status</div>
        <StatusBadge phase={statusPhase} text={statusText} chunksIndexed={chunksIndexed} />
      </div>

      <div className="divider" />

      <div>
        <div className="sectionLabel">upload codebase</div>
        <UploadZone
          mode={mode}
          dragOver={dragOver}
          selectedFiles={selectedFiles}
          phase={uploadPhase}
          progressPct={progressPct}
          progressLabel={progressLabel}
          canIngest={canIngest} //@ts-ignore
          filesInputRef={filesInputRef} //@ts-ignore
          folderInputRef={folderInputRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onFilesChange={onFilesChange}
          onFolderChange={onFolderChange}
          onModeSwitch={onModeSwitch}
          onIngest={onIngest}
        />
      </div>

      <div className="divider" />

      <div className="infoBlock">
        <div>hybrid search</div>
        <div className="value">dense + SPLADE sparse</div>
        <div style={{ marginTop: 8 }}>model</div>
        <div className="value">{MODEL}</div>
      </div>
    </aside>
  )
}