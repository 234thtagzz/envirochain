import { useState, useMemo, useEffect } from 'react'
import { clsx } from 'clsx'
import { AlertTriangle, AlertCircle, Info, Check, ShieldAlert } from 'lucide-react'
import { getEnvironmentalAlerts, acknowledgeAlert } from '../services/supabaseService'
import { formatDate } from '../utils/formatters'
import Badge from '../components/ui/Badge'
import type { EnvironmentalAlert } from '../types'

const alertStyles = {
  critical: { border: 'border-l-red-500', bg: 'bg-red-50', icon: AlertCircle, iconColor: 'text-red-500', variant: 'danger' as const },
  warning: { border: 'border-l-amber-500', bg: 'bg-amber-50', icon: AlertTriangle, iconColor: 'text-amber-500', variant: 'warning' as const },
  info: { border: 'border-l-blue-500', bg: 'bg-blue-50', icon: Info, iconColor: 'text-blue-500', variant: 'info' as const },
}

function AlertItem({ alert, onAcknowledge }: { alert: EnvironmentalAlert; onAcknowledge: (id: string) => void }) {
  const styles = alertStyles[alert.type]
  const Icon = styles.icon
  return (
    <div className={clsx('rounded-xl border-l-4 p-4 shadow-sm ring-1 ring-gray-900/5 transition hover:shadow-md', styles.border, alert.acknowledged ? 'bg-gray-50 opacity-60' : styles.bg)}>
      <div className="flex items-start gap-3">
        <div className={clsx('mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5', styles.iconColor)}><Icon className="h-4 w-4" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                <Badge variant={styles.variant} size="sm">{alert.type}</Badge>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{alert.message}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">{alert.sensorName}</span>
            <span className="hidden sm:inline text-gray-300">·</span>
            <span>Value: {alert.value} / {alert.threshold} {alert.unit}</span>
            <span className="hidden sm:inline text-gray-300">·</span>
            <span>{formatDate(alert.timestamp)}</span>
          </div>
          {!alert.acknowledged && (
            <button onClick={() => onAcknowledge(alert.id)} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <Check className="h-3.5 w-3.5" />Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<EnvironmentalAlert[]>([])
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set())
  const [_loading, setLoading] = useState(true)

  useEffect(() => {
    getEnvironmentalAlerts().then((data) => {
      if (data.length > 0) setAlerts(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleAcknowledge = async (id: string) => {
    setAcknowledgedIds((prev) => new Set(prev).add(id))
    await acknowledgeAlert(id)
  }

  const criticalCount = alerts.filter((a) => a.type === 'critical').length
  const warningCount = alerts.filter((a) => a.type === 'warning').length
  const infoCount = alerts.filter((a) => a.type === 'info').length

  const alertsWithAck = useMemo(() => {
    return alerts.map((a) => ({
      ...a,
      acknowledged: a.acknowledged || acknowledgedIds.has(a.id),
    }))
  }, [alerts, acknowledgedIds])

  const filtered = useMemo(() => {
    if (filter === 'all') return alertsWithAck
    return alertsWithAck.filter((a) => a.type === filter)
  }, [alertsWithAck, filter])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white"><ShieldAlert className="h-5 w-5" /></div>
          <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Environmental Alerts</h1><p className="text-sm text-gray-500">Monitor and respond to environmental events</p></div>
        </div>
        <Badge variant="danger" size="md">{alerts.length} total</Badge>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /><p className="text-sm font-medium text-amber-800">Live Alerts — Connected to Supabase{_loading ? ' (Loading...)' : ''}</p></div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600"><AlertCircle className="h-5 w-5" /></div><div><p className="text-2xl font-semibold text-gray-900">{criticalCount}</p><p className="text-xs text-gray-500">Critical</p></div></div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600"><AlertTriangle className="h-5 w-5" /></div><div><p className="text-2xl font-semibold text-gray-900">{warningCount}</p><p className="text-xs text-gray-500">Warning</p></div></div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"><Info className="h-5 w-5" /></div><div><p className="text-2xl font-semibold text-gray-900">{infoCount}</p><p className="text-xs text-gray-500">Info</p></div></div>
      </div>
      <div className="flex gap-2">
        {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
          <button key={type} onClick={() => setFilter(type)} className={clsx('rounded-lg px-4 py-2 text-sm font-medium transition', filter === type ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50')}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.length === 0 ? <p className="py-12 text-center text-sm text-gray-500">No alerts match the current filter.</p> : filtered.map((alert) => <AlertItem key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />)}
      </div>
    </div>
  )
}
