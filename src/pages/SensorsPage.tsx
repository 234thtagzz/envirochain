import { supabase } from '../lib/supabase'
import { getSensors, getEnvironmentalReadings, getEnvironmentalAlerts, getDashboardStats, getChartData } from '../services/supabaseService'
import type { Sensor, EnvironmentalReading, EnvironmentalAlert } from '../types'
import { sensors as _simSensors } from '../data/simulated'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Radio, Database, MapPin, Activity } from 'lucide-react'
import Badge from '../components/ui/Badge'
import DataCard from '../components/ui/DataCard'
import SensorCard from '../components/ui/SensorCard'

export function useSupabaseData<T>(fetcher: () => Promise<T[] | T>, fallback: T | T[], immediate = true) {
  const [data, setData] = useState<T | T[]>(fallback)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await fetcher()
      if (mountedRef.current) {
        setData(result)
        setError(null)
      }
    } catch (e: any) {
      if (mountedRef.current) setError(e.message)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useSupabaseRealtime(table: string, onInsert: (payload: any) => void) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    channelRef.current = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload) => {
        onInsert(payload.new)
      })
      .subscribe()
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [table, onInsert])
}

export function getSensorsData(): Promise<Sensor[]> {
  return getSensors()
}

export function getReadingsData(): Promise<EnvironmentalReading[]> {
  return getEnvironmentalReadings()
}

export function getAlertsData(): Promise<EnvironmentalAlert[]> {
  return getEnvironmentalAlerts()
}

export function getStatsData(): Promise<any> {
  return getDashboardStats()
}

export function getChartDataFn(type: string): Promise<any[]> {
  return getChartData(type)
}

const statusVariant: Record<Sensor['status'], 'success' | 'danger' | 'warning'> = { online: 'success', offline: 'danger', maintenance: 'warning' }

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>(_simSensors)

  useEffect(() => {
    getSensors().then((d) => { if (d.length > 0) setSensors(d) }).catch(() => {})
  }, [])

  const onlineCount = sensors.filter(s => s.status === 'online').length
  const offlineCount = sensors.filter(s => s.status === 'offline').length
  const maintenanceCount = sensors.filter(s => s.status === 'maintenance').length

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"><Radio className="h-5 w-5" /></div>
          <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Sensors</h1><p className="text-sm text-gray-500">Manage and monitor IoT sensors — {sensors.length} total</p></div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="success" size="md">{onlineCount} Online</Badge>
          <Badge variant="warning" size="md">{maintenanceCount} Maintenance</Badge>
          <Badge variant="danger" size="md">{offlineCount} Offline</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><Activity className="h-5 w-5" /></div><div><p className="text-lg font-bold text-gray-900">{onlineCount}</p><p className="text-xs text-gray-500">Online</p></div></div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><Database className="h-5 w-5" /></div><div><p className="text-lg font-bold text-gray-900">{maintenanceCount}</p><p className="text-xs text-gray-500">Maintenance</p></div></div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600"><MapPin className="h-5 w-5" /></div><div><p className="text-lg font-bold text-gray-900">{offlineCount}</p><p className="text-xs text-gray-500">Offline</p></div></div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sensors.map(s => <SensorCard key={s.id} sensor={s} />)}
      </div>

      <DataCard title={`All Sensors — Detailed View`} headerAction={<Badge variant="default" size="sm">{sensors.length} sensors</Badge>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-500"><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Location</th><th className="px-4 py-3 font-medium">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-50">{sensors.map((s) => (<tr key={s.id} className="transition hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{s.name}</td><td className="px-4 py-3 text-gray-600 capitalize">{s.type.replace('_',' ')}</td><td className="px-4 py-3 text-gray-600">{s.location}</td><td className="px-4 py-3"><Badge variant={statusVariant[s.status]} size="sm">{s.status}</Badge></td></tr>))}</tbody>
          </table>
        </div>
      </DataCard>
    </div>
  )
}
