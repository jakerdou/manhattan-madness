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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    onChange(f)
  }

  return (
    <div className="space-y-3">
      {(localUrl || previewUrl) && (
        <img src={localUrl || previewUrl || ''} alt="Preview" className="h-40 w-full rounded-md object-cover" />
      )}
      <div>
        <label className="btn-primary inline-block cursor-pointer">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? 'Change Photo' : 'Upload Photo'}
        </label>
        {file && (
          <div className="mt-2 text-sm text-slate-400">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
    </div>
  )
}
