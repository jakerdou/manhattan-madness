import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100"
      style={{ minHeight: '100dvh', width: '100%' }}
    >
      <main
        // className="mx-auto max-w-xl p-4 pb-16"
        // style={{ width: '100dvw', boxSizing: 'border-box' }}
      >
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
