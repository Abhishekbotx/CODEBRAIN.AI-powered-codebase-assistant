const CodebrainIcon = () => {
  return (
    <svg viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#0a1a0f" />
            <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#0a1a0f" opacity=".6" />
            <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#0a1a0f" opacity=".6" />
            <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#0a1a0f" opacity=".3" />
    </svg>
  )
}

const SendButtonIcon = () => {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M2 8L14 8M14 8L9 3M14 8L9 13"
              stroke="#0a1a0f"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
        </svg>
    )
}

export { CodebrainIcon, SendButtonIcon }