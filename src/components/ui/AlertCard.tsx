import { clsx } from 'clsx';
import { AlertTriangle, AlertCircle, Info, Check } from 'lucide-react';
import type { EnvironmentalAlert } from '../../types';
import { formatDate } from '../../utils/formatters';

interface AlertCardProps {
  alert: EnvironmentalAlert;
}

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

export default function AlertCard({ alert }: AlertCardProps) {
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
                <h4 className="text-sm font-semibold text-gray-900">
                  {alert.title}
                </h4>
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
              Value: {alert.value} {alert.unit}
            </span>
            <span>{formatDate(alert.timestamp)}</span>
          </div>
          {!alert.acknowledged && (
            <button className="mt-2 inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <Check className="h-3.5 w-3.5" />
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
