import { Trophy, Medal, ShieldCheck, TrendingUp } from 'lucide-react';
import DataCard from '../components/ui/DataCard';
import Badge from '../components/ui/Badge';
import { organizations } from '../data/simulated';
import { formatNumber } from '../utils/formatters';

const podiumStyles = [
  {
    ring: 'ring-amber-400',
    bg: 'bg-gradient-to-b from-amber-50 to-amber-100',
    iconBg: 'bg-amber-400 text-white',
    label: 'Gold',
    shadow: 'shadow-amber-200',
    height: 'h-40',
  },
  {
    ring: 'ring-gray-300',
    bg: 'bg-gradient-to-b from-gray-50 to-gray-100',
    iconBg: 'bg-gray-400 text-white',
    label: 'Silver',
    shadow: 'shadow-gray-200',
    height: 'h-32',
  },
  {
    ring: 'ring-orange-300',
    bg: 'bg-gradient-to-b from-orange-50 to-orange-100',
    iconBg: 'bg-orange-400 text-white',
    label: 'Bronze',
    shadow: 'shadow-orange-200',
    height: 'h-24',
  },
];

function ScoreBar({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const pct = (score / maxScore) * 100;
  const color =
    score >= 85
      ? 'bg-emerald-500'
      : score >= 70
        ? 'bg-blue-500'
        : score >= 55
          ? 'bg-amber-500'
          : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-gray-700">{score}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const top3 = organizations.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Environmental Leaderboard</h1>
            <p className="text-sm text-gray-500">
              Top performing organizations ranked by environmental impact
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <DataCard title="Top Performers">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {top3.map((org, idx) => {
            const style = podiumStyles[idx];
            return (
              <div
                key={org.id}
                className={`flex flex-col items-center rounded-xl ${style.bg} p-6 ring-2 ${style.ring} shadow-lg ${style.shadow} transition hover:scale-[1.02]`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg} shadow-md`}>
                  {idx === 0 ? (
                    <Trophy className="h-6 w-6" />
                  ) : (
                    <Medal className="h-6 w-6" />
                  )}
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {style.label}
                </p>
                <h3 className="mt-1 text-center text-base font-bold text-gray-900">
                  {org.name}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">{org.industry}</p>
                <div className="mt-3 flex items-center gap-4 text-center">
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">{org.greenIndexScore}</p>
                    <p className="text-[10px] text-gray-500">Green Index</p>
                  </div>
                  <div className="h-8 w-px bg-gray-300" />
                  <div>
                    <p className="text-lg font-bold text-gray-700">{org.totalCarbonCredits}</p>
                    <p className="text-[10px] text-gray-500">Credits</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DataCard>

      {/* Full Leaderboard */}
      <DataCard title="Full Leaderboard">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
                <th className="px-4 py-3 text-center">Rank</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3 hidden sm:table-cell">Industry</th>
                <th className="px-4 py-3">Green Index Score</th>
                <th className="px-4 py-3 hidden md:table-cell">Carbon Credits</th>
                <th className="px-4 py-3 hidden md:table-cell">Verified Reports</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr
                  key={org.id}
                  className="border-b border-gray-50 transition hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        org.rank === 1
                          ? 'bg-amber-100 text-amber-700'
                          : org.rank === 2
                            ? 'bg-gray-200 text-gray-700'
                            : org.rank === 3
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {org.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{org.name}</span>
                      {org.rank <= 3 && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="default" size="sm">
                      {org.industry}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-36">
                      <ScoreBar score={org.greenIndexScore} />
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      {formatNumber(org.totalCarbonCredits)}t
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-600">{org.verifiedReports}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
}
