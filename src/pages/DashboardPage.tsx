import { getSensors, getEnvironmentalReadings, getEnvironmentalAlerts, getDashboardStats, getOrganizations, getGreenIndexData, getESGReports } from '../services/supabaseService'
import { sensors as _simSensors, environmentalReadings as _simReadings, environmentalAlerts as _simAlerts, dashboardStats as _simStats, chartData as _simChartData, organizations as _simOrgs, greenIndexData as _simGreenIndex, esgReports as _simESG } from '../data/simulated'
import { formatNumber } from '../utils/formatters'
import type { Organization, GreenIndex } from '../types'
import { useState, useEffect } from 'react'
import StatCard from '../components/ui/StatCard'
import DataCard from '../components/ui/DataCard'
import AlertCard from '../components/ui/AlertCard'
import SensorCard from '../components/ui/SensorCard'
import Badge from '../components/ui/Badge'
import AreaChart from '../components/charts/AreaChart'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import PieChart from '../components/charts/PieChart'
import { Activity, AlertTriangle, Radio, ShieldCheck, Calendar, Building2, Flame, Gauge, Target, TrendingUp, TrendingDown, Zap, CheckCircle2, Leaf, Award, ArrowUpRight, ShieldAlert } from 'lucide-react'

function OrganizationCard({ org, greenIndex }: { org: Organization; greenIndex?: GreenIndex }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white group-hover:bg-emerald-600 transition-colors">
        <Building2 className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-[13px] font-semibold text-gray-900">{org.name}</h4>
          <span className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${org.rank <=3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>#{org.rank}</span>
        </div>
        <p className="truncate text-xs text-gray-500">{org.industry}</p>
      </div>
      <div className="hidden sm:flex items-center gap-3 text-right">
        <div>
          <p className="text-sm font-bold leading-none text-gray-900">{org.greenIndexScore}</p>
          <p className="text-[10px] uppercase tracking-wide text-gray-400">Index</p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div>
          <p className="text-sm font-semibold leading-none text-emerald-600">{formatNumber(org.totalCarbonCredits, 1)}</p>
          <p className="text-[10px] uppercase tracking-wide text-gray-400">Credits</p>
        </div>
      </div>
      {greenIndex && (
        <span className={`hidden lg:inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${greenIndex.trend === 'improving' ? 'bg-emerald-50 text-emerald-700' : greenIndex.trend === 'declining' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
          {greenIndex.trend === 'improving' ? <TrendingUp className="h-3 w-3" /> : greenIndex.trend === 'declining' ? <TrendingDown className="h-3 w-3" /> : null}
          {greenIndex.trend}
        </span>
      )}
    </div>
  )
}

// Bar chart untuk Green Index - Top 5
function GreenIndexBreakdown({ data }: { data: GreenIndex[] }) {
  const top5 = data.slice(0, 5)
  const chartData = top5.map((org) => ({
    name: org.organizationName.split(' ').slice(0, 2).join(' '),
    score: org.overallScore,
  }))
  return (
    <DataCard title="Green Index Breakdown — Top 5" headerAction={<Badge variant="success" size="sm">Live</Badge>}>
      <div className="space-y-4">
        <p className="text-xs leading-relaxed text-gray-500">Composite score from six weighted dimensions. Higher is better.</p>
        <BarChart data={chartData} xKey="name" yKey="score" color="#059669" height={260} />
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
          {top5.map(o => (
            <div key={o.id} className="text-center">
              <p className="text-xs font-semibold text-gray-900 truncate">{o.organizationName.split(' ')[0]}</p>
              <p className="text-[11px] text-gray-500">#{o.rank} · {o.overallScore}</p>
            </div>
          ))}
        </div>
      </div>
    </DataCard>
  )
}

// ESG - Donut yang lebih lega dan tidak cramped
function ESGScorecard({ esgReports: reports }: { esgReports: any[] }) {
  const top3 = reports.slice(0, 3)
  const pieData = top3.map((r, i) => ({
    name: r.organizationName.split(' ').slice(0, 2).join(' '),
    value: r.overallESGScore,
    color: i === 0 ? '#059669' : i === 1 ? '#2563eb' : '#d97706',
  }))
  const avg = Math.round(top3.reduce((s, r) => s + r.overallESGScore, 0) / top3.length)

  return (
    <DataCard title="ESG Performance Overview" headerAction={<Badge variant="info" size="sm">Q2 2026</Badge>}>
      <div className="flex flex-col">
        {/* Donut hero */}
        <div className="relative">
          <PieChart data={pieData} height={260} innerRadius={72} outerRadius={98} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">Avg ESG</span>
            <span className="text-3xl font-extrabold tracking-tight text-gray-900">{avg}</span>
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>

        {/* Legend + mini cards di bawah donut, bukan di samping - lebih lega */}
        <div className="mt-1 grid grid-cols-3 gap-2">
          {top3.map((report, idx) => (
            <div key={report.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center">
              <div className="mx-auto mb-1.5 h-2 w-8 rounded-full" style={{ background: pieData[idx].color }} />
              <p className="truncate text-xs font-semibold text-gray-900">{report.organizationName.split(' ').slice(0,2).join(' ')}</p>
              <p className="text-[11px] text-gray-500">{report.overallESGScore} · {report.complianceStatus}</p>
              <div className="mt-1.5 flex justify-center">
                {report.verified ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700"><CheckCircle2 className="h-3 w-3" />Verified</span> : <span className="text-[10px] text-gray-400">Pending</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Detail bar E/S/G ringkas */}
        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 ring-1 ring-gray-900/5">
          {top3[0] && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div><p className="font-semibold text-emerald-700">{top3[0].environmentalScore}</p><p className="text-[10px] uppercase tracking-wide text-gray-500">Environmental</p></div>
              <div><p className="font-semibold text-blue-700">{top3[0].socialScore}</p><p className="text-[10px] uppercase tracking-wide text-gray-500">Social</p></div>
              <div><p className="font-semibold text-amber-700">{top3[0].governanceScore}</p><p className="text-[10px] uppercase tracking-wide text-gray-500">Governance</p></div>
            </div>
          )}
        </div>
      </div>
    </DataCard>
  )
}

function QuickMetrics({ greenIndexData: gData, esgReports: eReports }: { greenIndexData: GreenIndex[]; esgReports: any[] }) {
  const avgScore = gData[0]?.overallScore || 0
  const avgEsg = eReports[0]?.overallESGScore || 0
  const totalEmissions = eReports.reduce((sum: number, r: any) => sum + r.carbonEmissions, 0)
  const totalRenewable = eReports.reduce((sum: number, r: any) => sum + r.renewableEnergyPercent, 0) / (eReports.length || 1)
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex items-center gap-2 text-gray-500"><Gauge className="h-4 w-4" /><span className="text-xs font-medium">Avg Green Index</span></div><p className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{avgScore.toFixed(1)}</p><p className="mt-0.5 text-xs text-emerald-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" />+2.3% vs last quarter</p></div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex items-center gap-2 text-gray-500"><Target className="h-4 w-4" /><span className="text-xs font-medium">Avg ESG Score</span></div><p className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{avgEsg.toFixed(1)}</p><p className="mt-0.5 text-xs text-emerald-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" />+1.8%</p></div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex items-center gap-2 text-gray-500"><Flame className="h-4 w-4" /><span className="text-xs font-medium">Total Emissions</span></div><p className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{(totalEmissions / 1000).toFixed(1)}k</p><p className="mt-0.5 text-xs text-gray-500">tonnes CO₂e</p></div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex items-center gap-2 text-gray-500"><Zap className="h-4 w-4" /><span className="text-xs font-medium">Renewable</span></div><p className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{totalRenewable.toFixed(0)}%</p><p className="mt-0.5 text-xs text-emerald-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" />+5.2%</p></div>
    </div>
  )
}

export default function DashboardPage() {
  const [sensors, setSensors] = useState(_simSensors)
  const [_readings, setReadings] = useState(_simReadings)
  const [alerts, setAlerts] = useState(_simAlerts)
  const [stats, setStats] = useState(_simStats)
  const [orgs, setOrgs] = useState(_simOrgs)
  const [greenIndex, setGreenIndex] = useState(_simGreenIndex)
  const [esgReports, setESGReports] = useState(_simESG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSensors().then((d) => { if (d.length > 0) setSensors(d) }),
      getEnvironmentalReadings().then((d) => { if (d.length > 0) setReadings(d) }),
      getEnvironmentalAlerts().then((d) => { if (d.length > 0) setAlerts(d) }),
      getDashboardStats().then((d) => setStats(d)).catch(() => {}),
      getOrganizations().then((d) => { if (d.length > 0) setOrgs(d) }).catch(() => {}),
      getGreenIndexData().then((d) => { if (d.length > 0) setGreenIndex(d) }).catch(() => {}),
      getESGReports().then((d) => { if (d.length > 0) setESGReports(d) }).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const recentAlerts = alerts.slice(0, 4)
  const quickSensors = sensors.slice(0, 6)
  const topOrgs = orgs.slice(0, 5)
  const topGreenIndex = greenIndex.slice(0, 5)
  const topEsg = esgReports.slice(0, 3)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /></div>

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500"><Calendar className="h-4 w-4" />{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="md"><CheckCircle2 className="h-3.5 w-3.5 mr-1" />System Online</Badge>
          <Badge variant="default" size="md">Supabase • Live</Badge>
        </div>
      </div>

      <QuickMetrics greenIndexData={topGreenIndex} esgReports={topEsg} />

      {/* 8 StatCards - tetap 4 kolom, jarak lebih lega */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Sensors" value={stats.activeSensors} change={8.2} icon={<Radio className="h-5 w-5" />} color="emerald" subtitle="of 12 total" />
        <StatCard title="Environmental Readings" value={formatNumber(stats.totalReadings)} change={12.5} icon={<Activity className="h-5 w-5" />} color="blue" subtitle="last 24 hours" />
        <StatCard title="Active Alerts" value={stats.activeAlerts} change={-15.3} icon={<AlertTriangle className="h-5 w-5" />} color="amber" subtitle="needs attention" />
        <StatCard title="Blockchain Verified" value={formatNumber(stats.blockchainVerified)} change={5.7} icon={<ShieldCheck className="h-5 w-5" />} color="purple" subtitle="readings verified" />
        <StatCard title="Carbon Credits" value={formatNumber(stats.carbonCredits, 1)} change={3.2} icon={<Flame className="h-5 w-5" />} color="amber" subtitle="tonnes CO₂e" />
        <StatCard title="AI Recommendations" value={stats.aiRecommendations} change={18.7} icon={<Target className="h-5 w-5" />} color="blue" subtitle="pending review" />
        <StatCard title="System Uptime" value={`${stats.uptimePercent}%`} change={0.5} icon={<Activity className="h-5 w-5" />} color="emerald" subtitle="last 30 days" />
        <StatCard title="Organizations" value={orgs.length} change={12.0} icon={<Building2 className="h-5 w-5" />} color="purple" subtitle="registered" />
      </div>

      {/* Trend charts - 2 kolom equal, porsi seimbang */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataCard title="Air Quality Trend (24h)" headerAction={<Badge variant="success" size="sm">AQI</Badge>}>
          <AreaChart data={_simChartData.airQualityTrend} xKey="time" yKey="value" color="#059669" height={260} />
        </DataCard>
        <DataCard title="CO₂ Levels (24h)" headerAction={<Badge variant="warning" size="sm">ppm</Badge>}>
          <LineChart data={_simChartData.co2Levels} xKey="time" yKey="value" color="#d97706" height={260} />
        </DataCard>
      </div>

      {/* Performance Overview - perbaikan utama: donut tidak lagi sempit di samping, tapi lega di atas + cards di bawah */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <GreenIndexBreakdown data={topGreenIndex} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <ESGScorecard esgReports={topEsg} />
        </div>
      </div>

      {/* Bottom - bento: ranking lebih lebar, alerts + sensors stacked di kanan */}
      <div className="grid grid-cols-12 gap-6">
        {/* Rankings - 7 kolom */}
        <div className="col-span-12 lg:col-span-7">
          <DataCard
            title="Company Rankings"
            headerAction={<a href="/leaderboard" className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700">View all <ArrowUpRight className="h-3.5 w-3.5" /></a>}
          >
            <div className="space-y-2.5">
              {topOrgs.map((org, index) => <OrganizationCard key={org.id} org={org} greenIndex={topGreenIndex[index]} />)}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 ring-1 ring-gray-900/5">
              <span className="flex items-center gap-2 text-xs text-gray-600"><Award className="h-4 w-4 text-amber-500" />Top performer: {topOrgs[0]?.name}</span>
              <span className="text-xs font-semibold text-gray-900">{topOrgs[0]?.greenIndexScore} pts</span>
            </div>
          </DataCard>
        </div>

        {/* Right stack - 5 kolom */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <DataCard
            title="Recent Alerts"
            headerAction={<Badge variant={recentAlerts.some(a=>a.type==='critical') ? 'danger' : 'warning'} size="sm">{recentAlerts.length} new</Badge>}
          >
            <div className="space-y-3">
              {recentAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
            </div>
            <a href="/alerts" className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
              <ShieldAlert className="h-3.5 w-3.5" /> View all alerts
            </a>
          </DataCard>

          <DataCard
            title="Sensor Status"
            headerAction={<Badge variant="success" size="sm"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 inline-block" />{sensors.filter(s=>s.status==='online').length} online</Badge>}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {quickSensors.map((sensor) => <SensorCard key={sensor.id} sensor={sensor} />)}
            </div>
            <a href="/sensors" className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800">
              <Radio className="h-3.5 w-3.5" /> Manage sensors
            </a>
          </DataCard>
        </div>
      </div>

      {/* Footer mini insight - tambah konteks, tidak berlebihan */}
      <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-xs leading-relaxed text-emerald-800">
        <Leaf className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        <span><span className="font-semibold">EnviroChain</span> — Real-time IoT • Blockchain-verified • AI-analyzed. Data refreshed from Supabase every 30s.</span>
        <span className="ml-auto hidden sm:inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Live</span>
      </div>
    </div>
  )
}
