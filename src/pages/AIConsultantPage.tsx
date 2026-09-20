import { Brain, Bot, AlertTriangle, Zap, Shield, Droplets, Wind, ThermometerSun } from 'lucide-react'
import DataCard from '../components/ui/DataCard'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'
import AreaChart from '../components/charts/AreaChart'
import { getEnvironmentalReadings, getDashboardStats } from '../services/supabaseService'
import { environmentalReadings as _simReadings, dashboardStats as _simStats } from '../data/simulated'
import { useState, useEffect } from 'react'

const aiInsights = [
  { icon: <Wind className="h-5 w-5" />, title: 'Air Quality Degradation Pattern', description: 'AQI readings in Jakarta Pusat show a cyclical pattern correlating with rush hours. Historical data suggests a 23% increase in PM2.5 during these windows.', color: 'amber' },
  { icon: <Droplets className="h-5 w-5" />, title: 'Water Quality Recovery Trend', description: 'Ciliwung River pH levels have been stabilizing after the acidic event at 08:00. The self-recovery rate is 0.3 pH units/hour.', color: 'emerald' },
  { icon: <ThermometerSun className="h-5 w-5" />, title: 'Heat Island Effect Detected', description: 'Temperature readings in Jakarta Selatan are consistently 2.4°C above the regional average.', color: 'red' },
  { icon: <Zap className="h-5 w-5" />, title: 'Energy Optimization Opportunity', description: 'Correlation analysis reveals that peak CO2 concentrations coincide with maximum industrial energy draw.', color: 'blue' },
]

const aiRecommendations = [
  { id: 'rec-1', type: 'alert', title: 'Issue Public Air Quality Advisory', description: 'PM2.5 levels in Surabaya Timur have exceeded hazardous thresholds. Recommend immediate advisory.', confidence: 94, impact: 'critical' as const },
  { id: 'rec-2', type: 'optimization', title: 'Implement Staggered Industrial Schedules', description: 'Data shows CO2 peaks align with simultaneous industrial operations. Staggering could lower peak emissions by 18%.', confidence: 87, impact: 'high' as const },
  { id: 'rec-3', type: 'prediction', title: 'Pre-deploy Air Purification Units', description: 'Predictive model forecasts AQI exceeding 200 in Jakarta Pusat by tomorrow afternoon.', confidence: 78, impact: 'high' as const },
  { id: 'rec-4', type: 'action', title: 'Calibrate Offline Sensors', description: 'Two sensors have been offline for 24+ hours. Dispatching maintenance crews.', confidence: 99, impact: 'medium' as const },
  { id: 'rec-5', type: 'optimization', title: 'Expand Green Corridor Monitoring', description: 'Bandung Selatan consistently shows excellent air quality. Recommend additional monitoring points.', confidence: 82, impact: 'low' as const },
]

const predictedAirQuality = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  value: Math.round(140 + Math.sin(i / 3) * 35 + (i > 6 && i < 20 ? 50 : -20) + Math.random() * 15),
  label: i < 6 || i > 20 ? 'Night' : i < 12 ? 'Morning' : 'Afternoon',
}))
const predictedCO2 = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  value: Math.round(420 + Math.sin(i / 2.5) * 100 + (i > 8 && i < 18 ? 180 : 0) + Math.random() * 25),
  label: i > 8 && i < 18 ? 'Peak Hours' : 'Off Hours',
}))
const typeBadgeMap: Record<string, { variant: 'danger' | 'warning' | 'info' | 'success' }> = {
  alert: { variant: 'danger' },
  optimization: { variant: 'info' },
  prediction: { variant: 'warning' },
  action: { variant: 'success' },
}
const impactBadgeMap: Record<string, { variant: 'danger' | 'warning' | 'info' | 'success' }> = {
  critical: { variant: 'danger' },
  high: { variant: 'warning' },
  medium: { variant: 'info' },
  low: { variant: 'success' },
}

function ConfidenceMeter({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-blue-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600">{value}%</span>
    </div>
  )
}

export default function AIConsultantPage() {
  const [readings, setReadings] = useState(_simReadings)
  const [stats, setStats] = useState(_simStats)

  useEffect(() => {
    getEnvironmentalReadings().then((d) => { if (d.length > 0) setReadings(d) }).catch(() => {})
    getDashboardStats().then((d) => setStats(d)).catch(() => {})
  }, [])

  const avgAQI = readings.filter((r) => r.sensorType === 'air_quality').reduce((sum, r) => sum + r.value, 0) / 3

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Environmental Consultant</h1>
            <p className="text-sm text-gray-500">AI-Powered Environmental Analysis and Recommendations</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">AI Analysis Mode — Supabase</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Avg. AQI (Current)" value={Math.round(avgAQI)} icon={<Wind className="h-5 w-5" />} color="amber" subtitle="Jakarta Pusat" />
        <StatCard title="CO2 Level" value="625 ppm" icon={<Zap className="h-5 w-5" />} color="blue" subtitle="Jakarta Utara" />
        <StatCard title="AI Recommendations" value={aiRecommendations.length} icon={<Bot className="h-5 w-5" />} color="purple" subtitle="active suggestions" />
        <StatCard title="Sensors Online" value={`${stats.activeSensors}/12`} icon={<Shield className="h-5 w-5" />} color="emerald" subtitle={`${stats.uptimePercent}% uptime`} />
      </div>
      <DataCard title="AI Insights">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${insight.color === 'amber' ? 'bg-amber-100 text-amber-600' : insight.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : insight.color === 'red' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {insight.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DataCard>
      <DataCard title="AI Recommendations">
        <div className="space-y-4">
          {aiRecommendations.map((rec) => {
            const badge = typeBadgeMap[rec.type] ?? { variant: 'default' as const }
            const impactBadge = impactBadgeMap[rec.impact] ?? { variant: 'default' as const }
            return (
              <div key={rec.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={badge.variant} size="md">{rec.type.toUpperCase()}</Badge>
                      <h4 className="text-sm font-semibold text-gray-900">{rec.title}</h4>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{rec.description}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Badge variant={impactBadge.variant} size="sm">{rec.impact.toUpperCase()} impact</Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span>Confidence</span>
                    <span className="font-medium text-gray-700">{rec.confidence}%</span>
                  </div>
                  <ConfidenceMeter value={rec.confidence} />
                </div>
              </div>
            )
          })}
        </div>
      </DataCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataCard title="Predictive Analytics — Air Quality (Next 24h)">
          <AreaChart data={predictedAirQuality} xKey="time" yKey="value" color="#f59e0b" height={280} />
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Model predicts AQI peak of ~{Math.max(...predictedAirQuality.map((d) => d.value))} at {predictedAirQuality.reduce((max, d) => (d.value > max.value ? d : max)).time}</span>
          </div>
        </DataCard>
        <DataCard title="Predictive Analytics — CO2 Levels (Next 24h)">
          <AreaChart data={predictedCO2} xKey="time" yKey="value" color="#8b5cf6" height={280} />
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <AlertTriangle className="h-3.5 w-3.5 text-violet-500" />
            <span>CO2 may reach {Math.max(...predictedCO2.map((d) => d.value))} ppm during peak hours</span>
          </div>
        </DataCard>
      </div>
    </div>
  )
}
