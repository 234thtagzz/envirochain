import { clsx } from 'clsx';
import { MapPin, Clock } from 'lucide-react';
import type { Sensor } from '../../types';
import { getSensorTypeLabel, formatDate } from '../../utils/formatters';
import Badge from './Badge';

interface SensorCardProps {
  sensor: Sensor;
}

const statusBadgeVariant: Record<Sensor['status'], 'success' | 'danger' | 'warning'> = {
  online: 'success',
  offline: 'danger',
  maintenance: 'warning',
};

export default function SensorCard({ sensor }: SensorCardProps) {
  return (
    <div className="cursor-pointer rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                'inline-block h-2 w-2 flex-shrink-0 rounded-full',
                sensor.status === 'online'
                  ? 'bg-emerald-500'
                  : sensor.status === 'offline'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
              )}
            />
            <h4 className="truncate text-sm font-semibold text-gray-900">
              {sensor.name}
            </h4>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {getSensorTypeLabel(sensor.type)}
          </p>
        </div>
        <Badge variant={statusBadgeVariant[sensor.status]}>
          {sensor.status}
        </Badge>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{sensor.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{formatDate(sensor.lastReading)}</span>
        </div>
      </div>
    </div>
  );
}
