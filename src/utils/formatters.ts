import type { SensorType } from '../types';

export function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${d} ${m} ${y} ${h}:${min}`;
}

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function getQualityColor(quality: string): string {
  const map: Record<string, string> = {
    excellent: 'text-emerald-500',
    good: 'text-green-500',
    moderate: 'text-yellow-500',
    poor: 'text-orange-500',
    hazardous: 'text-red-500',
  };
  return map[quality] ?? 'text-gray-500';
}

export function getSensorTypeLabel(type: SensorType): string {
  const map: Record<SensorType, string> = {
    air_quality: 'Air Quality',
    water_quality: 'Water Quality',
    soil: 'Soil',
    noise: 'Noise',
    temperature: 'Temperature',
    humidity: 'Humidity',
    co2: 'CO₂',
    pm25: 'PM2.5',
    radiation: 'Radiation',
  };
  return map[type] ?? type;
}

export function getSensorTypeIcon(type: SensorType): string {
  const map: Record<SensorType, string> = {
    air_quality: 'Wind',
    water_quality: 'Droplets',
    soil: 'Mountain',
    noise: 'Volume2',
    temperature: 'Thermometer',
    humidity: 'CloudRain',
    co2: 'Cloud',
    pm25: 'CloudFog',
    radiation: 'Zap',
  };
  return map[type] ?? 'Circle';
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    online: 'text-green-500',
    offline: 'text-red-500',
    maintenance: 'text-yellow-500',
  };
  return map[status] ?? 'text-gray-500';
}

export function getAlertTypeColor(type: string): string {
  const map: Record<string, string> = {
    warning: 'text-yellow-500',
    critical: 'text-red-500',
    info: 'text-blue-500',
  };
  return map[type] ?? 'text-gray-500';
}

export function calculateTrend(
  current: number,
  previous: number
): { value: number; isPositive: boolean } {
  if (previous === 0) return { value: 0, isPositive: true };
  const diff = current - previous;
  const percent = Math.round((Math.abs(diff) / Math.abs(previous)) * 100);
  return { value: percent, isPositive: diff >= 0 };
}

export function truncateHash(hash: string, length: number = 4): string {
  if (hash.length <= length * 2 + 2) return hash;
  return `${hash.slice(0, length + 2)}...${hash.slice(-length)}`;
}
