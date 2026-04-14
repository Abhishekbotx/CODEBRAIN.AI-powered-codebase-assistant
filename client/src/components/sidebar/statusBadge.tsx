import type { statusBadgeProps } from "../../types"

export function StatusBadge({ phase, text, chunksIndexed }: statusBadgeProps) {
  const dotClass =
    phase === 'checking'
      ? 'statusDot statusDotLoading'
      : phase === 'ok'
        ? 'statusDot statusDotOk'
        : 'statusDot statusDotError'

  return (
    <div className="statusBadge" role="status" aria-live="polite">
      <div className={dotClass} />
      <div className="statusText">{text}</div>
      {chunksIndexed != null && (
        <div className="statusCount">{chunksIndexed} chunks</div>
      )}
    </div>
  )
}