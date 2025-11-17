import { useState, useMemo, useEffect, useRef } from 'react'

type Location = { id: number; name: string; points: number; tier?: string }

interface Props {
  open: boolean
  locations: Location[]
  claimedIds: number[]
  onClaim: (locationId: number) => void
  onClose: () => void
  busy?: boolean
}

export function ClaimLocationModal({ open, locations, claimedIds, onClaim, onClose, busy = false }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const availableLocations = useMemo(() => {
    return locations.filter(l => !claimedIds.includes(l.id))
  }, [locations, claimedIds])

  const filteredLocations = useMemo(() => {
    let filtered = availableLocations
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = availableLocations.filter(l => 
        l.name.toLowerCase().includes(term) ||
        l.tier?.toLowerCase().includes(term)
      )
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [availableLocations, searchTerm])

  const selectedLocation = selectedLocationId 
    ? locations.find(l => l.id === selectedLocationId) 
    : null

  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
  }, [open])

  function handleClaim() {
    if (selectedLocationId) {
      onClaim(selectedLocationId)
      setSearchTerm('')
      setSelectedLocationId(null)
    }
  }

  function handleClose() {
    setSearchTerm('')
    setSelectedLocationId(null)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-primary-300">Claim Location</h2>
        
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Search for a location
          </label>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            disabled={busy}
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Select location ({availableLocations.length} available)
          </label>
          <div className="max-h-64 overflow-y-auto rounded-md border border-slate-700 bg-slate-800">
            {filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">
                {availableLocations.length === 0 
                  ? 'All locations have been claimed' 
                  : 'No locations match your search'}
              </div>
            ) : (
              <ul className="divide-y divide-slate-700">
                {filteredLocations.map((location) => (
                  <li
                    key={location.id}
                    className={`cursor-pointer p-3 transition-colors hover:bg-slate-700 ${
                      selectedLocationId === location.id ? 'bg-slate-700' : ''
                    }`}
                    onClick={() => setSelectedLocationId(location.id)}
                  >
                    <div className="font-medium text-slate-200">{location.name}</div>
                    <div className="text-xs text-slate-400">
                      {location.points} pts{location.tier ? ` · ${location.tier}` : ''}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selectedLocation && (
          <div className="mb-4 rounded-md border border-primary-800 bg-primary-950/40 p-3">
            <div className="text-sm font-medium text-primary-300">Selected:</div>
            <div className="text-slate-200">{selectedLocation.name}</div>
            <div className="text-xs text-slate-400">
              {selectedLocation.points} points{selectedLocation.tier ? ` · ${selectedLocation.tier}` : ''}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            className="btn-secondary"
            onClick={handleClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleClaim}
            disabled={!selectedLocationId || busy}
          >
            Begin Claim
          </button>
        </div>
      </div>
    </div>
  )
}
