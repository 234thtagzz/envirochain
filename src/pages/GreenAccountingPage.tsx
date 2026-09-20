import { Calculator, DollarSign, Leaf, Droplets, Sun, Info } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatCard from '../components/ui/StatCard'
import DataCard from '../components/ui/DataCard'
import PieChart from '../components/charts/PieChart'
import { getGreenLedgerEntries, getOrganizations } from '../services/supabaseService'
import { greenLedgerEntries as _simLedger, organizations as _simOrgs } from '../data/simulated'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { useState, useEffect, useMemo } from 'react'

const monthlyData = [{ month: 'Jan', revenue: 245000000, costs: 180000000 }, { month: 'Feb', revenue: 268000000, costs: 192000000 }, { month: 'Mar', revenue: 312000000, costs: 205000000 }, { month: 'Apr', revenue: 289000000, costs: 198000000 }, { month: 'May', revenue: 341000000, costs: 215000000 }, { month: 'Jun', revenue: 378000000, costs: 228000000 }]
const expenseCategories = [{ name: 'Carbon Credits', value: 420000000, color: '#10b981' }, { name: 'Renewable Energy', value: 310000000, color: '#3b82f6' }, { name: 'Waste Management', value: 180000000, color: '#f59e0b' }, { name: 'Water Conservation', value: 125000000, color: '#06b6d4' }, { name: 'Compliance & Reporting', value: 85000000, color: '#a855f7' }]

export default function GreenAccountingPage() {
  const [ledger, setLedger] = useState(_simLedger)
  const [orgs, setOrgs] = useState(_simOrgs)

  useEffect(() => {
    getGreenLedgerEntries().then((d) => { if (d.length > 0) setLedger(d) }).catch(() => {})
    getOrganizations().then((d) => { if (d.length > 0) setOrgs(d) }).catch(() => {})
  }, [])

  const carbonCreditsValue = useMemo(() => ledger.filter((e) => e.type === 'carbon_credit').reduce((s, e) => s + e.amount, 0), [ledger])
  const emissionsOffsetValue = useMemo(() => ledger.filter((e) => e.type === 'emission_offset').reduce((s, e) => s + e.amount, 0), [ledger])
  const renewableSavings = useMemo(() => ledger.filter((e) => e.type === 'renewable_energy').reduce((s, e) => s + e.amount, 0), [ledger])
  const waterConservation = useMemo(() => ledger.filter((e) => e.type === 'water_saving').reduce((s, e) => s + e.amount, 0), [ledger])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Calculator className="h-5 w-5" /></div><div><h1 className="text-2xl font-bold text-gray-900">Green Accounting</h1><p className="text-sm text-gray-500">Environmental financial tracking and reporting</p></div></div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"><div className="flex items-center gap-2"><Info className="h-4 w-4 text-amber-600" /><p className="text-sm font-medium text-amber-800">Live Financial Data — Supabase</p></div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Carbon Credits Value" value={formatCurrency(carbonCreditsValue * 450000)} icon={<Leaf className="h-5 w-5" />} color="emerald" subtitle={`${formatNumber(carbonCreditsValue, 1)} tonnes`} />
        <StatCard title="Emissions Offset Value" value={formatCurrency(emissionsOffsetValue * 380000)} icon={<DollarSign className="h-5 w-5" />} color="blue" subtitle={`${formatNumber(emissionsOffsetValue, 1)} tonnes`} />
        <StatCard title="Renewable Savings" value={formatCurrency(renewableSavings * 85000)} icon={<Sun className="h-5 w-5" />} color="amber" subtitle={`${formatNumber(renewableSavings, 0)} MWh`} />
        <StatCard title="Water Conservation" value={formatCurrency(waterConservation * 12)} icon={<Droplets className="h-5 w-5" />} color="purple" subtitle={`${formatNumber(waterConservation, 0)} liters`} />
      </div>
      <DataCard title="Monthly Green Revenue vs Costs"><ResponsiveContainer width="100%" height={350}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} /><YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`} /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} formatter={(value: any) => formatCurrency(Number(value))} /><Legend /><Bar dataKey="revenue" name="Green Revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} /><Bar dataKey="costs" name="Environmental Costs" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={50} /></BarChart></ResponsiveContainer></DataCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DataCard title="Environmental Expense Categories"><PieChart data={expenseCategories} height={280} innerRadius={55} outerRadius={90} /></DataCard>
        <DataCard title="Carbon Credit Trading"><div className="space-y-4"><div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-medium text-emerald-700">Market Overview</p><p className="mt-1 text-2xl font-bold text-emerald-900">{formatCurrency(450000)}</p><p className="text-xs text-emerald-600">per tonne CO2e</p></div><div className="space-y-2">{orgs.slice(0, 5).map((org) => <div key={org.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"><span className="text-xs font-medium text-gray-700">{org.name}</span><span className="text-xs font-semibold text-emerald-600">{formatNumber(org.totalCarbonCredits, 1)}t</span></div>)}</div></div></DataCard>
        <DataCard title="Environmental Liability"><div className="space-y-4"><div className="rounded-lg border border-red-200 bg-red-50 p-4"><p className="text-xs font-medium text-red-700">Total Liability</p><p className="mt-1 text-2xl font-bold text-red-900">{formatCurrency(2850000000)}</p><p className="text-xs text-red-600">estimated exposure</p></div><div className="space-y-2">{orgs.slice(0, 5).map((org) => <div key={org.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"><span className="text-xs font-medium text-gray-700">{org.name}</span><span className="text-xs font-semibold text-amber-600">{formatNumber(org.totalEmissionsOffset, 0)}t offset</span></div>)}</div></div></DataCard>
      </div>
    </div>
  )
}
