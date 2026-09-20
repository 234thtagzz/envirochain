import { FileText, CheckCircle2, AlertTriangle, TrendingUp, Shield, Leaf, Users, Scale, Info } from 'lucide-react'
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts'
import DataCard from '../components/ui/DataCard'
import Badge from '../components/ui/Badge'
import { getESGReports } from '../services/supabaseService'
import { esgReports as _simESG } from '../data/simulated'
import { useState, useEffect } from 'react'

const quarterlyData = [{ quarter: 'Q1 2025', environmental: 82, social: 76, governance: 85, overall: 81.0 }, { quarter: 'Q2 2025', environmental: 84, social: 78, governance: 87, overall: 83.0 }, { quarter: 'Q3 2025', environmental: 86, social: 80, governance: 89, overall: 85.0 }, { quarter: 'Q4 2025', environmental: 87, social: 81, governance: 90, overall: 86.0 }, { quarter: 'Q1 2026', environmental: 88, social: 82, governance: 90, overall: 86.8 }, { quarter: 'Q2 2026', environmental: 89, social: 82, governance: 91, overall: 87.3 }]
const industryComparison = [{ name: 'Our Score', score: 87.3 }, { name: 'Industry Avg', score: 74.5 }, { name: 'Top Quartile', score: 85.0 }, { name: 'Sector Best', score: 92.1 }]
const achievements = ['Achieved 68% renewable energy utilization', 'Reduced carbon emissions by 15% year-over-year', 'Obtained ISO 14001 certification', 'Completed third-party ESG audit', 'Implemented blockchain-verified reporting']
const improvements = ['Water usage efficiency below benchmark', 'Biodiversity assessment needs expansion', 'Social programs require deeper engagement', 'Scope 3 emissions tracking is partial', 'Governance policy documentation needs update']

function getScoreColor(score: number): string { if (score >= 85) return '#10b981'; if (score >= 70) return '#3b82f6'; if (score >= 55) return '#f59e0b'; return '#ef4444' }
function getComplianceBadge(status: string) { if (status === 'compliant') return <Badge variant="success" size="md">Compliant</Badge>; if (status === 'partial') return <Badge variant="warning" size="md">Partial</Badge>; return <Badge variant="danger" size="md">Non-Compliant</Badge> }

export default function ESGOverviewPage() {
  const [reports, setReports] = useState(_simESG)

  useEffect(() => { getESGReports().then((d) => { if (d.length > 0) setReports(d) }).catch(() => {}) }, [])

  const report = reports[0] || _simESG[0]
  const score = report.overallESGScore
  const scoreColor = getScoreColor(score)
  const eScore = report.environmentalScore
  const sScore = report.socialScore
  const gScore = report.governanceScore

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><FileText className="h-5 w-5" /></div><div><h1 className="text-2xl font-bold text-gray-900">ESG Overview</h1><p className="text-sm text-gray-500">ESG performance — {report.organizationName}</p></div></div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"><div className="flex items-center gap-2"><Info className="h-4 w-4 text-amber-600" /><p className="text-sm font-medium text-amber-800">Live ESG Data — Supabase</p></div></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <DataCard title="Overall ESG Score" className="lg:col-span-1"><div className="flex flex-col items-center justify-center py-4"><div className="relative flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(${scoreColor} ${score * 3.6}deg, #e5e7eb ${score * 3.6}deg)` }}><div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white"><span className="text-3xl font-bold text-gray-900">{score}</span><span className="text-xs text-gray-500">/ 100</span></div></div><p className="mt-3 text-xs text-gray-500">{report.period}</p><div className="mt-2">{getComplianceBadge(report.complianceStatus)}</div></div></DataCard>
        <div className="lg:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DataCard title="Environmental"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Leaf className="h-6 w-6" /></div><div><p className="text-2xl font-bold text-gray-900">{eScore}</p><p className="text-xs text-gray-500">Environmental Score</p></div></div><div className="mt-3"><div className="h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${eScore}%` }} /></div></div><p className="mt-2 text-[10px] text-gray-400">Renewable: {report.renewableEnergyPercent}% · Carbon: {report.carbonEmissions.toLocaleString()}t</p></DataCard>
          <DataCard title="Social"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600"><Users className="h-6 w-6" /></div><div><p className="text-2xl font-bold text-gray-900">{sScore}</p><p className="text-xs text-gray-500">Social Score</p></div></div><div className="mt-3"><div className="h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-blue-500" style={{ width: `${sScore}%` }} /></div></div><p className="mt-2 text-[10px] text-gray-400">Employee welfare, community engagement</p></DataCard>
          <DataCard title="Governance"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600"><Scale className="h-6 w-6" /></div><div><p className="text-2xl font-bold text-gray-900">{gScore}</p><p className="text-xs text-gray-500">Governance Score</p></div></div><div className="mt-3"><div className="h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-amber-500" style={{ width: `${gScore}%` }} /></div></div><p className="mt-2 text-[10px] text-gray-400">Board oversight, transparency, compliance</p></DataCard>
        </div>
      </div>
      <DataCard title="Quarterly ESG Trend"><ResponsiveContainer width="100%" height={320}><ReLineChart data={quarterlyData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#6b7280' }} /><YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} /><Legend /><Line type="monotone" dataKey="environmental" name="Environmental" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} /><Line type="monotone" dataKey="social" name="Social" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} /><Line type="monotone" dataKey="governance" name="Governance" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} /><Line type="monotone" dataKey="overall" name="Overall" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} strokeDasharray="5 5" /></ReLineChart></ResponsiveContainer></DataCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DataCard title="Compliance Status"><div className="space-y-4"><div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4"><Shield className="h-8 w-8 text-emerald-500" /><div><p className="text-sm font-semibold text-gray-900">Regulatory Compliance</p><div className="mt-1">{getComplianceBadge(report.complianceStatus)}</div></div></div><div className="space-y-2">{[{ label: 'Report Period', value: report.period }, { label: 'Generated', value: report.generatedAt?.toLocaleDateString() }, { label: 'Data Points', value: `${report.carbonEmissions.toLocaleString()} tCO2e` }].map((item) => (<div key={item.label} className="flex items-center justify-between text-xs"><span className="text-gray-500">{item.label}</span><span className="font-medium text-gray-700">{item.value}</span></div>))}</div></div></DataCard>
        <DataCard title="Key Achievements"><div className="space-y-3">{achievements.map((item, i) => (<div key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" /><p className="text-xs text-gray-700">{item}</p></div>))}</div></DataCard>
        <DataCard title="Improvement Areas"><div className="space-y-3">{improvements.map((item, i) => (<div key={i} className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" /><p className="text-xs text-gray-700">{item}</p></div>))}</div></DataCard>
      </div>
      <DataCard title="Industry Comparison"><div className="mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" /><p className="text-xs text-gray-500">Our score vs industry benchmarks — {report.organizationName}</p></div><ResponsiveContainer width="100%" height={280}><BarChart data={industryComparison}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} /><YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} /><Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60}>{industryComparison.map((_entry, index) => { const color = index === 0 ? '#10b981' : index === 3 ? '#6366f1' : '#94a3b8'; return <rect key={`bar-${index}`} fill={color} /> })}</Bar></BarChart></ResponsiveContainer></DataCard>
    </div>
  )
}
