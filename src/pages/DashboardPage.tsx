import {
  Activity,
  AlertTriangle,
  Radio,
  ShieldCheck,
  Calendar,
  Building2,
  Flame,
  Gauge,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  Star,
  CheckCircle,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import DataCard from '../components/ui/DataCard';
import AlertCard from '../components/ui/AlertCard';
import SensorCard from '../components/ui/SensorCard';
import Badge from '../components/ui/Badge';
import AreaChart from '../components/charts/AreaChart';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import {
  dashboardStats,
  sensors,
  environmentalAlerts,
  chartData,
  organizations,
  greenIndexData,
  esgReports,
} from '../data/simulated';
import { formatNumber } from '../utils/formatters';
import type { Organization, GreenIndex } from '../types';

function OrganizationCard({ org, greenIndex, esg }: { org: Organization; greenIndex?: GreenIndex; esg?: typeof esgReports[0] }) {
  return (
    <div className="cursor-pointer rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-gray-900">{org.name}</h4>
              <p className="text-xs text-gray-500">{org.industry}</p>
            </div>
          </div>
        </div>
        <div className="ml-2 flex flex-col items-end">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <Star className="h-3 w-3" />
            #{org.rank}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{org.greenIndexScore}</p>
          <p className="text-[10px] text-gray-500">Green Index</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{formatNumber(org.totalCarbonCredits, 1)}</p>
          <p className="text-[10px] text-gray-500">Carbon Credits</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{org.verifiedReports}</p>
          <p className="text-[10px] text-gray-500">Verified Reports</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Flame className="h-3 w-3" />
          {formatNumber(org.totalEmissionsOffset)} t offset
        </span>
        {greenIndex && (
          <span className={`flex items-center gap-1 ${greenIndex.trend === 'improving' ? 'text-emerald-600' : greenIndex.trend === 'declining' ? 'text-red-600' : 'text-gray-600'}`}>
            {greenIndex.trend === 'improving' ? <TrendingUp className="h-3 w-3" /> : greenIndex.trend === 'declining' ? <TrendingDown className="h-3 w-3" /> : null}
            {greenIndex.trend}
          </span>
        )}
      </div>

      {esg && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${esg.overallESGScore}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700">{esg.overallESGScore}</span>
          {esg.verified && (
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          )}
        </div>
      )}
    </div>
  );
}

function GreenIndexBreakdown({ data }: { data: GreenIndex[] }) {
  const top5 = data.slice(0, 5);

  const chartData = top5.map((org) => ({
    name: org.organizationName.split(' ').slice(0, 2).join(' '),
    air: org.airQualityScore,
    water: org.waterQualityScore,
    waste: org.wasteManagementScore,
    energy: org.energyEfficiencyScore,
    biodiversity: org.biodiversityScore,
    carbon: org.carbonFootprintScore,
  }));

  return (
    <DataCard title="Green Index Breakdown — Top 5 Organizations" headerAction={<Badge variant="success" size="sm">Live</Badge>}>
      <BarChart
        data={chartData}
        xKey="name"
        yKey="air"
        color="#10b981"
        height={280}
      />
    </DataCard>
  );
}

function ESGScorecard({ esgReports: reports }: { esgReports: typeof esgReports }) {
  const top3 = reports.slice(0, 3);

  const pieData = top3.map((r) => ({
    name: r.organizationName.split(' ').slice(0, 2).join(' '),
    value: r.overallESGScore,
  }));

  return (
    <DataCard title="ESG Performance Overview" headerAction={<Badge variant="info" size="sm">Q2 2026</Badge>}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <PieChart data={pieData} height={220} />
        </div>
        <div className="space-y-3">
          {top3.map((report) => (
            <div key={report.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                report.complianceStatus === 'compliant' ? 'bg-emerald-100 text-emerald-600' :
                report.complianceStatus === 'partial' ? 'bg-amber-100 text-amber-600' :
                'bg-red-100 text-red-600'
              }`}>
                {report.complianceStatus === 'compliant' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{report.organizationName}</p>
                <p className="text-xs text-gray-500">{report.period} · ESG {report.overallESGScore}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-700">
                  E:{report.environmentalScore} S:{report.socialScore} G:{report.governanceScore}
                </p>
                {report.verified && <CheckCircle className="mx-auto mt-0.5 h-3 w-3 text-emerald-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DataCard>
  );
}

function QuickMetrics({ greenIndexData: gData, esgReports: eReports }: { greenIndexData: GreenIndex[]; esgReports: typeof esgReports }) {
  const avgScore = (gData[0]?.overallScore || 0);
  const avgEsg = (eReports[0]?.overallESGScore || 0);
  const totalEmissions = eReports.reduce((sum, r) => sum + r.carbonEmissions, 0);
  const totalRenewable = eReports.reduce((sum, r) => sum + r.renewableEnergyPercent, 0) / eReports.length;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
        <div className="flex items-center gap-2 text-gray-500">
          <Gauge className="h-4 w-4" />
          <span className="text-xs font-medium">Avg Green Index</span>
        </div>
        <p className="mt-2 text-xl font-semibold text-gray-900">{avgScore.toFixed(1)}</p>
        <p className="mt-0.5 text-xs text-emerald-600 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> +2.3%
        </p>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
        <div className="flex items-center gap-2 text-gray-500">
          <Target className="h-4 w-4" />
          <span className="text-xs font-medium">Avg ESG Score</span>
        </div>
        <p className="mt-2 text-xl font-semibold text-gray-900">{avgEsg.toFixed(1)}</p>
        <p className="mt-0.5 text-xs text-emerald-600 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> +1.8%
        </p>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
        <div className="flex items-center gap-2 text-gray-500">
          <Flame className="h-4 w-4" />
          <span className="text-xs font-medium">Total Emissions</span>
        </div>
        <p className="mt-2 text-xl font-semibold text-gray-900">{(totalEmissions / 1000).toFixed(1)}k</p>
        <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
          <Flame className="h-3 w-3" /> tonnes CO2e
        </p>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
        <div className="flex items-center gap-2 text-gray-500">
          <Zap className="h-4 w-4" />
          <span className="text-xs font-medium">Renewable %</span>
        </div>
        <p className="mt-2 text-xl font-semibold text-gray-900">{totalRenewable.toFixed(0)}%</p>
        <p className="mt-0.5 text-xs text-emerald-600 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> +5.2%
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const recentAlerts = environmentalAlerts.slice(0, 5);
  const quickSensors = sensors.slice(0, 6);
  const topOrgs = organizations.slice(0, 5);
  const topGreenIndex = greenIndexData.slice(0, 5);
  const topEsg = esgReports.slice(0, 3);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {today}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            System Online
          </Badge>
          <Badge variant="info" size="md">
            Demo Data
          </Badge>
        </div>
      </div>

      {/* Quick Metrics Row */}
      <QuickMetrics greenIndexData={topGreenIndex} esgReports={topEsg} />

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Sensors"
          value={dashboardStats.activeSensors}
          change={8.2}
          icon={<Radio className="h-5 w-5" />}
          color="emerald"
          subtitle="of 12 total"
        />
        <StatCard
          title="Environmental Readings"
          value={formatNumber(dashboardStats.totalReadings)}
          change={12.5}
          icon={<Activity className="h-5 w-5" />}
          color="blue"
          subtitle="last 24 hours"
        />
        <StatCard
          title="Active Alerts"
          value={dashboardStats.activeAlerts}
          change={-15.3}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="amber"
          subtitle="needs attention"
        />
        <StatCard
          title="Blockchain Verified"
          value={formatNumber(dashboardStats.blockchainVerified)}
          change={5.7}
          icon={<ShieldCheck className="h-5 w-5" />}
          color="purple"
          subtitle="readings verified"
        />
        <StatCard
          title="Carbon Credits"
          value={formatNumber(dashboardStats.carbonCredits, 1)}
          change={3.2}
          icon={<Flame className="h-5 w-5" />}
          color="amber"
          subtitle="tonnes CO2e"
        />
        <StatCard
          title="AI Recommendations"
          value={dashboardStats.aiRecommendations}
          change={18.7}
          icon={<Target className="h-5 w-5" />}
          color="blue"
          subtitle="pending review"
        />
        <StatCard
          title="System Uptime"
          value={`${dashboardStats.uptimePercent}%`}
          change={0.5}
          icon={<Activity className="h-5 w-5" />}
          color="emerald"
          subtitle="last 30 days"
        />
        <StatCard
          title="Organizations"
          value={organizations.length}
          change={12.0}
          icon={<Building2 className="h-5 w-5" />}
          color="purple"
          subtitle="registered companies"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataCard title="Air Quality Trend (24h)">
          <AreaChart
            data={chartData.airQualityTrend}
            xKey="time"
            yKey="value"
            color="#10b981"
            height={280}
          />
        </DataCard>
        <DataCard title="CO2 Levels (24h)">
          <LineChart
            data={chartData.co2Levels}
            xKey="time"
            yKey="value"
            color="#f59e0b"
            height={280}
          />
        </DataCard>
      </div>

      {/* Green Index Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GreenIndexBreakdown data={topGreenIndex} />
        <ESGScorecard esgReports={topEsg} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Company Leaderboard */}
        <DataCard title="Company Rankings" className="lg:col-span-1">
          <div className="space-y-2">
            {topOrgs.map((org, index) => (
              <OrganizationCard
                key={org.id}
                org={org}
                greenIndex={topGreenIndex[index]}
                esg={topEsg[index]}
              />
            ))}
          </div>
        </DataCard>

        {/* Recent Alerts */}
        <DataCard title="Recent Alerts" className="lg:col-span-1">
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </DataCard>

        {/* Quick Sensor Status */}
        <DataCard title="Sensor Status" className="lg:col-span-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {quickSensors.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
