import type {
  AIRecommendation,
  EnvironmentalReading,
  SensorType,
} from '../../types';
import {
  environmentalReadings,
} from '../../data/simulated';

const insightTexts = [
  'Air quality in Jakarta Pusat has been declining over the past 6 hours. Wind pattern analysis suggests pollutants are being trapped by a high-pressure system. Recommend issuing public advisory.',
  'Water pH levels in Ciliwung River are recovering after an acidic episode. Upstream industrial discharge appears to have reduced. Continue monitoring for 24 hours before resuming normal operations.',
  'PM2.5 concentrations in Surabaya have crossed hazardous thresholds. Satellite imagery confirms a regional haze event. Recommend activating emergency filtration protocols.',
  'CO2 levels in Jakarta Utara show a strong correlation with traffic patterns. Peak concentrations coincide with morning and evening rush hours. Urban planning adjustment could reduce exposure.',
  'Temperature readings across Jakarta network indicate urban heat island effect is intensifying. Green roof installations on nearby buildings could reduce local temperatures by 2-3°C.',
  'Noise pollution in Surabaya Pusat is primarily driven by construction activity. Temporal analysis shows violations concentrated between 10:00-14:00. Enforcement of quiet hours recommended.',
  'Bandung air quality is trending positive. Increased vegetation cover and reduced industrial output are contributing factors. Current trajectory suggests continued improvement over the next week.',
  'Humidity sensors in Bandung report below-normal readings. Combined with elevated temperatures, this creates fire risk conditions. Recommend issuing fire advisory for affected areas.',
];

const recommendationPool: Omit<AIRecommendation, 'id' | 'timestamp'>[] = [
  {
    type: 'optimization',
    title: 'Optimize Sensor Network Coverage',
    description: 'Analysis indicates a 15km gap in air quality monitoring between Jakarta Pusat and Jakarta Utara. Deploying an additional sensor could improve data accuracy by 23%.',
    confidence: 0.87,
    impact: 'medium',
    category: 'sensor_network',
    dataPoints: 1240,
  },
  {
    type: 'alert',
    title: 'Predicted AQI Spike in 4 Hours',
    description: 'Machine learning model forecasts an AQI increase of 35-50 points in Jakarta Pusat based on current wind patterns and emission sources.',
    confidence: 0.91,
    impact: 'high',
    category: 'air_quality',
    dataPoints: 890,
  },
  {
    type: 'prediction',
    title: 'Water Quality Recovery Timeline',
    description: 'Ciliwung River pH levels are projected to return to normal range (6.5-7.5) within 18 hours based on current dilution rates and upstream flow data.',
    confidence: 0.78,
    impact: 'medium',
    category: 'water_quality',
    dataPoints: 560,
  },
  {
    type: 'action',
    title: 'Activate Emergency Filtration',
    description: 'PM2.5 levels in Surabaya have exceeded 100 µg/m³ for three consecutive readings. Activating building filtration systems could reduce indoor exposure by 60%.',
    confidence: 0.95,
    impact: 'critical',
    category: 'pm25',
    dataPoints: 420,
  },
  {
    type: 'optimization',
    title: 'Reduce Energy Consumption During Off-Peak',
    description: 'Energy consumption data shows 18% waste during off-peak hours. Implementing automated shutdown protocols could save approximately 45,000 kWh per month.',
    confidence: 0.82,
    impact: 'medium',
    category: 'energy',
    dataPoints: 2100,
  },
  {
    type: 'prediction',
    title: 'Carbon Credit Opportunity',
    description: 'Based on current emission reduction trajectory, PT GreenForce is on track to earn 45 additional carbon credits by end of quarter if current practices continue.',
    confidence: 0.74,
    impact: 'low',
    category: 'carbon_credits',
    dataPoints: 780,
  },
  {
    type: 'action',
    title: 'Schedule Noise Compliance Review',
    description: 'Surabaya Pusat noise tracker has recorded 7 exceedances this week. Recommend immediate compliance review with nearby construction sites.',
    confidence: 0.89,
    impact: 'high',
    category: 'noise',
    dataPoints: 340,
  },
];

function computeTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (values.length < 2) return 'stable';
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const diff = (avgSecond - avgFirst) / avgFirst;
  if (diff > 0.05) return 'increasing';
  if (diff < -0.05) return 'decreasing';
  return 'stable';
}

export class AISimulation {
  private recommendations: AIRecommendation[];

  constructor() {
    this.recommendations = recommendationPool.map((r, i) => ({
      ...r,
      id: `rec-${String(i + 1).padStart(3, '0')}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000 * 12),
    }));
  }

  getRecommendations(): AIRecommendation[] {
    return [...this.recommendations];
  }

  analyzeData(readings: EnvironmentalReading[]): {
    averageValue: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    readingCount: number;
    uniqueSensors: number;
    dominantQuality: EnvironmentalReading['quality'];
    summary: string;
  } {
    if (readings.length === 0) {
      return {
        averageValue: 0,
        trend: 'stable',
        readingCount: 0,
        uniqueSensors: 0,
        dominantQuality: 'good',
        summary: 'No readings available for analysis.',
      };
    }

    const values = readings.map((r) => r.value);
    const averageValue = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
    const trend = computeTrend(values);

    const uniqueSensors = new Set(readings.map((r) => r.sensorId)).size;

    const qualityCounts: Record<string, number> = {};
    for (const r of readings) {
      qualityCounts[r.quality] = (qualityCounts[r.quality] || 0) + 1;
    }
    const dominantQuality = Object.entries(qualityCounts).sort((a, b) => b[1] - a[1])[0][0] as EnvironmentalReading['quality'];

    const typeBreakdown = new Map<SensorType, number[]>();
    for (const r of readings) {
      if (!typeBreakdown.has(r.sensorType)) typeBreakdown.set(r.sensorType, []);
      typeBreakdown.get(r.sensorType)!.push(r.value);
    }

    const summaryParts = [
      `Analyzed ${readings.length} readings from ${uniqueSensors} sensor(s).`,
      `Overall trend is ${trend}.`,
      `Dominant quality: ${dominantQuality}.`,
    ];

    for (const [type, vals] of typeBreakdown) {
      const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
      summaryParts.push(`${type}: avg ${avg}`);
    }

    return {
      averageValue,
      trend,
      readingCount: readings.length,
      uniqueSensors,
      dominantQuality,
      summary: summaryParts.join(' '),
    };
  }

  predictTrend(metric: SensorType, hours: number): { time: string; predicted: number; confidence: number }[] {
    const relevant = environmentalReadings.filter((r) => r.sensorType === metric);
    const predictions: { time: string; predicted: number; confidence: number }[] = [];

    const baseValue =
      relevant.length > 0
        ? relevant.reduce((a, r) => a + r.value, 0) / relevant.length
        : 50;

    const trend = relevant.length > 1 ? computeTrend(relevant.map((r) => r.value)) : 'stable';
    const trendDelta = trend === 'increasing' ? 2.5 : trend === 'decreasing' ? -2.5 : 0;

    for (let h = 1; h <= hours; h++) {
      const time = new Date(Date.now() + h * 3600000);
      const predicted = Math.round((baseValue + trendDelta * h + (Math.random() - 0.5) * 5) * 100) / 100;
      const confidence = Math.max(0.4, 0.95 - h * 0.04);

      predictions.push({
        time: time.toISOString(),
        predicted,
        confidence: Math.round(confidence * 100) / 100,
      });
    }

    return predictions;
  }

  getEnvironmentalInsights(): string[] {
    return insightTexts;
  }
}
