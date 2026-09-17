import type {
  Sensor,
  SensorType,
  EnvironmentalReading,
  EnvironmentalAlert,
} from '../../types';
import {
  sensors,
  environmentalReadings,
  environmentalAlerts,
} from '../../data/simulated';

type UpdateCallback = (reading: EnvironmentalReading) => void;

const sensorRanges: Record<SensorType, { min: number; max: number; unit: string; decimals: number }> = {
  air_quality: { min: 0, max: 300, unit: 'AQI', decimals: 0 },
  water_quality: { min: 4.0, max: 9.0, unit: 'pH', decimals: 1 },
  soil: { min: 0, max: 100, unit: '%', decimals: 1 },
  noise: { min: 30, max: 120, unit: 'dB', decimals: 1 },
  temperature: { min: 15, max: 45, unit: '°C', decimals: 1 },
  humidity: { min: 20, max: 100, unit: '%', decimals: 1 },
  co2: { min: 300, max: 1200, unit: 'ppm', decimals: 0 },
  pm25: { min: 0, max: 200, unit: 'µg/m³', decimals: 1 },
  radiation: { min: 0, max: 500, unit: 'µSv/h', decimals: 2 },
};

function getQualityForValue(type: SensorType, value: number): EnvironmentalReading['quality'] {
  const ranges = sensorRanges[type];
  const pct = (value - ranges.min) / (ranges.max - ranges.min);
  if (pct < 0.2) return 'excellent';
  if (pct < 0.4) return 'good';
  if (pct < 0.6) return 'moderate';
  if (pct < 0.8) return 'poor';
  return 'hazardous';
}

function generateReadingValue(type: SensorType): number {
  const { min, max, decimals } = sensorRanges[type];
  const value = min + Math.random() * (max - min);
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}


export class SensorSimulation {
  private readings: EnvironmentalReading[];
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.readings = [...environmentalReadings];
  }

  getReadings(): EnvironmentalReading[] {
    return [...this.readings];
  }

  getSensorById(id: string): Sensor | undefined {
    return sensors.find((s) => s.id === id);
  }

  getAlerts(): EnvironmentalAlert[] {
    return [...environmentalAlerts];
  }

  getUnacknowledgedAlertCount(): number {
    return environmentalAlerts.filter((a) => !a.acknowledged).length;
  }

  simulateNewReading(): EnvironmentalReading {
    const onlineSensors = sensors.filter((s) => s.status === 'online');
    const sensor = onlineSensors[Math.floor(Math.random() * onlineSensors.length)];
    const value = generateReadingValue(sensor.type);

    const reading: EnvironmentalReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sensorId: sensor.id,
      sensorName: sensor.name,
      sensorType: sensor.type,
      value,
      unit: sensorRanges[sensor.type].unit,
      timestamp: new Date(),
      location: sensor.location,
      latitude: sensor.latitude,
      longitude: sensor.longitude,
      quality: getQualityForValue(sensor.type, value),
      verified: Math.random() > 0.1,
    };

    this.readings.unshift(reading);
    return reading;
  }

  subscribeToUpdates(callback: UpdateCallback): () => void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      const reading = this.simulateNewReading();
      callback(reading);
    }, 3000);

    return () => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    };
  }
}
