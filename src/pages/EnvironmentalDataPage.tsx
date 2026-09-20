import { Download, CheckCircle2, Info, Database } from 'lucide-react'
import DataCard from '../components/ui/DataCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import AreaChart from '../components/charts/AreaChart'
import LineChart from '../components/charts/LineChart'
import { getEnvironmentalReadings } from '../services/supabaseService'
import { environmentalReadings as _simReadings, chartData as _simChartData } from '../data/simulated'
import { formatDate, getSensorTypeLabel } from '../utils/formatters'
import type { EnvironmentalReading } from '../types'
import { useState, useEffect } from 'react'

const qualityBadgeVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  excellent: 'success', good: 'success', moderate: 'warning', poor: 'danger', hazardous: 'danger',
}

export default function EnvironmentalDataPage() {
  const [readings, setReadings] = useState<EnvironmentalReading[]>(_simReadings)
  const [_loading, setLoading] = useState(true)

  useEffect(() => {
    getEnvironmentalReadings().then((data) => {
      if (data.length > 0) {
        setReadings(data)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
    void _loading
  }, [_loading])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><Database className="h-5 w-5" /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Environmental Data</h1>
            <p className="text-sm text-gray-500">Real-time readings from IoT sensors</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info" size="md">Supabase Data</Badge>
          <div className="relative group">
            <Button variant="outline" size="sm" disabled><Download className="h-4 w-4" />Export Data</Button>
            <div className="pointer-events-none absolute right-0 top-full z-10 mt-1 rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Coming Soon</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex items-center gap-2"><Info className="h-4 w-4 text-blue-600" /><p className="text-sm font-medium text-blue-800">Live Data — Connected to Supabase</p></div>
      </div>
      <DataCard title="Latest Readings">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-100">
              <th className="pb-3 pr-4 font-medium text-gray-500">Time</th>
              <th className="pb-3 pr-4 font-medium text-gray-500">Sensor</th>
              <th className="pb-3 pr-4 font-medium text-gray-500">Type</th>
              <th className="pb-3 pr-4 text-right font-medium text-gray-500">Value</th>
              <th className="pb-3 pr-4 font-medium text-gray-500">Unit</th>
              <th className="pb-3 pr-4 font-medium text-gray-500">Quality</th>
              <th className="pb-3 pr-4 font-medium text-gray-500">Location</th>
              <th className="pb-3 font-medium text-gray-500">Verified</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {readings.map((reading) => (
                <tr key={reading.id} className="hover:bg-gray-50/50">
                  <td className="whitespace-nowrap py-3 pr-4 text-gray-600">{formatDate(reading.timestamp)}</td>
                  <td className="whitespace-nowrap py-3 pr-4 font-medium text-gray-900">{reading.sensorName}</td>
                  <td className="whitespace-nowrap py-3 pr-4 text-gray-600">{getSensorTypeLabel(reading.sensorType)}</td>
                  <td className="whitespace-nowrap py-3 pr-4 text-right font-medium text-gray-900">{reading.value}</td>
                  <td className="whitespace-nowrap py-3 pr-4 text-gray-500">{reading.unit}</td>
                  <td className="py-3 pr-4"><Badge variant={qualityBadgeVariant[reading.quality]}>{reading.quality}</Badge></td>
                  <td className="whitespace-nowrap py-3 pr-4 text-gray-600">{reading.location}</td>
                  <td className="py-3">{reading.verified ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <span className="text-xs text-gray-400">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataCard title="Air Quality Trend (24h)"><AreaChart data={_simChartData.airQualityTrend} xKey="time" yKey="value" color="#10b981" height={280} /></DataCard>
        <DataCard title="Water Quality Trend (24h)"><LineChart data={_simChartData.waterQualityTrend} xKey="time" yKey="value" color="#3b82f6" height={280} /></DataCard>
      </div>
      <DataCard title="CO2 Levels (24h)"><AreaChart data={_simChartData.co2Levels} xKey="time" yKey="value" color="#f59e0b" height={280} /></DataCard>
    </div>
  )
}
