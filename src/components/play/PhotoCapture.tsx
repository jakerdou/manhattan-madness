import { useEffect, useMemo, useState } from 'react'

interface Props {
  onChange: (file: File | null) => void
  previewUrl?: string | null
  accept?: string
}

export function PhotoCapture({ onChange, previewUrl, accept = 'image/*' }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const localUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => () => {
    if (localUrl) URL.revokeObjectURL(localUrl)
  }, [localUrl])

  return (
    <div className="space-y-2">
      {(localUrl || previewUrl) && (
        <img src={localUrl || previewUrl || ''} alt="Preview" className="h-40 w-full rounded-md object-cover" />
      )}
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null
          setFile(f)
          onChange(f)
        }}
      />
    </div>
  )
}
