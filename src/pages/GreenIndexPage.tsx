import {
  Leaf,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Droplets,
  Wind,
  Zap,
  TreePine,
  Footprints,
  Recycle,
  Info,
} from 'lucide-react';
import DataCard from '../components/ui/DataCard';
import RadarChart from '../components/charts/RadarChart';
import BarChart from '../components/charts/BarChart';
import { greenIndexData } from '../data/simulated';

const scoringComponents = [
  {
    label: 'Air Quality',
    weight: 20,
    icon: <Wind className="h-4 w-4" />,
    color: 'blue',
    description: 'Ambient air quality measurements including AQI, PM2.5, and CO2 levels.',
  },
  {
    label: 'Water Quality',
    weight: 18,
    icon: <Droplets className="h-4 w-4" />,
    color: 'cyan',
    description: 'Water pH, dissolved oxygen, turbidity, and contaminant levels.',
  },
  {
    label: 'Waste Management',
    weight: 15,
    icon: <Recycle className="h-4 w-4" />,
    color: 'emerald',
    description: 'Waste reduction, recycling rates, and circular economy practices.',
  },
  {
    label: 'Energy Efficiency',
    weight: 18,
    icon: <Zap className="h-4 w-4" />,
    color: 'amber',
    description: 'Energy consumption per unit output and renewable energy adoption.',
  },
  {
    label: 'Biodiversity',
    weight: 14,
    icon: <TreePine className="h-4 w-4" />,
    color: 'green',
    description: 'Impact on local flora and fauna, habitat preservation, and reforestation.',
  },
  {
    label: 'Carbon Footprint',
    weight: 15,
    icon: <Footprints className="h-4 w-4" />,
    color: 'purple',
    description: 'Total greenhouse gas emissions, offsets, and reduction trajectory.',
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
};

function TrendIndicator({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  if (trend === 'improving') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
        <TrendingUp className="h-3.5 w-3.5" /> Improving
      </span>
    );
  }
  if (trend === 'declining') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
        <TrendingDown className="h-3.5 w-3.5" /> Declining
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
      <Minus className="h-3.5 w-3.5" /> Stable
    </span>
  );
}

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

const radarData = greenIndexData.slice(0, 3).map((org) => ({
  Air: org.airQualityScore,
  Water: org.waterQualityScore,
  Waste: org.wasteManagementScore,
  Energy: org.energyEfficiencyScore,
  Biodiversity: org.biodiversityScore,
  Carbon: org.carbonFootprintScore,
}));

const barData = greenIndexData.slice(0, 8).map((org) => ({
  name: org.organizationName.length > 16 ? org.organizationName.slice(0, 14) + '…' : org.organizationName,
  score: org.overallScore,
}));

export default function GreenIndexPage() {
  const topOrg = greenIndexData[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Green Index</h1>
            <p className="text-sm text-gray-500">
              Composite Environmental Performance Score
            </p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            Prototype Green Index — Simulated Scoring
          </p>
        </div>
        <p className="mt-1 text-xs text-emerald-700">
          Scores are calculated from simulated sensor data and weighted environmental metrics.
        </p>
      </div>

      {/* Top Performer Banner */}
      <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 p-5 text-white shadow-lg">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
          <Award className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-100">Top Performer</p>
          <p className="text-xl font-bold">{topOrg.organizationName}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-3xl font-extrabold">{topOrg.overallScore}</p>
          <p className="text-xs text-emerald-100">Overall Score</p>
        </div>
      </div>

      {/* How It's Calculated */}
      <DataCard title="How Green Index is Calculated">
        <p className="mb-4 text-xs text-gray-600">
          The Green Index is a composite score (0–100) derived from six weighted environmental
          performance dimensions measured by blockchain-verified sensor data.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scoringComponents.map((comp) => (
            <div
              key={comp.label}
              className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${colorMap[comp.color]}`}
              >
                {comp.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">{comp.label}</h4>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {comp.weight}%
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{comp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DataCard>

      {/* Radar + Bar Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataCard title="Multi-Dimensional Scores — Top 3 Organizations">
          <RadarChart
            data={radarData}
            keys={['Air', 'Water', 'Waste', 'Energy', 'Biodiversity', 'Carbon']}
            nameKey="Air"
            height={320}
          />
        </DataCard>

        <DataCard title="Organization Comparison">
          <BarChart
            data={barData}
            xKey="name"
            yKey="score"
            color="#10b981"
            height={320}
          />
        </DataCard>
      </div>

      {/* Full Leaderboard Table */}
      <DataCard title="All Organizations — Green Index Scores">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
                <th className="px-3 py-3">Rank</th>
                <th className="px-3 py-3">Organization</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3 hidden sm:table-cell">Air</th>
                <th className="px-3 py-3 hidden sm:table-cell">Water</th>
                <th className="px-3 py-3 hidden sm:table-cell">Waste</th>
                <th className="px-3 py-3 hidden md:table-cell">Energy</th>
                <th className="px-3 py-3 hidden md:table-cell">Bio.</th>
                <th className="px-3 py-3 hidden md:table-cell">Carbon</th>
                <th className="px-3 py-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {greenIndexData.map((org) => (
                <tr
                  key={org.id}
                  className="border-b border-gray-50 transition hover:bg-gray-50"
                >
                  <td className="px-3 py-3">
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
                  <td className="px-3 py-3 font-medium text-gray-900">
                    {org.organizationName}
                  </td>
                  <td className="px-3 py-3">
                    <div className="w-32">
                      <ScoreBar score={org.overallScore} />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 hidden sm:table-cell">
                    {org.airQualityScore}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 hidden sm:table-cell">
                    {org.waterQualityScore}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 hidden sm:table-cell">
                    {org.wasteManagementScore}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 hidden md:table-cell">
                    {org.energyEfficiencyScore}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 hidden md:table-cell">
                    {org.biodiversityScore}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 hidden md:table-cell">
                    {org.carbonFootprintScore}
                  </td>
                  <td className="px-3 py-3">
                    <TrendIndicator trend={org.trend} />
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
