interface Props {
  open: boolean
  imageUrl: string
  alt: string
  onClose: () => void
}

export function ImageModal({ open, imageUrl, alt, onClose }: Props) {
  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div className="relative max-h-screen max-w-screen">
        <img 
          src={imageUrl} 
          alt={alt}
          className="max-h-screen max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          className="absolute top-2 right-2 rounded-full bg-slate-900/80 p-2 text-slate-200 hover:bg-slate-800"
          onClick={onClose}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
