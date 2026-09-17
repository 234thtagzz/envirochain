export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'maintenance';
  lastReading: Date;
  organizationId: string;
}

export type SensorType =
  | 'air_quality'
  | 'water_quality'
  | 'soil'
  | 'noise'
  | 'temperature'
  | 'humidity'
  | 'co2'
  | 'pm25'
  | 'radiation';

export interface EnvironmentalReading {
  id: string;
  sensorId: string;
  sensorName: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  timestamp: Date;
  location: string;
  latitude: number;
  longitude: number;
  quality: 'excellent' | 'good' | 'moderate' | 'poor' | 'hazardous';
  verified: boolean;
  blockchainHash?: string;
}

export interface EnvironmentalAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  sensorId: string;
  sensorName: string;
  value: number;
  threshold: number;
  unit: string;
  timestamp: Date;
  acknowledged: boolean;
  location: string;
}

export interface BlockchainBlock {
  index: number;
  timestamp: Date;
  data: EnvironmentalReading[];
  previousHash: string;
  hash: string;
  nonce: number;
  verified: boolean;
  validator: string;
}

export interface AIRecommendation {
  id: string;
  type: 'optimization' | 'alert' | 'prediction' | 'action';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  timestamp: Date;
  dataPoints: number;
}

export interface GreenIndex {
  id: string;
  organizationId: string;
  organizationName: string;
  overallScore: number;
  airQualityScore: number;
  waterQualityScore: number;
  wasteManagementScore: number;
  energyEfficiencyScore: number;
  biodiversityScore: number;
  carbonFootprintScore: number;
  timestamp: Date;
  rank: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface ESGReport {
  id: string;
  organizationId: string;
  organizationName: string;
  period: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallESGScore: number;
  carbonEmissions: number;
  energyConsumption: number;
  waterUsage: number;
  wasteGenerated: number;
  renewableEnergyPercent: number;
  complianceStatus: 'compliant' | 'partial' | 'non_compliant';
  generatedAt: Date;
  verified: boolean;
}

export interface GreenLedgerEntry {
  id: string;
  transactionHash: string;
  timestamp: Date;
  type: 'carbon_credit' | 'emission_offset' | 'renewable_energy' | 'waste_reduction' | 'water_saving';
  amount: number;
  unit: string;
  organizationId: string;
  organizationName: string;
  verified: boolean;
  blockIndex: number;
  description: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  greenIndexScore: number;
  totalCarbonCredits: number;
  totalEmissionsOffset: number;
  verifiedReports: number;
  rank: number;
}

export interface DashboardStats {
  activeSensors: number;
  totalReadings: number;
  activeAlerts: number;
  greenIndex: number;
  blockchainVerified: number;
  carbonCredits: number;
  aiRecommendations: number;
  uptimePercent: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: 'admin' | 'analyst' | 'viewer';
}
