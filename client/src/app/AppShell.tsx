import { useStatus } from '../hooks/useStatus'
import { useUpload } from '../hooks/useUpload'
import { Sidebar } from '../components/sidebar' 


export function AppShell() {
  const { status, updateStatus } = useStatus()

  const {
    upload, setUpload, canIngest,
    filesInputRef, folderInputRef,
    handleFiles, onDrop, onIngest,
  } = useUpload(updateStatus)



  return (
    <div className="app">
      <Sidebar
        statusPhase={status.phase}
        statusText={status.text}
        chunksIndexed={status.chunksIndexed}
        mode={upload.mode}
        dragOver={upload.dragOver}
        selectedFiles={upload.selectedFiles}
        uploadPhase={upload.phase}
        progressPct={upload.progressPct}
        progressLabel={upload.progressLabel}
        canIngest={canIngest} //@ts-expect-error
        filesInputRef={filesInputRef} //@ts-expect-error
        folderInputRef={folderInputRef}
        onDrop={onDrop}
        onDragOver={() => setUpload((p) => ({ ...p, dragOver: true }))}
        onDragLeave={() => setUpload((p) => ({ ...p, dragOver: false }))}
        onFilesChange={(files) => handleFiles(files, 'files')}
        onFolderChange={(files) => handleFiles(files, 'folder')}
        onModeSwitch={(mode) => setUpload((p) => ({ ...p, mode }))}
        onIngest={onIngest}
      />


    </div>
  )
}