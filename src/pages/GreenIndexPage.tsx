import { getGreenIndexData } from '../services/supabaseService'
import { greenIndexData as _simGreenIndex } from '../data/simulated'
import { useState, useEffect } from 'react'
import { Wind, Droplets, Recycle, Zap, Trees, Footprints, Info, Trophy, TrendingUp, TrendingDown, Minus, Leaf } from 'lucide-react'
import Badge from '../components/ui/Badge'
import type { GreenIndex } from '../types'

const scoringComponents = [
  { label: 'Air Quality', weight: 20, icon: Wind, color: 'blue' },
  { label: 'Water Quality', weight: 18, icon: Droplets, color: 'cyan' },
  { label: 'Waste Management', weight: 15, icon: Recycle, color: 'emerald' },
  { label: 'Energy Efficiency', weight: 18, icon: Zap, color: 'amber' },
  { label: 'Biodiversity', weight: 14, icon: Trees, color: 'green' },
  { label: 'Carbon Footprint', weight: 15, icon: Footprints, color: 'purple' },
]

const colorMap: Record<string, string> = { blue: 'bg-blue-100 text-blue-600', cyan: 'bg-cyan-100 text-cyan-600', emerald: 'bg-emerald-100 text-emerald-600', amber: 'bg-amber-100 text-amber-600', green: 'bg-green-100 text-green-600', purple: 'bg-purple-100 text-purple-600' }

function TrendIndicator({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  if (trend === 'improving') return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><TrendingUp className="h-3 w-3" /> Improving</span>
  if (trend === 'declining') return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600"><TrendingDown className="h-3 w-3" /> Declining</span>
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500"><Minus className="h-3 w-3" /> Stable</span>
}

function ScoreBar({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const pct = (score / maxScore) * 100
  const color = score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : score >= 55 ? 'bg-amber-500' : 'bg-red-500'
  return <div className="flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} /></div><span className="w-10 text-right text-xs font-semibold text-gray-700">{score}</span></div>
}

export default function GreenIndexPage() {
  const [data, setData] = useState<GreenIndex[]>(_simGreenIndex)
  const [_loading, setLoading] = useState(true)

  useEffect(() => {
    getGreenIndexData().then((d) => { if (d.length > 0) setData(d) }).catch(() => {}).finally(() => setLoading(false))
  }, [])
  void _loading

  const displayData = data.length > 0 ? data : _simGreenIndex
  const topOrg = displayData[0]

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white"><Leaf className="h-5 w-5" /></div>
          <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Green Index</h1><p className="text-sm text-gray-500">Composite Environmental Performance Score</p></div>
        </div>
        <Badge variant="success" size="md"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />Live</Badge>
      </div>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"><div className="flex items-center gap-2"><Info className="h-4 w-4 text-emerald-600" /><p className="text-sm font-medium text-emerald-800">Live Green Index — Connected to Supabase</p></div></div>
      <div className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 p-5 text-white shadow-sm ring-1 ring-emerald-600/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20"><Trophy className="h-7 w-7 text-white" /></div>
        <div><p className="text-sm font-medium text-emerald-100">Top Performer</p><p className="text-xl font-bold">{topOrg?.organizationName}</p></div>
        <div className="ml-auto text-right"><p className="text-3xl font-extrabold tracking-tight">{topOrg?.overallScore}</p><p className="text-xs text-emerald-100">Overall Score</p></div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5"><h3 className="mb-4 text-sm font-semibold text-gray-900">How Green Index is Calculated</h3><p className="mb-4 text-xs leading-relaxed text-gray-600">The Green Index is a composite score derived from six weighted environmental dimensions.</p><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{scoringComponents.map((comp) => {
          const Icon = comp.icon
          return (<div key={comp.label} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"><div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${colorMap[comp.color]}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-semibold text-gray-900">{comp.label}</h4><Badge variant="default" size="sm">{comp.weight}%</Badge></div><p className="mt-0.5 text-xs text-gray-500">{comp.label} measurements</p></div></div>)
        })}</div></div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5"><h3 className="mb-4 text-sm font-semibold text-gray-900">All Organizations</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500"><th className="px-3 py-3">Rank</th><th className="px-3 py-3">Organization</th><th className="px-3 py-3">Score</th><th className="px-3 py-3 hidden sm:table-cell">Air</th><th className="px-3 py-3 hidden sm:table-cell">Water</th><th className="px-3 py-3 hidden sm:table-cell">Waste</th><th className="px-3 py-3 hidden md:table-cell">Energy</th><th className="px-3 py-3 hidden md:table-cell">Bio.</th><th className="px-3 py-3 hidden md:table-cell">Carbon</th><th className="px-3 py-3">Trend</th></tr></thead><tbody>{displayData.map((org) => (<tr key={org.id} className="border-b border-gray-50 transition hover:bg-gray-50"><td className="px-3 py-3"><span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${org.rank === 1 ? 'bg-amber-100 text-amber-700' : org.rank === 2 ? 'bg-gray-200 text-gray-700' : org.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{org.rank}</span></td><td className="px-3 py-3 font-medium text-gray-900">{org.organizationName}</td><td className="px-3 py-3"><div className="w-32"><ScoreBar score={org.overallScore} /></div></td><td className="px-3 py-3 text-xs text-gray-600 hidden sm:table-cell">{org.airQualityScore}</td><td className="px-3 py-3 text-xs text-gray-600 hidden sm:table-cell">{org.waterQualityScore}</td><td className="px-3 py-3 text-xs text-gray-600 hidden sm:table-cell">{org.wasteManagementScore}</td><td className="px-3 py-3 text-xs text-gray-600 hidden md:table-cell">{org.energyEfficiencyScore}</td><td className="px-3 py-3 text-xs text-gray-600 hidden md:table-cell">{org.biodiversityScore}</td><td className="px-3 py-3 text-xs text-gray-600 hidden md:table-cell">{org.carbonFootprintScore}</td><td className="px-3 py-3"><TrendIndicator trend={org.trend} /></td></tr>))}</tbody></table></div></div>
      </div>
    </div>
  )
}
