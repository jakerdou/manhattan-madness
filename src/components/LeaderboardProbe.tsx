import { useEffect, useState } from 'react'
import { observeLeaderboard } from '../services/firestore'
import { ImageModal } from './ImageModal'

export function LeaderboardProbe() {
  const [rows, setRows] = useState<Array<{ id: string; name: string; totalPoints: number; lastClaimedLocation: string | null; lastClaimedPhotoUrl?: string | null }>>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null)

  useEffect(() => {
    try {
      const unsub = observeLeaderboard((data) => setRows(data))
      return () => unsub()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to observe leaderboard')
    }
  }, [])

  if (error) {
    return <div className="text-red-400">Error: {error}</div>
  }

  if (!rows.length) {
    return <div className="text-slate-400 text-sm">No teams yet. Create one to see data here.</div>
  }

  return (
    <div className="space-y-3">
      {rows.slice(0, 10).map((r, index) => (
        <div key={r.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-primary-300">#{index + 1}</span>
                <h3 className="text-lg font-semibold text-slate-100 truncate">{r.name}</h3>
              </div>
              <div className="text-sm text-slate-400 mb-2">
                <span className="font-medium text-secondary-400">{r.totalPoints}</span> points
              </div>
              {r.lastClaimedLocation && (
                <div className="text-sm text-slate-300">
                  Last claimed: <span className="font-medium">{r.lastClaimedLocation}</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <div 
                className={`w-20 h-20 rounded-md border border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden ${r.lastClaimedPhotoUrl ? 'cursor-pointer hover:border-primary-500 transition-colors' : ''}`}
                onClick={() => r.lastClaimedPhotoUrl && setSelectedImage({ url: r.lastClaimedPhotoUrl, alt: `${r.name} - ${r.lastClaimedLocation}` })}
              >
                {r.lastClaimedPhotoUrl ? (
                  <img 
                    src={r.lastClaimedPhotoUrl} 
                    alt={`${r.name} - ${r.lastClaimedLocation}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xs text-slate-500 text-center px-1">
                    No photo
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <ImageModal
        open={!!selectedImage}
        imageUrl={selectedImage?.url || ''}
        alt={selectedImage?.alt || ''}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  )
}
