import { useEffect } from 'react'

/**
 * Original Google My Maps embed implementation.
 * Uses iframe to embed the pre-configured My Maps.
 * 
 * Note: Requires two-finger gesture on mobile for panning/zooming
 * due to Google's scroll hijacking prevention.
 */
export default function EmbedMap() {
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
          style={{ border: 0, marginTop: '-65px', height: 'calc(100% + 65px)', position: 'relative', zIndex: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Open in Google Maps link */}
      <a
        href="https://www.google.com/maps/d/viewer?mid=1BLpWoHyzKBEGnWSPokY9NDchpkEdb68"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2 text-sm z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Open in Maps
      </a>
      
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
