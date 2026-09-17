import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sensors" element={<SensorsPage />} />
          <Route path="/environmental-data" element={<EnvironmentalDataPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/ai-consultant" element={<AIConsultantPage />} />
          <Route path="/green-index" element={<GreenIndexPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/green-ledger" element={<GreenLedgerPage />} />
          <Route path="/esg-reporting" element={<ESGReporterPage />} />
          <Route path="/green-accounting" element={<GreenAccountingPage />} />
          <Route path="/esg-overview" element={<ESGOverviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
