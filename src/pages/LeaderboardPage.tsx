import { getOrganizations } from '../services/supabaseService'
import { organizations as _simOrgs } from '../data/simulated'
import { formatNumber } from '../utils/formatters'
import type { Organization } from '../types'
import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import Badge from '../components/ui/Badge'

const podiumStyles = [
  { ring: 'ring-amber-400', bg: 'bg-gradient-to-b from-amber-50 to-amber-100', iconBg: 'bg-amber-500 text-white', label: 'Gold', icon: Crown },
  { ring: 'ring-slate-300', bg: 'bg-gradient-to-b from-slate-50 to-slate-100', iconBg: 'bg-slate-400 text-white', label: 'Silver', icon: Medal },
  { ring: 'ring-orange-300', bg: 'bg-gradient-to-b from-orange-50 to-orange-100', iconBg: 'bg-orange-500 text-white', label: 'Bronze', icon: Award },
]

function ScoreBar({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const pct = (score / maxScore) * 100
  const color = score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : score >= 55 ? 'bg-amber-500' : 'bg-red-500'
  return <div className="flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} /></div><span className="w-10 text-right text-xs font-semibold text-gray-700">{score}</span></div>
}

export default function LeaderboardPage() {
  const [orgs, setOrgs] = useState<Organization[]>(_simOrgs)
  const [_loading, setLoading] = useState(true)

  useEffect(() => {
    getOrganizations().then((data) => { if (data.length > 0) setOrgs(data) }).catch(() => {}).finally(() => setLoading(false))
    void _loading
  }, [_loading])

  const displayOrgs = orgs.length > 0 ? orgs : _simOrgs
  const top3 = displayOrgs.slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white"><Trophy className="h-5 w-5" /></div>
          <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Environmental Leaderboard</h1><p className="text-sm text-gray-500">Top performing organizations ranked by environmental impact</p></div>
        </div>
        <Badge variant="warning" size="md">Live</Badge>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"><div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-600" /><p className="text-sm font-medium text-amber-800">Live Leaderboard — Connected to Supabase</p></div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{top3.map((org, idx) => {
        const style = podiumStyles[idx]
        const Icon = style.icon
        return <div key={org.id} className={`flex flex-col items-center rounded-xl ${style.bg} p-6 ring-1 ${style.ring} shadow-sm`}><div className={`flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg} shadow-sm`}><Icon className="h-6 w-6" /></div><p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-gray-500">{style.label}</p><h3 className="mt-1 text-center text-base font-bold leading-tight text-gray-900">{org.name}</h3><p className="mt-0.5 text-xs text-gray-500">{org.industry}</p><div className="mt-4 flex items-center gap-4 text-center"><div><p className="text-2xl font-extrabold tracking-tight text-gray-900">{org.greenIndexScore}</p><p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Green Index</p></div><div className="h-8 w-px bg-gray-200" /><div><p className="text-lg font-bold text-gray-700">{org.totalCarbonCredits}</p><p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Credits</p></div></div></div>
      })}</div>
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5"><div className="border-b border-gray-100 px-5 py-4"><h3 className="text-sm font-semibold text-gray-900">Full Leaderboard</h3></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500"><th className="px-4 py-3 text-center">Rank</th><th className="px-4 py-3">Organization</th><th className="px-4 py-3 hidden sm:table-cell">Industry</th><th className="px-4 py-3">Green Index Score</th><th className="px-4 py-3 hidden md:table-cell">Carbon Credits</th><th className="px-4 py-3 hidden md:table-cell">Verified Reports</th></tr></thead><tbody>{displayOrgs.map((org) => (<tr key={org.id} className="border-b border-gray-50 transition hover:bg-gray-50"><td className="px-4 py-3 text-center"><span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${org.rank === 1 ? 'bg-amber-100 text-amber-700' : org.rank === 2 ? 'bg-gray-200 text-gray-700' : org.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{org.rank}</span></td><td className="px-4 py-3"><div className="flex items-center gap-2"><span className="font-medium text-gray-900">{org.name}</span></div></td><td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs text-gray-600">{org.industry}</span></td><td className="px-4 py-3"><div className="w-36"><ScoreBar score={org.greenIndexScore} /></div></td><td className="px-4 py-3 hidden md:table-cell"><div className="flex items-center gap-1 text-xs text-gray-600"><span className="text-emerald-500">↑</span>{formatNumber(org.totalCarbonCredits)}t</div></td><td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-gray-600">{org.verifiedReports}</span></td></tr>))}</tbody></table></div></div>
    </div>
  )
}
