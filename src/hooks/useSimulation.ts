import { useState, useEffect, useCallback } from 'react';
import type {
  EnvironmentalReading,
  EnvironmentalAlert,
  DashboardStats,
  SensorType,
} from '../types';
import { sensors, environmentalReadings, environmentalAlerts, dashboardStats } from '../data/simulated';

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
};

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
};

function getQuality(
  type: SensorType,
  value: number
): EnvironmentalReading['quality'] {
  const [min, max] = sensorRanges[type];
  const ratio = (value - min) / (max - min);
  if (ratio <= 0.2) return 'excellent';
  if (ratio <= 0.4) return 'good';
  if (ratio <= 0.65) return 'moderate';
  if (ratio <= 0.85) return 'poor';
  return 'hazardous';
}

function randomHexHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
}

function generateReading(): EnvironmentalReading {
  const onlineSensors = sensors.filter((s) => s.status === 'online');
  const sensor = onlineSensors[Math.floor(Math.random() * onlineSensors.length)];
  const [min, max] = sensorRanges[sensor.type];
  const raw = min + Math.random() * (max - min);
  const value = Math.round(raw * 100) / 100;

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
  };
}

function computeStats(readings: EnvironmentalReading[]): DashboardStats {
  const now = Date.now();
  const recent = readings.filter(
    (r) => now - r.timestamp.getTime() < 2 * 60 * 60 * 1000
  );
  const verified = recent.filter((r) => r.verified).length;
  const activeSensors = sensors.filter((s) => s.status === 'online').length;

  return {
    activeSensors,
    totalReadings: readings.length,
    activeAlerts: environmentalAlerts.filter((a) => !a.acknowledged).length,
    greenIndex: 75.2,
    blockchainVerified: verified,
    carbonCredits: 1513.4,
    aiRecommendations: 7,
    uptimePercent: Math.round((activeSensors / sensors.length) * 1000) / 10,
  };
}

export function useSimulation() {
  const [readings, setReadings] = useState<EnvironmentalReading[]>(environmentalReadings);
  const [alerts] = useState<EnvironmentalAlert[]>(environmentalAlerts);
  const [stats, setStats] = useState<DashboardStats>(dashboardStats);
  const [isLive, setIsLive] = useState(false);

  const toggleLive = useCallback(() => {
    setIsLive((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newReading = generateReading();
      setReadings((prev) => {
        const updated = [newReading, ...prev];
        setStats(computeStats(updated));
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  return { readings, alerts, stats, isLive, toggleLive };
}
