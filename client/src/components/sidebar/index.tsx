import { StatusBadge } from './statusBadge'
import { UploadZone } from './uploadZone'
import type { sideBarProps } from '../../types'


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

    </aside>
  )
}