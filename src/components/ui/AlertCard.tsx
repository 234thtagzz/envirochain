import { clsx } from 'clsx';
import { AlertTriangle, AlertCircle, Info, Check } from 'lucide-react';
import type { EnvironmentalAlert } from '../../types';
import { formatDate } from '../../utils/formatters';
import Badge from './Badge';

interface AlertCardProps {
  alert: EnvironmentalAlert;
}

const alertStyles = {
  critical: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    variant: 'danger' as const,
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    variant: 'warning' as const,
  },
  info: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    icon: Info,
    iconColor: 'text-blue-500',
    variant: 'info' as const,
  },
};

export default function AlertCard({ alert }: AlertCardProps) {
  const styles = alertStyles[alert.type];
  const Icon = styles.icon;

  return (
    <div
      className={clsx(
        'rounded-xl border-l-4 p-4 shadow-sm ring-1 ring-gray-900/5 transition hover:shadow-md',
        styles.border,
        alert.acknowledged ? 'bg-gray-50 opacity-60' : styles.bg
      )}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5', styles.iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {alert.title}
                </h4>
                <Badge variant={styles.variant} size="sm">{alert.type}</Badge>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{alert.message}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>Sensor: {alert.sensorName}</span>
            <span className="hidden sm:inline text-gray-300">·</span>
            <span>
              Value: {alert.value} {alert.unit}
            </span>
            <span className="hidden sm:inline text-gray-300">·</span>
            <span>{formatDate(alert.timestamp)}</span>
          </div>
          {!alert.acknowledged && (
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <Check className="h-3.5 w-3.5" />
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
