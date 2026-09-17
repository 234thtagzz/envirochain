import type { AIRecommendation, EnvironmentalReading, SensorType } from '../../types';
import { AISimulation } from '../simulation/aiSimulation';
import { environmentalReadings } from '../../data/simulated';

class AIService {
  private aiSimulation: AISimulation;

  constructor() {
    this.aiSimulation = new AISimulation();
  }

  getRecommendations(): AIRecommendation[] {
    return this.aiSimulation.getRecommendations();
  }

  analyzeData(readings?: EnvironmentalReading[]) {
    return this.aiSimulation.analyzeData(readings ?? environmentalReadings);
  }

  predictTrend(metric: SensorType, hours: number) {
    return this.aiSimulation.predictTrend(metric, hours);
  }

  getInsights(): string[] {
    return this.aiSimulation.getEnvironmentalInsights();
  }
}

export const aiService = new AIService();
