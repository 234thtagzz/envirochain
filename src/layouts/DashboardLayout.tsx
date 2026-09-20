import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

interface DashboardLayoutProps {
  user: { name: string; email: string; role: string } | null
}

export default function DashboardLayout({ user }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-64'}`}>
        <div className="flex-1 overflow-y-auto">
          <Header title="EnviroChain" subtitle="Dashboard" liveIndicator />
          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
