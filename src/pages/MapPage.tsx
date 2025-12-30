import { useEffect } from 'react'

export default function MapPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <section className="relative p-2 pb-0 overflow-hidden" style={{ height: 'calc(100dvh - 5rem)' }}>
      <div className="h-full overflow-hidden rounded-lg">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1BLpWoHyzKBEGnWSPokY9NDchpkEdb68&ehbc=2E312F"
          width="100%"
          height="100%"
          style={{ border: 0, marginTop: '-65px', height: 'calc(100% + 65px)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur rounded-lg px-3 py-2 text-xs space-y-1 border border-slate-700">
        <div className="font-semibold text-slate-200 mb-1">Points</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-marker-green" />
          <span className="text-slate-300">Green (lowest)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-marker-blue" />
          <span className="text-slate-300">Blue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-marker-red" />
          <span className="text-slate-300">Red</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-marker-purple" />
          <span className="text-slate-300">Purple</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-marker-gold" />
          <span className="text-slate-300">Gold (highest)</span>
        </div>
      </div>
    </section>
  )
}
