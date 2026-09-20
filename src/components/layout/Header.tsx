import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, Bell, Menu, ChevronRight, LogOut } from 'lucide-react'
import { getProfile } from '../../services/supabaseService'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  subtitle?: string
  liveIndicator?: boolean
}

export default function Header({ title, subtitle, liveIndicator = false }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadUser() {
      const profile = await getProfile()
      if (profile) setUser(profile)
    }
    loadUser()
  }, [])

  const closeDropdown = useCallback(() => setDropdownOpen(false), [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) closeDropdown()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeDropdown])

  const handleLogout = async () => {
    const { signOut } = await import('../../services/supabaseService')
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-gray-900">{title}</h1>
            {liveIndicator && <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>}
          </div>
          {subtitle && <div className="flex items-center gap-1 text-xs text-gray-400"><span>Home</span><ChevronRight className="h-3 w-3" /><span className="text-gray-600">{subtitle}</span></div>}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Search"><Search className="h-5 w-5" /></button>
        <button className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Notifications"><Bell className="h-5 w-5" /><span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span></button>
        <div className="relative ml-1" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen((o) => !o)} className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Enviro Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@envirochain.io'}</p>
                {user?.role && <p className="text-[10px] text-emerald-600 capitalize">{user.role}</p>}
              </div>
              <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"><LogOut className="h-4 w-4" />Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
