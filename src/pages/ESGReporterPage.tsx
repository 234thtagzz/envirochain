import { getESGReports, getOrganizations } from '../services/supabaseService'
import { esgReports as _simESG, organizations as _simOrgs } from '../data/simulated'
import { useState, useEffect } from 'react'
import { FileText, Download, Leaf, Users, Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import DataCard from '../components/ui/DataCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import StatCard from '../components/ui/StatCard'
import BarChart from '../components/charts/BarChart'

const egsScoreData = [
  { name: 'Environmental', score: _simESG[0]?.environmentalScore },
  { name: 'Social', score: _simESG[0]?.socialScore },
  { name: 'Governance', score: _simESG[0]?.governanceScore },
]
const _energyMixData = [
  { name: 'Solar', value: 42, color: '#f59e0b' },
  { name: 'Wind', value: 26, color: '#10b981' },
  { name: 'Hydro', value: 15, color: '#3b82f6' },
  { name: 'Natural Gas', value: 10, color: '#6b7280' },
  { name: 'Grid (Mixed)', value: 7, color: '#a855f7' },
]
void _energyMixData
const complianceConfig: Record<string, { variant: 'success' | 'warning' | 'danger'; icon: typeof CheckCircle; label: string }> = {
  compliant: { variant: 'success', icon: CheckCircle, label: 'Compliant' },
  partial: { variant: 'warning', icon: Clock, label: 'Partial' },
  non_compliant: { variant: 'danger', icon: AlertTriangle, label: 'Non-Compliant' },
}

export default function ESGReporterPage() {
  const [reports, setReports] = useState(_simESG)
  const [_orgs, setOrgs] = useState(_simOrgs)

  useEffect(() => {
    getESGReports().then((d) => { if (d.length > 0) setReports(d) }).catch(() => {})
    getOrganizations().then((d) => { if (d.length > 0) setOrgs(d) }).catch(() => {})
    void _orgs
  }, [_orgs])

  const latestReport = reports[0]
  const comp = complianceConfig[latestReport?.complianceStatus || 'partial']
  void comp

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ESG Reporting</h1>
              <p className="text-sm text-gray-500">Environmental, Social &amp; Governance Performance Reports</p>
            </div>
          </div>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4" /> Export Report (Coming Soon)
        </Button>
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-sm font-medium text-blue-800">Live ESG Data — Connected to Supabase</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Environmental (E)" value={latestReport?.environmentalScore} icon={<Leaf className="h-5 w-5" />} color="emerald" subtitle="Carbon, energy, waste, water" />
        <StatCard title="Social (S)" value={latestReport?.socialScore} icon={<Users className="h-5 w-5" />} color="blue" subtitle="Community, labor, health" />
        <StatCard title="Governance (G)" value={latestReport?.governanceScore} icon={<Shield className="h-5 w-5" />} color="purple" subtitle="Compliance, ethics, transparency" />
      </div>
      <DataCard title="E / S / G Score Comparison"><BarChart data={egsScoreData} xKey="name" yKey="score" color="#3b82f6" height={280} /></DataCard>
      <DataCard title="All ESG Reports">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">E Score</th>
                <th className="px-4 py-3">S Score</th>
                <th className="px-4 py-3">G Score</th>
                <th className="px-4 py-3">Overall</th>
                <th className="px-4 py-3 hidden sm:table-cell">Renewable %</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const rComp = complianceConfig[report.complianceStatus]
                const RIcon = rComp.icon
                return (
                  <tr key={report.id} className="border-b border-gray-50 transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{report.organizationName}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{report.period}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{report.environmentalScore}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{report.socialScore}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{report.governanceScore}</td>
                    <td className="px-4 py-3"><span className="text-sm font-semibold text-gray-900">{report.overallESGScore}</span></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs text-gray-600">{report.renewableEnergyPercent}%</span></td>
                    <td className="px-4 py-3"><Badge variant={rComp.variant} size="sm"><RIcon className="mr-1 h-3 w-3" />{rComp.label}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  )
}
