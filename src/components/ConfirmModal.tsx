export function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  busy?: boolean
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 className="mb-3 text-xl font-bold text-primary-300">{title}</h2>
        <p className="mb-6 text-slate-300">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            className="btn-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelText}
          </button>
          <button
            className="btn-primary"
            onClick={onConfirm}
            disabled={busy}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
