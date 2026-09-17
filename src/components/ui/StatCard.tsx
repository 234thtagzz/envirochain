import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple';
  subtitle?: string;
}

const colorStyles: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
};

export default function StatCard({
  title,
  value,
  change,
  icon,
  color = 'emerald',
  subtitle,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={clsx('flex h-10 w-10 items-center justify-center rounded-full', styles.bg, styles.text)}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={clsx(
              'text-xs font-medium',
              change >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {change >= 0 ? '+' : ''}
            {change}%
          </span>
        </div>
      )}
    </div>
  );
}
