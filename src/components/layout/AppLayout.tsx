import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div
      className="flex flex-col min-h-screen bg-slate-950 text-slate-100"
      style={{ minHeight: '100dvh', width: '100%' }}
    >
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
