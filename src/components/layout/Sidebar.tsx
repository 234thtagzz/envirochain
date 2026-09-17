import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Database,
  AlertTriangle,
  Bot,
  Leaf,
  Trophy,
  BookOpen,
  BarChart3,
  Calculator,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'MONITORING',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Sensors', path: '/sensors', icon: Activity },
      { label: 'Environmental Data', path: '/environmental-data', icon: Database },
      { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { label: 'AI Consultant', path: '/ai-consultant', icon: Bot },
      { label: 'Green Index', path: '/green-index', icon: Leaf },
      { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    ],
  },
  {
    title: 'ACCOUNTING',
    items: [
      { label: 'Green Ledger', path: '/green-ledger', icon: BookOpen },
      { label: 'ESG Reporting', path: '/esg-reporting', icon: BarChart3 },
      { label: 'Green Accounting', path: '/green-accounting', icon: Calculator },
      { label: 'ESG Overview', path: '/esg-overview', icon: FileText },
    ],
  },
  {
    title: 'SYSTEM',
    items: [{ label: 'Settings', path: '/settings', icon: Settings }],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0f172a] text-white transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
        <Leaf className="h-7 w-7 flex-shrink-0 text-emerald-400" />
        {!collapsed && (
          <span className="whitespace-nowrap text-lg font-bold tracking-tight text-emerald-400">
            EnviroChain
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 overflow-y-auto no-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <h3 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {section.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                          isActive
                            ? 'bg-emerald-600/20 text-emerald-400'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        } ${collapsed ? 'justify-center' : ''}`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Demo Mode Badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
            Demo Mode
          </span>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="flex h-10 items-center justify-center border-t border-white/10 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </aside>
  );
}
