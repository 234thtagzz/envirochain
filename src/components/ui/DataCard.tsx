import { clsx } from 'clsx';

interface DataCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function DataCard({
  title,
  children,
  className,
  headerAction,
}: DataCardProps) {
  return (
    <div className={clsx('rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5', className)}>
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <h3 className="text-[13px] font-semibold tracking-tight text-gray-900">{title}</h3>
        {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
