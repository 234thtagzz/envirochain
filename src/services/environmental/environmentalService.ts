import type {
  EnvironmentalReading,
  EnvironmentalAlert,
  Sensor,
  DashboardStats,
  ChartDataPoint,
} from '../../types';
import { sensors, dashboardStats, chartData } from '../../data/simulated';
import { SensorSimulation } from '../simulation/sensorSimulation';

type RealtimeCallback = (reading: EnvironmentalReading) => void;

class EnvironmentalService {
  private sensorSimulation: SensorSimulation;

  constructor() {
    this.sensorSimulation = new SensorSimulation();
  }

  getReadings(): EnvironmentalReading[] {
    return this.sensorSimulation.getReadings();
  }

  getAlerts(): EnvironmentalAlert[] {
    return this.sensorSimulation.getAlerts();
  }

  getSensors(): Sensor[] {
    return [...sensors];
  }

  getDashboardStats(): DashboardStats {
    return { ...dashboardStats };
  }

  getChartData(type: keyof typeof chartData): ChartDataPoint[] {
    const data = chartData[type];
    if (!data) return [];
    return [...data];
  }

  subscribeToRealtime(callback: RealtimeCallback): () => void {
    return this.sensorSimulation.subscribeToUpdates(callback);
  }
}

export const environmentalService = new EnvironmentalService();
