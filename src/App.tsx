import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { getProfile } from './services/supabaseService'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SensorsPage from './pages/SensorsPage'
import EnvironmentalDataPage from './pages/EnvironmentalDataPage'
import AlertsPage from './pages/AlertsPage'
import AIConsultantPage from './pages/AIConsultantPage'
import GreenIndexPage from './pages/GreenIndexPage'
import LeaderboardPage from './pages/LeaderboardPage'
import GreenLedgerPage from './pages/GreenLedgerPage'
import ESGReporterPage from './pages/ESGReporterPage'
import GreenAccountingPage from './pages/GreenAccountingPage'
import ESGOverviewPage from './pages/ESGOverviewPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const resolveProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const profile = await getProfile()
          if (mounted) setUser(profile)
        }
      } catch (e) {
        console.error('Initial session error:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    resolveProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const profile = await getProfile()
          if (mounted) setUser(profile)
        } catch (e) {
          console.error('onAuthStateChange profile error:', e)
          // Fallback minimal agar tidak terlempar ke login walau profiles 403
          if (mounted) setUser({
            name: (session.user.user_metadata as any)?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: (session.user.user_metadata as any)?.role || 'viewer',
          })
        }
      } else {
        if (mounted) setUser(null)
      }
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        </Route>

        <Route element={<DashboardLayout user={user} />}>
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/sensors" element={user ? <SensorsPage /> : <Navigate to="/login" />} />
          <Route path="/environmental-data" element={user ? <EnvironmentalDataPage /> : <Navigate to="/login" />} />
          <Route path="/alerts" element={user ? <AlertsPage /> : <Navigate to="/login" />} />
          <Route path="/ai-consultant" element={user ? <AIConsultantPage /> : <Navigate to="/login" />} />
          <Route path="/green-index" element={user ? <GreenIndexPage /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={user ? <LeaderboardPage /> : <Navigate to="/login" />} />
          <Route path="/green-ledger" element={user ? <GreenLedgerPage /> : <Navigate to="/login" />} />
          <Route path="/esg-reporting" element={user ? <ESGReporterPage /> : <Navigate to="/login" />} />
          <Route path="/green-accounting" element={user ? <GreenAccountingPage /> : <Navigate to="/login" />} />
          <Route path="/esg-overview" element={user ? <ESGOverviewPage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
