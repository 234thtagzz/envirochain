import { supabase } from '../lib/supabase'
import type {
  Sensor,
  EnvironmentalReading,
  EnvironmentalAlert,
  GreenIndex,
  ESGReport,
  GreenLedgerEntry,
  Organization,
  DashboardStats,
  AIRecommendation,
  ChartDataPoint,
} from '../types'

// Re-export supabase untuk kompatibilitas import dari service ini
export { supabase }

export async function getSensors(): Promise<Sensor[]> {
  const { data, error } = await supabase.from('sensors').select('*').order('name')
  if (error) return []
  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    status: row.status,
    lastReading: new Date(row.created_at),
    organizationId: row.organization_id,
  }))
}

export async function getEnvironmentalReadings(): Promise<EnvironmentalReading[]> {
  const { data, error } = await supabase
    .from('environmental_readings')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100)
  if (error) return []
  return data.map((row: any) => ({
    id: row.id,
    sensorId: row.sensor_id,
    sensorName: row.sensor_name,
    sensorType: row.sensor_type,
    value: Number(row.value),
    unit: row.unit,
    timestamp: new Date(row.timestamp),
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    quality: row.quality,
    verified: row.verified,
    blockchainHash: row.blockchain_hash || undefined,
  }))
}

export async function getEnvironmentalAlerts(): Promise<EnvironmentalAlert[]> {
  const { data, error } = await supabase
    .from('environmental_alerts')
    .select('*')
    .order('timestamp', { ascending: false })
  if (error) return []
  return data.map((row: any) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    sensorId: row.sensor_id,
    sensorName: row.sensor_name,
    value: Number(row.value),
    threshold: Number(row.threshold),
    unit: row.unit,
    timestamp: new Date(row.timestamp),
    acknowledged: row.acknowledged,
    location: row.location,
  }))
}

export async function getOrganizations(): Promise<Organization[]> {
  const { data, error } = await supabase.from('organizations').select('*').order('name')
  if (error) return []
  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    industry: row.industry,
    greenIndexScore: 0,
    totalCarbonCredits: 0,
    totalEmissionsOffset: 0,
    verifiedReports: 0,
    rank: 0,
  }))
}

export async function getGreenIndexData(): Promise<GreenIndex[]> {
  const { data, error } = await supabase
    .from('green_index_scores')
    .select('*')
    .order('rank')
  if (error) return []
  return data.map((row: any) => ({
    id: row.id,
    organizationId: row.organization_id,
    organizationName: row.organization_name,
    overallScore: row.overall_score,
    airQualityScore: row.air_quality_score,
    waterQualityScore: row.water_quality_score,
    wasteManagementScore: row.waste_management_score,
    energyEfficiencyScore: row.energy_efficiency_score,
    biodiversityScore: row.biodiversity_score,
    carbonFootprintScore: row.carbon_footprint_score,
    timestamp: new Date(row.scored_at),
    rank: row.rank,
    trend: row.trend,
  }))
}

export async function getESGReports(): Promise<ESGReport[]> {
  const { data, error } = await supabase
    .from('esg_reports')
    .select('*')
    .order('generated_at', { ascending: false })
  if (error) return []
  return data.map((row: any) => ({
    id: row.id,
    organizationId: row.organization_id,
    organizationName: row.organization_name,
    period: row.period,
    environmentalScore: row.environmental_score,
    socialScore: row.social_score,
    governanceScore: row.governance_score,
    overallESGScore: row.overall_esg_score,
    carbonEmissions: row.carbon_emissions,
    energyConsumption: row.energy_consumption,
    waterUsage: row.water_usage,
    wasteGenerated: row.waste_generated,
    renewableEnergyPercent: row.renewable_energy_percent,
    complianceStatus: row.compliance_status,
    generatedAt: new Date(row.generated_at),
    verified: row.verified,
  }))
}

export async function getGreenLedgerEntries(): Promise<GreenLedgerEntry[]> {
  const { data, error } = await supabase
    .from('green_ledger_entries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data.map((row: any) => ({
    id: row.id,
    transactionHash: row.transaction_hash,
    timestamp: new Date(row.created_at),
    type: row.type,
    amount: Number(row.amount),
    unit: row.unit,
    organizationId: row.organization_id,
    organizationName: row.organization_name,
    verified: row.verified,
    blockIndex: row.block_index,
    description: row.description,
  }))
}

export async function getAIRecommendations(): Promise<AIRecommendation[]> {
  const { data, error } = await supabase
    .from('ai_recommendations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data.map((row: any) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    confidence: Number(row.confidence),
    impact: row.impact,
    category: row.category,
    timestamp: new Date(row.created_at),
    dataPoints: row.data_points,
  }))
}

export async function getEnvironmentalInsights(): Promise<string[]> {
  const { data, error } = await supabase.from('environmental_insights').select('insight')
  if (error) return []
  return data.map((row: any) => row.insight)
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data, error } = await supabase.from('dashboard_stats').select('*').single()
  if (error) return getDefaultDashboardStats()
  return {
    activeSensors: data.active_sensors || 0,
    totalReadings: data.total_readings || 0,
    activeAlerts: data.active_alerts || 0,
    greenIndex: data.green_index || 0,
    blockchainVerified: data.blockchain_verified || 0,
    carbonCredits: data.carbon_credits || 0,
    aiRecommendations: data.ai_recommendations || 0,
    uptimePercent: data.uptime_percent || 0,
  }
}

export async function getChartData(type: string): Promise<ChartDataPoint[]> {
  const readings = await getEnvironmentalReadings()
  const now = new Date()
  const filtered = readings.filter((r) => {
    const diff = (now.getTime() - r.timestamp.getTime()) / (1000 * 60 * 60)
    return diff < 24
  })

  const buckets: Record<string, ChartDataPoint[]> = {
    airQualityTrend: filtered.filter((r) => r.sensorType === 'air_quality').map((r) => ({
      time: r.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: r.value,
      label: r.quality,
    })),
    waterQualityTrend: filtered.filter((r) => r.sensorType === 'water_quality').map((r) => ({
      time: r.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: r.value,
      label: r.quality,
    })),
    co2Levels: filtered.filter((r) => r.sensorType === 'co2').map((r) => ({
      time: r.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: r.value,
      label: r.quality,
    })),
    energyConsumption: filtered.map((r) => ({
      time: r.location,
      value: r.value,
      label: r.sensorType,
    })),
  }

  return buckets[type] || []
}

function getDefaultDashboardStats(): DashboardStats {
  return {
    activeSensors: 0,
    totalReadings: 0,
    activeAlerts: 0,
    greenIndex: 0,
    blockchainVerified: 0,
    carbonCredits: 0,
    aiRecommendations: 0,
    uptimePercent: 0,
  }
}

export async function acknowledgeAlert(id: string): Promise<void> {
  await supabase.from('environmental_alerts').update({ acknowledged: true }).eq('id', id)
}

export async function getActiveSensorsCount(): Promise<number> {
  const { count } = await supabase.from('sensors').select('*', { count: 'exact', head: true }).eq('status', 'online')
  return count || 0
}

export async function signUp(email: string, password: string, fullName: string, organization: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        organization,
        role: 'viewer',
      },
    },
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fallback berbasis auth metadata - dipakai jika query profiles gagal (RLS 403 / row belum ada)
  const fallback = {
    id: user.id,
    email: user.email || '',
    name: (user.user_metadata as any)?.full_name || user.email?.split('@')[0] || 'User',
    organization: (user.user_metadata as any)?.organization || '',
    role: (user.user_metadata as any)?.role || 'viewer',
  }

  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('auth_id', user.id).maybeSingle()

    if (error) {
      console.error('getProfile error:', error.message, error)
      return fallback
    }

    if (!data) {
      // Profile belum ada (user dibuat sebelum trigger handle_new_user) -> coba auto-create
      console.warn('getProfile: profile not found, creating fallback profile for', user.id)
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.email || user.id,
          auth_id: user.id,
          email: user.email || '',
          full_name: fallback.name,
          organization: fallback.organization,
          role: fallback.role,
        })
        .select()
        .maybeSingle()

      if (insertError) {
        console.error('getProfile auto-create failed:', insertError.message)
        return fallback
      }
      if (inserted) {
        return {
          id: inserted.id,
          email: inserted.email,
          name: inserted.full_name,
          organization: inserted.organization,
          role: inserted.role,
        }
      }
      return fallback
    }

    return {
      id: data.id,
      email: data.email,
      name: data.full_name,
      organization: data.organization,
      role: data.role,
    }
  } catch (e) {
    console.error('getProfile exception:', e)
    return fallback
  }
}
