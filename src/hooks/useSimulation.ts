import { useState, useEffect, useCallback } from 'react'
import { getEnvironmentalReadings as _getReadings, getEnvironmentalAlerts as _getAlerts, getDashboardStats as _getStats, getActiveSensorsCount as _getActiveCount } from '../services/supabaseService'
import type { EnvironmentalReading, EnvironmentalAlert, DashboardStats } from '../types'
import { sensors as _simSensors, environmentalReadings as _simReadings, environmentalAlerts as _simAlerts, dashboardStats as _simStats } from '../data/simulated'
import type { SensorType } from '../types'

const readingUnits: Record<SensorType, string> = {
  air_quality: 'AQI',
  water_quality: 'pH',
  soil: 'µS/cm',
  noise: 'dB',
  temperature: '°C',
  humidity: '%',
  co2: 'ppm',
  pm25: 'µg/m³',
  radiation: 'µSv/h',
}

const sensorRanges: Record<SensorType, [number, number]> = {
  air_quality: [30, 250],
  water_quality: [5.5, 8.0],
  soil: [100, 800],
  noise: [40, 95],
  temperature: [25, 38],
  humidity: [40, 95],
  co2: [350, 900],
  pm25: [10, 150],
  radiation: [0.05, 0.5],
}

function getQuality(type: SensorType, value: number): EnvironmentalReading['quality'] {
  const [min, max] = sensorRanges[type]
  const ratio = (value - min) / (max - min)
  if (ratio <= 0.2) return 'excellent'
  if (ratio <= 0.4) return 'good'
  if (ratio <= 0.65) return 'moderate'
  if (ratio <= 0.85) return 'poor'
  return 'hazardous'
}

function randomHexHash(): string {
  const chars = '0123456789abcdef'
  let hash = '0x'
  for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * 16)]
  return hash
}

function generateReading(): EnvironmentalReading {
  const sensor = _simSensors.filter((s) => s.status === 'online')[Math.floor(Math.random() * _simSensors.filter((s) => s.status === 'online').length)]
  const [min, max] = sensorRanges[sensor.type]
  const raw = min + Math.random() * (max - min)
  const value = Math.round(raw * 100) / 100
  return {
    id: `reading-live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sensorId: sensor.id,
    sensorName: sensor.name,
    sensorType: sensor.type,
    value,
    unit: readingUnits[sensor.type],
    timestamp: new Date(),
    location: sensor.location,
    latitude: sensor.latitude,
    longitude: sensor.longitude,
    quality: getQuality(sensor.type, value),
    verified: Math.random() > 0.15,
    blockchainHash: Math.random() > 0.15 ? randomHexHash() : undefined,
  }
}

function computeStats(readings: EnvironmentalReading[]): DashboardStats {
  const now = Date.now()
  const recent = readings.filter((r) => now - r.timestamp.getTime() < 2 * 60 * 60 * 1000)
  const verified = recent.filter((r) => r.verified).length
  const activeSensors = _simSensors.filter((s) => s.status === 'online').length
  return {
    activeSensors,
    totalReadings: readings.length,
    activeAlerts: _simAlerts.filter((a) => !a.acknowledged).length,
    greenIndex: 75.2,
    blockchainVerified: verified,
    carbonCredits: 1513.4,
    aiRecommendations: 7,
    uptimePercent: Math.round((activeSensors / _simSensors.length) * 1000) / 10,
  }
}

export function useSimulation() {
  const [readings, setReadings] = useState<EnvironmentalReading[]>(_simReadings)
  const [alerts, setAlerts] = useState<EnvironmentalAlert[]>(_simAlerts)
  const [stats, setStats] = useState<DashboardStats>(_simStats)
  const [isLive, setIsLive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [supReadings, supAlerts, supStats, activeCount] = await Promise.all([
          _getReadings(),
          _getAlerts(),
          _getStats(),
          _getActiveCount(),
        ])
        if (supReadings.length > 0) {
          setReadings(supReadings)
        }
        if (supAlerts.length > 0) {
          setAlerts(supAlerts as EnvironmentalAlert[])
        }
        if (supStats.activeSensors > 0 || activeCount > 0) {
          setStats({
            ...supStats,
            activeSensors: supStats.activeSensors || activeCount,
          })
        }
      } catch {
        // Fallback to simulated data
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const toggleLive = useCallback(() => {
    setIsLive((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
      const newReading = generateReading()
      setReadings((prev) => {
        const updated = [newReading, ...prev]
        setStats(computeStats(updated))
        return updated
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [isLive])

  return { readings, alerts, stats, isLive, toggleLive, isLoading }
}
