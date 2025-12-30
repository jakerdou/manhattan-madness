export default function MapPage() {
  return (
    <section className="flex flex-col p-4 pb-0" style={{ height: 'calc(100dvh - 5rem)' }}>
      <h1 className="text-2xl font-bold text-primary-300 mb-4">Map</h1>
      <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-slate-800">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1BLpWoHyzKBEGnWSPokY9NDchpkEdb68&ehbc=2E312F"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}
