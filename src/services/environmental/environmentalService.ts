import { supabase } from '../supabaseService'
import type { EnvironmentalReading, EnvironmentalAlert, Sensor, DashboardStats, ChartDataPoint } from '../../types'
import { sensors as _simSensors } from '../../data/simulated'

type RealtimeCallback = (reading: EnvironmentalReading) => void

class EnvironmentalService {
  private realtimeChannel: ReturnType<typeof supabase.channel> | null = null

  async getReadings(): Promise<EnvironmentalReading[]> {
    const { data } = await supabase.from('environmental_readings').select('*').order('timestamp', { ascending: false }).limit(100)
    if (data) return data.map((row: any) => ({
      id: row.id, sensorId: row.sensor_id, sensorName: row.sensor_name, sensorType: row.sensor_type,
      value: Number(row.value), unit: row.unit, timestamp: new Date(row.timestamp),
      location: row.location, latitude: row.latitude, longitude: row.longitude,
      quality: row.quality, verified: row.verified, blockchainHash: row.blockchain_hash || undefined,
    }))
    return []
  }

  async getAlerts(): Promise<EnvironmentalAlert[]> {
    const { data } = await supabase.from('environmental_alerts').select('*').order('timestamp', { ascending: false })
    if (data) return data.map((row: any) => ({
      id: row.id, type: row.type, title: row.title, message: row.message,
      sensorId: row.sensor_id, sensorName: row.sensor_name, value: Number(row.value),
      threshold: Number(row.threshold), unit: row.unit, timestamp: new Date(row.timestamp),
      acknowledged: row.acknowledged, location: row.location,
    }))
    return []
  }

  async getSensors(): Promise<Sensor[]> {
    const { data } = await supabase.from('sensors').select('*').order('name')
    if (data) return data.map((row: any) => ({
      id: row.id, name: row.name, type: row.type, location: row.location,
      latitude: row.latitude, longitude: row.longitude, status: row.status,
      lastReading: new Date(row.created_at), organizationId: row.organization_id,
    }))
    return [..._simSensors]
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await supabase.from('dashboard_stats').select('*').single()
    if (data) return { activeSensors: data.active_sensors || 0, totalReadings: data.total_readings || 0, activeAlerts: data.active_alerts || 0, greenIndex: data.green_index || 0, blockchainVerified: data.blockchain_verified || 0, carbonCredits: data.carbon_credits || 0, aiRecommendations: data.ai_recommendations || 0, uptimePercent: data.uptime_percent || 0 }
    return { activeSensors: 0, totalReadings: 0, activeAlerts: 0, greenIndex: 0, blockchainVerified: 0, carbonCredits: 0, aiRecommendations: 0, uptimePercent: 0 }
  }

  async getChartData(_type: string): Promise<ChartDataPoint[]> {
    const readings = await this.getReadings()
    const now = new Date()
    return readings.filter((r) => (now.getTime() - r.timestamp.getTime()) / (1000 * 60 * 60) < 24).map((r) => ({ time: r.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), value: r.value, label: r.quality }))
  }

  subscribeToRealtime(callback: RealtimeCallback): () => void {
    this.realtimeChannel = supabase.channel('envirochain-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'environmental_readings' }, (payload: any) => {
        const row = payload.new as any
        callback({ id: row.id, sensorId: row.sensor_id, sensorName: row.sensor_name, sensorType: row.sensor_type, value: Number(row.value), unit: row.unit, timestamp: new Date(row.timestamp), location: row.location, latitude: row.latitude, longitude: row.longitude, quality: row.quality, verified: row.verified, blockchainHash: row.blockchain_hash || undefined })
      })
      .subscribe()
    return () => { if (this.realtimeChannel) { supabase.removeChannel(this.realtimeChannel); this.realtimeChannel = null } }
  }

  async acknowledgeAlert(id: string): Promise<void> {
    await supabase.from('environmental_alerts').update({ acknowledged: true }).eq('id', id)
  }

  async getActiveSensorsCount(): Promise<number> {
    const { count } = await supabase.from('sensors').select('*', { count: 'exact', head: true }).eq('status', 'online')
    return count || 0
  }
}

export const environmentalService = new EnvironmentalService()
