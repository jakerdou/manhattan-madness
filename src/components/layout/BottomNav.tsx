import { NavLink } from 'react-router-dom'

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/80 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-xl items-center px-3 py-2">
        <Tab to="/play" label="Play" />
        <Tab to="/leaderboard" label="Leaderboard" />
        <Tab to="/map" label="Map" />
        <Tab to="/about" label="About" />
        <Tab to="/settings" label="Settings" />
      </div>
    </nav>
  )
}

function Tab({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'group flex-1 mx-1 my-0.5 rounded-lg py-3 text-center text-sm font-semibold transition-colors',
          isActive
            ? 'bg-slate-800/70 text-primary-200 ring-1 ring-primary-600/40 shadow-inner'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 ring-1 ring-transparent',
        ].join(' ')
      }
    >
      <span className="align-middle">{label}</span>
    </NavLink>
  )
}
