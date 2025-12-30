import { useEffect } from 'react'
import { ensureAnonymousAuth } from './lib/firebase'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import LeaderboardPage from './pages/LeaderboardPage'
import PlayPage from './pages/PlayPage'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  useEffect(() => {
    ensureAnonymousAuth().catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Anonymous auth failed', e)
    })
  }, [])

  return (
    <HashRouter>
      <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/leaderboard" replace />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
    </HashRouter>
  )
}

export default App
