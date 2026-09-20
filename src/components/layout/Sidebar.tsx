import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Leaf,
  LogOut,
  LayoutDashboard,
  Radio,
  Database,
  AlertTriangle,
  Brain,
  Trophy,
  BookOpen,
  FileText,
  Calculator,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from 'lucide-react'
import { getProfile } from '../../services/supabaseService'
import type { User as SupabaseUser } from '../../types'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const isCollapsed = onToggle ? collapsed : internalCollapsed
  const setCollapsed = onToggle ? onToggle : () => setInternalCollapsed(v => !v)

  useEffect(() => {
    getProfile().then((profile: any) => { if (profile) setUser(profile) })
  }, [])

  const handleLogout = async () => {
    const { signOut } = await import('../../services/supabaseService')
    await signOut()
    navigate('/login')
  }

  const NAV_SECTIONS = [
    { title: 'MONITORING', items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Sensors', path: '/sensors', icon: Radio },
      { label: 'Environmental Data', path: '/environmental-data', icon: Database },
      { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
    ]},
    { title: 'ANALYTICS', items: [
      { label: 'AI Consultant', path: '/ai-consultant', icon: Brain },
      { label: 'Green Index', path: '/green-index', icon: Leaf },
      { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    ]},
    { title: 'ACCOUNTING', items: [
      { label: 'Green Ledger', path: '/green-ledger', icon: BookOpen },
      { label: 'ESG Reporting', path: '/esg-reporting', icon: FileText },
      { label: 'Green Accounting', path: '/green-accounting', icon: Calculator },
      { label: 'ESG Overview', path: '/esg-overview', icon: BarChart3 },
    ]},
    { title: 'SYSTEM', items: [
      { label: 'Settings', path: '/settings', icon: Settings },
    ]},
  ]

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-slate-900 text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-64'}`}>
      <div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 px-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && <span className="whitespace-nowrap text-[15px] font-bold tracking-tight text-white">EnviroChain</span>}
        </div>
        <button
          onClick={() => setCollapsed()}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 no-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            {!isCollapsed && <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">{section.title}</h3>}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-150 ${
                          isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {!isCollapsed && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition group-hover:opacity-40" />}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      {user && !isCollapsed && (
        <div className="mx-2.5 mb-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <p className="truncate text-[12px] font-semibold text-white">{user.name || 'User'}</p>
          <p className="truncate text-[11px] text-slate-400">{user.organization || user.email}</p>
        </div>
      )}
      <button onClick={handleLogout} className="flex h-11 items-center gap-2.5 border-t border-white/10 px-3 text-slate-400 transition hover:bg-white/5 hover:text-white">
        <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
        {!isCollapsed && <span className="text-[13px] font-medium">Sign Out</span>}
      </button>
    </aside>
  )
}
