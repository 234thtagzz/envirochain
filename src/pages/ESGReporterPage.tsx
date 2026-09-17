import {
  FileText,
  Download,
  Leaf,
  Users,
  Shield,
  Droplets,
  Zap,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import DataCard from '../components/ui/DataCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import { esgReports } from '../data/simulated';
import { formatNumber } from '../utils/formatters';

const latestReport = esgReports[0];

const egsScoreData = [
  { name: 'Environmental', score: latestReport.environmentalScore },
  { name: 'Social', score: latestReport.socialScore },
  { name: 'Governance', score: latestReport.governanceScore },
];

const energyMixData = [
  { name: 'Solar', value: 42, color: '#f59e0b' },
  { name: 'Wind', value: 26, color: '#10b981' },
  { name: 'Hydro', value: 15, color: '#3b82f6' },
  { name: 'Natural Gas', value: 10, color: '#6b7280' },
  { name: 'Grid (Mixed)', value: 7, color: '#a855f7' },
];

const complianceConfig: Record<
  string,
  { variant: 'success' | 'warning' | 'danger'; icon: typeof CheckCircle; label: string }
> = {
  compliant: { variant: 'success', icon: CheckCircle, label: 'Compliant' },
  partial: { variant: 'warning', icon: Clock, label: 'Partial' },
  non_compliant: { variant: 'danger', icon: AlertTriangle, label: 'Non-Compliant' },
};

export default function ESGReporterPage() {
  const comp = complianceConfig[latestReport.complianceStatus];
  const CompIcon = comp.icon;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ESG Reporting</h1>
              <p className="text-sm text-gray-500">
                Environmental, Social & Governance Performance Reports
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4" />
          Export Report (Coming Soon)
        </Button>
      </div>

      {/* Latest Report Hero */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">Latest ESG Report</p>
            <h2 className="mt-1 text-xl font-bold">{latestReport.organizationName}</h2>
            <p className="text-sm text-blue-100">Period: {latestReport.period}</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-4xl font-extrabold">{latestReport.overallESGScore}</p>
            <p className="text-sm text-blue-100">Overall ESG Score</p>
            <div className="mt-1">
              <Badge variant={comp.variant} size="md">
                <CompIcon className="mr-1 h-3 w-3" />
                {comp.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* E / S / G Score Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Environmental (E)"
          value={latestReport.environmentalScore}
          icon={<Leaf className="h-5 w-5" />}
          color="emerald"
          subtitle="Carbon, energy, waste, water"
        />
        <StatCard
          title="Social (S)"
          value={latestReport.socialScore}
          icon={<Users className="h-5 w-5" />}
          color="blue"
          subtitle="Community, labor, health"
        />
        <StatCard
          title="Governance (G)"
          value={latestReport.governanceScore}
          icon={<Shield className="h-5 w-5" />}
          color="purple"
          subtitle="Compliance, ethics, transparency"
        />
      </div>

      {/* E/S/G Comparison Bar Chart */}
      <DataCard title="E / S / G Score Comparison">
        <BarChart
          data={egsScoreData}
          xKey="name"
          yKey="score"
          color="#3b82f6"
          height={280}
        />
      </DataCard>

      {/* Detailed Metrics */}
      <DataCard title="Detailed Environmental Metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Carbon Emissions</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(latestReport.carbonEmissions)}{' '}
                <span className="text-xs font-normal text-gray-500">tonnes CO₂e</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Energy Consumption</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(latestReport.energyConsumption)}{' '}
                <span className="text-xs font-normal text-gray-500">kWh</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Water Usage</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(latestReport.waterUsage)}{' '}
                <span className="text-xs font-normal text-gray-500">liters</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Waste Generated</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(latestReport.wasteGenerated)}{' '}
                <span className="text-xs font-normal text-gray-500">tonnes</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Renewable Energy</p>
              <p className="text-lg font-semibold text-gray-900">
                {latestReport.renewableEnergyPercent}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Compliance Status</p>
              <Badge variant={comp.variant} size="md">
                <CompIcon className="mr-1 h-3 w-3" />
                {comp.label}
              </Badge>
            </div>
          </div>
        </div>
      </DataCard>

      {/* Energy Mix Pie Chart */}
      <DataCard title="Energy Mix Breakdown">
        <div className="flex flex-col items-center gap-6 lg:flex-row">
          <div className="flex-1">
            <PieChart data={energyMixData} height={300} />
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-gray-600">
              {latestReport.organizationName} sources{' '}
              {latestReport.renewableEnergyPercent}% of its energy from renewable sources,
              exceeding the industry average of 42%.
            </p>
            <div className="space-y-2">
              {energyMixData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="ml-auto text-sm font-semibold text-gray-900">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DataCard>

      {/* All Reports Table */}
      <DataCard title="All ESG Reports">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">E Score</th>
                <th className="px-4 py-3">S Score</th>
                <th className="px-4 py-3">G Score</th>
                <th className="px-4 py-3">Overall</th>
                <th className="px-4 py-3 hidden sm:table-cell">Renewable %</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {esgReports.map((report) => {
                const rComp = complianceConfig[report.complianceStatus];
                const RIcon = rComp.icon;
                return (
                  <tr
                    key={report.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {report.organizationName}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{report.period}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {report.environmentalScore}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{report.socialScore}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {report.governanceScore}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {report.overallESGScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-600">
                        {report.renewableEnergyPercent}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={rComp.variant} size="sm">
                        <RIcon className="mr-1 h-3 w-3" />
                        {rComp.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
}
