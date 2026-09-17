import { useState } from 'react';
import { BookOpen, CheckCircle2, Info, Link2 } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { greenLedgerEntries } from '../data/simulated';
import { formatDate, formatNumber, truncateHash } from '../utils/formatters';

const typeFilterOptions = [
  { key: 'all', label: 'All' },
  { key: 'carbon_credit', label: 'Carbon Credit' },
  { key: 'emission_offset', label: 'Emission Offset' },
  { key: 'renewable_energy', label: 'Renewable Energy' },
  { key: 'waste_reduction', label: 'Waste Reduction' },
  { key: 'water_saving', label: 'Water Saving' },
] as const;

type FilterKey = (typeof typeFilterOptions)[number]['key'];

const typeBadgeVariant: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  carbon_credit: 'success',
  emission_offset: 'info',
  renewable_energy: 'warning',
  waste_reduction: 'default',
  water_saving: 'info',
};

const typeLabel: Record<string, string> = {
  carbon_credit: 'Carbon Credit',
  emission_offset: 'Emission Offset',
  renewable_energy: 'Renewable Energy',
  waste_reduction: 'Waste Reduction',
  water_saving: 'Water Saving',
};

export default function GreenLedgerPage() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered =
    filter === 'all'
      ? greenLedgerEntries
      : greenLedgerEntries.filter((e) => e.type === filter);

  const totalTransactions = greenLedgerEntries.length;
  const verifiedCount = greenLedgerEntries.filter((e) => e.verified).length;
  const carbonCreditsSum = greenLedgerEntries
    .filter((e) => e.type === 'carbon_credit')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalOffset = greenLedgerEntries
    .filter((e) => e.type === 'emission_offset')
    .reduce((sum, e) => sum + e.amount, 0);

  const last5Blocks = [...greenLedgerEntries]
    .sort((a, b) => b.blockIndex - a.blockIndex)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Green Ledger</h1>
          <p className="text-sm text-gray-500">Blockchain-verified environmental transactions</p>
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">
            Blockchain Verification — Prototype
          </p>
        </div>
        <p className="mt-1 text-xs text-amber-700">
          All transactions are simulated. Blockchain verification is for demonstration purposes only.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={totalTransactions}
          icon={<BookOpen className="h-5 w-5" />}
          color="emerald"
          subtitle="ledger entries"
        />
        <StatCard
          title="Verified"
          value={verifiedCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="blue"
          subtitle={`of ${totalTransactions} total`}
        />
        <StatCard
          title="Carbon Credits"
          value={`${formatNumber(carbonCreditsSum, 1)}t`}
          icon={<Link2 className="h-5 w-5" />}
          color="amber"
          subtitle="tonnes CO2e"
        />
        <StatCard
          title="Total Offset"
          value={`${formatNumber(totalOffset, 1)}t`}
          icon={<Link2 className="h-5 w-5" />}
          color="purple"
          subtitle="tonnes CO2e"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {typeFilterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === opt.key
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Ledger Entries ({filtered.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
                <th className="px-5 py-3">Block #</th>
                <th className="px-5 py-3">Tx Hash</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3 hidden md:table-cell">Organization</th>
                <th className="px-5 py-3">Verified</th>
                <th className="px-5 py-3 hidden lg:table-cell">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-gray-50 transition hover:bg-gray-50"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">
                    #{entry.blockIndex}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">
                    {truncateHash(entry.transactionHash)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={typeBadgeVariant[entry.type]}>
                      {typeLabel[entry.type]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    {formatNumber(entry.amount, 1)} {entry.unit}
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-600 hidden md:table-cell">
                    {entry.organizationName}
                  </td>
                  <td className="px-5 py-3">
                    {entry.verified ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <span className="text-xs text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500 hidden lg:table-cell">
                    {formatDate(entry.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockchain Visualization */}
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Recent Block Chain</h3>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {last5Blocks.map((block, i) => (
            <div key={block.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center min-w-[120px]">
                <span className="text-[10px] font-medium uppercase text-emerald-600">
                  Block #{block.blockIndex}
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  {truncateHash(block.transactionHash, 3)}
                </span>
                <Badge variant={block.verified ? 'success' : 'warning'} size="sm">
                  {block.verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              {i < last5Blocks.length - 1 && (
                <div className="mx-1 flex items-center text-emerald-300">
                  <div className="h-0.5 w-6 bg-emerald-300" />
                  <div className="h-0 w-0 border-y-4 border-y-transparent border-l-4 border-l-emerald-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
