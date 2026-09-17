import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { AlertTriangle, AlertCircle, Info, Check } from 'lucide-react';
import { environmentalAlerts } from '../data/simulated';
import { formatDate } from '../utils/formatters';
import type { EnvironmentalAlert } from '../types';

const alertStyles = {
  critical: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    badge: 'bg-red-100 text-red-700',
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700',
  },
  info: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    icon: Info,
    iconColor: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700',
  },
};

function AlertItem({
  alert,
  onAcknowledge,
}: {
  alert: EnvironmentalAlert;
  onAcknowledge: (id: string) => void;
}) {
  const styles = alertStyles[alert.type];
  const Icon = styles.icon;

  return (
    <div
      className={clsx(
        'rounded-lg border-l-4 p-4 shadow-sm transition hover:shadow-md',
        styles.border,
        alert.acknowledged ? 'bg-gray-50 opacity-60' : styles.bg
      )}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('mt-0.5 flex-shrink-0', styles.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                <span
                  className={clsx(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    styles.badge
                  )}
                >
                  {alert.type}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>Sensor: {alert.sensorName}</span>
            <span>
              Value: {alert.value} / Threshold: {alert.threshold} {alert.unit}
            </span>
            <span>{formatDate(alert.timestamp)}</span>
          </div>
          {!alert.acknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="mt-2 inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Check className="h-3.5 w-3.5" />
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  const criticalCount = environmentalAlerts.filter((a) => a.type === 'critical').length;
  const warningCount = environmentalAlerts.filter((a) => a.type === 'warning').length;
  const infoCount = environmentalAlerts.filter((a) => a.type === 'info').length;

  const alerts = useMemo(() => {
    return environmentalAlerts.map((a) => ({
      ...a,
      acknowledged: a.acknowledged || acknowledgedIds.has(a.id),
    }));
  }, [acknowledgedIds]);

  const filtered = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter((a) => a.type === filter);
  }, [alerts, filter]);

  function handleAcknowledge(id: string) {
    setAcknowledgedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Environmental Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and Respond to Environmental Events
        </p>
      </div>

      {/* Demo Notice */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
        <p className="text-sm font-medium text-purple-800">
          Demo Alerts — These are simulated alerts for demonstration purposes.
        </p>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{criticalCount}</p>
            <p className="text-xs text-gray-500">Critical</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{warningCount}</p>
            <p className="text-xs text-gray-500">Warning</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{infoCount}</p>
            <p className="text-xs text-gray-500">Info</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-medium transition',
              filter === type
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            No alerts match the current filter.
          </p>
        ) : (
          filtered.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
            />
          ))
        )}
      </div>
    </div>
  );
}
