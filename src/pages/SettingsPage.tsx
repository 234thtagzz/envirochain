import { useState, useEffect } from 'react'
import { getProfile } from '../services/supabaseService'
import { Settings, User, Bell, Monitor, Link2, Info, CheckCircle2 } from 'lucide-react'
import DataCard from '../components/ui/DataCard'
import Button from '../components/ui/Button'

export default function SettingsPage() {
  const [name, setName] = useState('Admin User')
  const [email, setEmail] = useState('admin@envirochain.io')
  const [organization, setOrganization] = useState('PT GreenForce')
  const [role, setRole] = useState('admin')
  const [saved, setSaved] = useState(false)
  const [_profile, setProfile] = useState<any>(null)

  useEffect(() => {
    getProfile().then((p) => {
      if (p) {
        setProfile(p)
        setName(p.name || '')
        setEmail(p.email || '')
        setOrganization(p.organization || '')
        setRole(p.role || 'viewer')
      }
    })
    void _profile
  }, [_profile])

  const [emailAlerts, setEmailAlerts] = useState(true)
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [dailySummary, setDailySummary] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [tempUnit, setTempUnit] = useState('C')
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('english')

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
  const labelClass = 'block text-xs font-medium text-gray-700 mb-1'
  const selectClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Settings className="h-5 w-5" /></div><div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500">Manage your application preferences</p></div></div>
      <DataCard title="Profile Settings" headerAction={<User className="h-4 w-4 text-gray-400" />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Organization</label><input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Role</label><input type="text" value={role.charAt(0).toUpperCase() + role.slice(1)} disabled className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`} /></div>
        </div>
      </DataCard>
      <DataCard title="Notification Preferences" headerAction={<Bell className="h-4 w-4 text-gray-400" />}>
        <div className="space-y-4">
          {[
            { label: 'Email Alerts', description: 'Receive email notifications for environmental events', value: emailAlerts, onChange: setEmailAlerts },
            { label: 'Critical Alerts Only', description: 'Only receive notifications for critical alerts', value: criticalOnly, onChange: setCriticalOnly },
            { label: 'Daily Summary', description: 'Get a daily summary of environmental readings', value: dailySummary, onChange: setDailySummary },
            { label: 'Weekly Report', description: 'Receive a weekly ESG performance report', value: weeklyReport, onChange: setWeeklyReport },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
              <div><p className="text-sm font-medium text-gray-900">{item.label}</p><p className="text-xs text-gray-500">{item.description}</p></div>
              <button type="button" onClick={() => item.onChange(!item.value)} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${item.value ? 'bg-emerald-600' : 'bg-gray-200'}`}><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.value ? 'translate-x-5' : 'translate-x-0'}`} /></button>
            </div>
          ))}
        </div>
      </DataCard>
      <DataCard title="Display Settings" headerAction={<Monitor className="h-4 w-4 text-gray-400" />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div><label className={labelClass}>Temperature Unit</label><select value={tempUnit} onChange={(e) => setTempUnit(e.target.value)} className={selectClass}><option value="C">Celsius (°C)</option><option value="F">Fahrenheit (°F)</option></select></div>
          <div><label className={labelClass}>Theme</label><select value={theme} onChange={(e) => setTheme(e.target.value)} className={selectClass}><option value="light">Light</option><option value="dark">Dark</option></select></div>
          <div><label className={labelClass}>Language</label><select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectClass}><option value="english">English</option><option value="indonesian">Indonesian</option></select></div>
        </div>
      </DataCard>
      <DataCard title="API & Integration" headerAction={<Link2 className="h-4 w-4 text-gray-400" />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3"><label className={labelClass}>Supabase URL</label><input type="text" value={import.meta.env.VITE_SUPABASE_URL || ''} className={inputClass} placeholder="https://your-project.supabase.co" /></div>
          <div><label className={labelClass}>AI Provider</label><select className={selectClass}><option value="openai">OpenAI</option><option value="gemini">Gemini</option><option value="claude">Claude</option></select></div>
          <div><label className={labelClass}>Blockchain Network</label><select className={selectClass}><option value="hyperledger">Hyperledger</option><option value="ethereum">Ethereum</option><option value="polygon">Polygon</option></select></div>
        </div>
      </DataCard>
      <DataCard title="About" headerAction={<Info className="h-4 w-4 text-gray-400" />}>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Version</span><span className="font-medium text-gray-900">EnviroChain v1.0.0 - Supabase Connected</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Tech Stack</span><span className="font-medium text-gray-900">React, TypeScript, Tailwind CSS, Recharts, Supabase</span></div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"><p className="text-xs text-emerald-700"><strong>✓</strong> Connected to Supabase database with real authentication and data synchronization.</p></div>
        </div>
      </DataCard>
      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save Settings</Button>
        {saved && <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600"><CheckCircle2 className="h-4 w-4" />Saved!</span>}
      </div>
    </div>
  )
}
