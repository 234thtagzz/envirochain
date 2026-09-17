import type {
  Sensor,
  EnvironmentalReading,
  EnvironmentalAlert,
  GreenIndex,
  ESGReport,
  GreenLedgerEntry,
  Organization,
  DashboardStats,
  ChartDataPoint,
} from '../types';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
const minsAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

export const sensors: Sensor[] = [
  { id: 'sensor-001', name: 'Jakarta Central AQ Monitor', type: 'air_quality', location: 'Jakarta Pusat', latitude: -6.2088, longitude: 106.8456, status: 'online', lastReading: minsAgo(5), organizationId: 'org-001' },
  { id: 'sensor-002', name: 'Ciliwung River pH Sensor', type: 'water_quality', location: 'Jakarta Timur', latitude: -6.2297, longitude: 106.8627, status: 'online', lastReading: minsAgo(12), organizationId: 'org-002' },
  { id: 'sensor-003', name: 'Bandung Soil Monitor', type: 'soil', location: 'Bandung Barat', latitude: -6.8896, longitude: 107.6138, status: 'maintenance', lastReading: daysAgo(2), organizationId: 'org-003' },
  { id: 'sensor-004', name: 'Surabaya Noise Tracker', type: 'noise', location: 'Surabaya Pusat', latitude: -7.2575, longitude: 112.7521, status: 'online', lastReading: minsAgo(3), organizationId: 'org-004' },
  { id: 'sensor-005', name: 'Jakarta Selatan Temp Station', type: 'temperature', location: 'Jakarta Selatan', latitude: -6.2615, longitude: 106.8106, status: 'online', lastReading: minsAgo(8), organizationId: 'org-001' },
  { id: 'sensor-006', name: 'Bandung Humidity Sensor', type: 'humidity', location: 'Bandung Kota', latitude: -6.9175, longitude: 107.6191, status: 'offline', lastReading: hoursAgo(36), organizationId: 'org-005' },
  { id: 'sensor-007', name: 'Jakarta Utara CO2 Monitor', type: 'co2', location: 'Jakarta Utara', latitude: -6.1219, longitude: 106.8748, status: 'online', lastReading: minsAgo(1), organizationId: 'org-006' },
  { id: 'sensor-008', name: 'Surabaya PM2.5 Station', type: 'pm25', location: 'Surabaya Timur', latitude: -7.2575, longitude: 112.7811, status: 'online', lastReading: minsAgo(6), organizationId: 'org-007' },
  { id: 'sensor-009', name: 'Bandung Air Quality Hub', type: 'air_quality', location: 'Bandung Selatan', latitude: -7.0050, longitude: 107.5740, status: 'online', lastReading: minsAgo(4), organizationId: 'org-008' },
  { id: 'sensor-010', name: 'Jakarta Barat Water Sensor', type: 'water_quality', location: 'Jakarta Barat', latitude: -6.1681, longitude: 106.7589, status: 'maintenance', lastReading: daysAgo(1), organizationId: 'org-009' },
  { id: 'sensor-011', name: 'Surabaya Temperature Array', type: 'temperature', location: 'Surabaya Utara', latitude: -7.2395, longitude: 112.7410, status: 'online', lastReading: minsAgo(10), organizationId: 'org-010' },
  { id: 'sensor-012', name: 'Jakarta Pusat CO2 Level', type: 'co2', location: 'Jakarta Pusat', latitude: -6.1944, longitude: 106.8329, status: 'offline', lastReading: hoursAgo(48), organizationId: 'org-002' },
];

export const environmentalReadings: EnvironmentalReading[] = [
  { id: 'reading-001', sensorId: 'sensor-001', sensorName: 'Jakarta Central AQ Monitor', sensorType: 'air_quality', value: 142, unit: 'AQI', timestamp: minsAgo(5), location: 'Jakarta Pusat', latitude: -6.2088, longitude: 106.8456, quality: 'moderate', verified: true, blockchainHash: '0x7f3a8b2c1d4e5f6a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2' },
  { id: 'reading-002', sensorId: 'sensor-002', sensorName: 'Ciliwung River pH Sensor', sensorType: 'water_quality', value: 6.8, unit: 'pH', timestamp: minsAgo(12), location: 'Jakarta Timur', latitude: -6.2297, longitude: 106.8627, quality: 'good', verified: true, blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2' },
  { id: 'reading-003', sensorId: 'sensor-004', sensorName: 'Surabaya Noise Tracker', sensorType: 'noise', value: 72.3, unit: 'dB', timestamp: minsAgo(3), location: 'Surabaya Pusat', latitude: -7.2575, longitude: 112.7521, quality: 'moderate', verified: true, blockchainHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3' },
  { id: 'reading-004', sensorId: 'sensor-005', sensorName: 'Jakarta Selatan Temp Station', sensorType: 'temperature', value: 32.5, unit: '°C', timestamp: minsAgo(8), location: 'Jakarta Selatan', latitude: -6.2615, longitude: 106.8106, quality: 'good', verified: true, blockchainHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4' },
  { id: 'reading-005', sensorId: 'sensor-007', sensorName: 'Jakarta Utara CO2 Monitor', sensorType: 'co2', value: 625, unit: 'ppm', timestamp: minsAgo(1), location: 'Jakarta Utara', latitude: -6.1219, longitude: 106.8748, quality: 'moderate', verified: true, blockchainHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5' },
  { id: 'reading-006', sensorId: 'sensor-008', sensorName: 'Surabaya PM2.5 Station', sensorType: 'pm25', value: 55.2, unit: 'µg/m³', timestamp: minsAgo(6), location: 'Surabaya Timur', latitude: -7.2575, longitude: 112.7811, quality: 'moderate', verified: true },
  { id: 'reading-007', sensorId: 'sensor-009', sensorName: 'Bandung Air Quality Hub', sensorType: 'air_quality', value: 85, unit: 'AQI', timestamp: minsAgo(4), location: 'Bandung Selatan', latitude: -7.0050, longitude: 107.5740, quality: 'good', verified: true, blockchainHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6' },
  { id: 'reading-008', sensorId: 'sensor-011', sensorName: 'Surabaya Temperature Array', sensorType: 'temperature', value: 31.8, unit: '°C', timestamp: minsAgo(10), location: 'Surabaya Utara', latitude: -7.2395, longitude: 112.7410, quality: 'good', verified: false },
  { id: 'reading-009', sensorId: 'sensor-001', sensorName: 'Jakarta Central AQ Monitor', sensorType: 'air_quality', value: 178, unit: 'AQI', timestamp: minsAgo(35), location: 'Jakarta Pusat', latitude: -6.2088, longitude: 106.8456, quality: 'poor', verified: true, blockchainHash: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7' },
  { id: 'reading-010', sensorId: 'sensor-002', sensorName: 'Ciliwung River pH Sensor', sensorType: 'water_quality', value: 5.9, unit: 'pH', timestamp: minsAgo(42), location: 'Jakarta Timur', latitude: -6.2297, longitude: 106.8627, quality: 'poor', verified: true, blockchainHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8' },
  { id: 'reading-011', sensorId: 'sensor-004', sensorName: 'Surabaya Noise Tracker', sensorType: 'noise', value: 88.1, unit: 'dB', timestamp: minsAgo(55), location: 'Surabaya Pusat', latitude: -7.2575, longitude: 112.7521, quality: 'poor', verified: true, blockchainHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9' },
  { id: 'reading-012', sensorId: 'sensor-007', sensorName: 'Jakarta Utara CO2 Monitor', sensorType: 'co2', value: 810, unit: 'ppm', timestamp: minsAgo(48), location: 'Jakarta Utara', latitude: -6.1219, longitude: 106.8748, quality: 'poor', verified: true },
  { id: 'reading-013', sensorId: 'sensor-008', sensorName: 'Surabaya PM2.5 Station', sensorType: 'pm25', value: 128, unit: 'µg/m³', timestamp: minsAgo(60), location: 'Surabaya Timur', latitude: -7.2575, longitude: 112.7811, quality: 'hazardous', verified: true, blockchainHash: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0' },
  { id: 'reading-014', sensorId: 'sensor-009', sensorName: 'Bandung Air Quality Hub', sensorType: 'air_quality', value: 42, unit: 'AQI', timestamp: minsAgo(50), location: 'Bandung Selatan', latitude: -7.0050, longitude: 107.5740, quality: 'excellent', verified: true, blockchainHash: '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1' },
  { id: 'reading-015', sensorId: 'sensor-005', sensorName: 'Jakarta Selatan Temp Station', sensorType: 'temperature', value: 34.1, unit: '°C', timestamp: minsAgo(65), location: 'Jakarta Selatan', latitude: -6.2615, longitude: 106.8106, quality: 'moderate', verified: true, blockchainHash: '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2' },
  { id: 'reading-016', sensorId: 'sensor-011', sensorName: 'Surabaya Temperature Array', sensorType: 'temperature', value: 29.4, unit: '°C', timestamp: minsAgo(75), location: 'Surabaya Utara', latitude: -7.2395, longitude: 112.7410, quality: 'excellent', verified: false },
  { id: 'reading-017', sensorId: 'sensor-001', sensorName: 'Jakarta Central AQ Monitor', sensorType: 'air_quality', value: 210, unit: 'AQI', timestamp: minsAgo(90), location: 'Jakarta Pusat', latitude: -6.2088, longitude: 106.8456, quality: 'poor', verified: true, blockchainHash: '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3' },
  { id: 'reading-018', sensorId: 'sensor-002', sensorName: 'Ciliwung River pH Sensor', sensorType: 'water_quality', value: 7.2, unit: 'pH', timestamp: minsAgo(95), location: 'Jakarta Timur', latitude: -6.2297, longitude: 106.8627, quality: 'excellent', verified: true, blockchainHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4' },
  { id: 'reading-019', sensorId: 'sensor-004', sensorName: 'Surabaya Noise Tracker', sensorType: 'noise', value: 58.7, unit: 'dB', timestamp: minsAgo(100), location: 'Surabaya Pusat', latitude: -7.2575, longitude: 112.7521, quality: 'good', verified: true },
  { id: 'reading-020', sensorId: 'sensor-007', sensorName: 'Jakarta Utara CO2 Monitor', sensorType: 'co2', value: 490, unit: 'ppm', timestamp: minsAgo(105), location: 'Jakarta Utara', latitude: -6.1219, longitude: 106.8748, quality: 'good', verified: true, blockchainHash: '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5' },
  { id: 'reading-021', sensorId: 'sensor-009', sensorName: 'Bandung Air Quality Hub', sensorType: 'air_quality', value: 110, unit: 'AQI', timestamp: hoursAgo(2), location: 'Bandung Selatan', latitude: -7.0050, longitude: 107.5740, quality: 'moderate', verified: true },
  { id: 'reading-022', sensorId: 'sensor-008', sensorName: 'Surabaya PM2.5 Station', sensorType: 'pm25', value: 38.9, unit: 'µg/m³', timestamp: hoursAgo(2.5), location: 'Surabaya Timur', latitude: -7.2575, longitude: 112.7811, quality: 'good', verified: true, blockchainHash: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6' },
  { id: 'reading-023', sensorId: 'sensor-005', sensorName: 'Jakarta Selatan Temp Station', sensorType: 'temperature', value: 30.2, unit: '°C', timestamp: hoursAgo(3), location: 'Jakarta Selatan', latitude: -6.2615, longitude: 106.8106, quality: 'excellent', verified: true, blockchainHash: '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7' },
  { id: 'reading-024', sensorId: 'sensor-001', sensorName: 'Jakarta Central AQ Monitor', sensorType: 'air_quality', value: 165, unit: 'AQI', timestamp: hoursAgo(3.5), location: 'Jakarta Pusat', latitude: -6.2088, longitude: 106.8456, quality: 'poor', verified: true },
  { id: 'reading-025', sensorId: 'sensor-002', sensorName: 'Ciliwung River pH Sensor', sensorType: 'water_quality', value: 6.1, unit: 'pH', timestamp: hoursAgo(4), location: 'Jakarta Timur', latitude: -6.2297, longitude: 106.8627, quality: 'moderate', verified: true, blockchainHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8' },
  { id: 'reading-026', sensorId: 'sensor-004', sensorName: 'Surabaya Noise Tracker', sensorType: 'noise', value: 65.4, unit: 'dB', timestamp: hoursAgo(4.5), location: 'Surabaya Pusat', latitude: -7.2575, longitude: 112.7521, quality: 'moderate', verified: true, blockchainHash: '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9' },
  { id: 'reading-027', sensorId: 'sensor-007', sensorName: 'Jakarta Utara CO2 Monitor', sensorType: 'co2', value: 380, unit: 'ppm', timestamp: hoursAgo(5), location: 'Jakarta Utara', latitude: -6.1219, longitude: 106.8748, quality: 'excellent', verified: true, blockchainHash: '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0' },
  { id: 'reading-028', sensorId: 'sensor-011', sensorName: 'Surabaya Temperature Array', sensorType: 'temperature', value: 33.7, unit: '°C', timestamp: hoursAgo(5.5), location: 'Surabaya Utara', latitude: -7.2395, longitude: 112.7410, quality: 'moderate', verified: true },
  { id: 'reading-029', sensorId: 'sensor-009', sensorName: 'Bandung Air Quality Hub', sensorType: 'air_quality', value: 68, unit: 'AQI', timestamp: hoursAgo(6), location: 'Bandung Selatan', latitude: -7.0050, longitude: 107.5740, quality: 'good', verified: true, blockchainHash: '0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1' },
  { id: 'reading-030', sensorId: 'sensor-008', sensorName: 'Surabaya PM2.5 Station', sensorType: 'pm25', value: 72.1, unit: 'µg/m³', timestamp: hoursAgo(6.5), location: 'Surabaya Timur', latitude: -7.2575, longitude: 112.7811, quality: 'moderate', verified: true },
];

export const environmentalAlerts: EnvironmentalAlert[] = [
  { id: 'alert-001', type: 'critical', title: 'Hazardous PM2.5 Levels Detected', message: 'PM2.5 concentration in Surabaya Timur has exceeded hazardous threshold. Immediate action recommended.', sensorId: 'sensor-008', sensorName: 'Surabaya PM2.5 Station', value: 128, threshold: 100, unit: 'µg/m³', timestamp: minsAgo(6), acknowledged: false, location: 'Surabaya Timur' },
  { id: 'alert-002', type: 'warning', title: 'Elevated Air Quality Index', message: 'AQI in Jakarta Pusat trending upward. Consider issuing public advisory.', sensorId: 'sensor-001', sensorName: 'Jakarta Central AQ Monitor', value: 210, threshold: 200, unit: 'AQI', timestamp: minsAgo(90), acknowledged: false, location: 'Jakarta Pusat' },
  { id: 'alert-003', type: 'critical', title: 'High Noise Pollution Detected', message: 'Noise levels in Surabaya Pusat exceeded 85 dB. Potential health hazard for nearby residents.', sensorId: 'sensor-004', sensorName: 'Surabaya Noise Tracker', value: 88.1, threshold: 85, unit: 'dB', timestamp: minsAgo(55), acknowledged: true, location: 'Surabaya Pusat' },
  { id: 'alert-004', type: 'warning', title: 'CO2 Levels Rising', message: 'CO2 concentration in Jakarta Utara has been steadily increasing over the past 2 hours.', sensorId: 'sensor-007', sensorName: 'Jakarta Utara CO2 Monitor', value: 810, threshold: 800, unit: 'ppm', timestamp: minsAgo(48), acknowledged: false, location: 'Jakarta Utara' },
  { id: 'alert-005', type: 'info', title: 'Water pH Returning to Normal', message: 'Ciliwung River pH levels have recovered from acidic readings. Monitoring continues.', sensorId: 'sensor-002', sensorName: 'Ciliwung River pH Sensor', value: 7.2, threshold: 7.0, unit: 'pH', timestamp: minsAgo(95), acknowledged: true, location: 'Jakarta Timur' },
  { id: 'alert-006', type: 'warning', title: 'Sensor Offline Alert', message: 'Jakarta Pusat CO2 Level sensor has been offline for 48 hours. Maintenance required.', sensorId: 'sensor-012', sensorName: 'Jakarta Pusat CO2 Level', value: 0, threshold: 0, unit: 'status', timestamp: hoursAgo(2), acknowledged: false, location: 'Jakarta Pusat' },
  { id: 'alert-007', type: 'info', title: 'Bandung Air Quality Improving', message: 'Air quality index in Bandung Selatan has improved to excellent levels. No action needed.', sensorId: 'sensor-009', sensorName: 'Bandung Air Quality Hub', value: 42, threshold: 50, unit: 'AQI', timestamp: minsAgo(50), acknowledged: true, location: 'Bandung Selatan' },
  { id: 'alert-008', type: 'warning', title: 'Temperature Exceeding Comfort Zone', message: 'Temperature in Jakarta Selatan consistently above 33°C. Heat advisory recommended.', sensorId: 'sensor-005', sensorName: 'Jakarta Selatan Temp Station', value: 34.1, threshold: 33, unit: '°C', timestamp: minsAgo(65), acknowledged: false, location: 'Jakarta Selatan' },
];

export const greenIndexData: GreenIndex[] = [
  { id: 'gi-001', organizationId: 'org-001', organizationName: 'PT GreenForce', overallScore: 87.5, airQualityScore: 92, waterQualityScore: 85, wasteManagementScore: 88, energyEfficiencyScore: 90, biodiversityScore: 78, carbonFootprintScore: 92, timestamp: daysAgo(1), rank: 1, trend: 'improving' },
  { id: 'gi-002', organizationId: 'org-002', organizationName: 'EcoTech Industries', overallScore: 84.2, airQualityScore: 88, waterQualityScore: 82, wasteManagementScore: 80, energyEfficiencyScore: 86, biodiversityScore: 83, carbonFootprintScore: 86, timestamp: daysAgo(1), rank: 2, trend: 'improving' },
  { id: 'gi-003', organizationId: 'org-003', organizationName: 'Harmony Manufacturing', overallScore: 81.7, airQualityScore: 79, waterQualityScore: 84, wasteManagementScore: 82, energyEfficiencyScore: 78, biodiversityScore: 85, carbonFootprintScore: 82, timestamp: daysAgo(1), rank: 3, trend: 'stable' },
  { id: 'gi-004', organizationId: 'org-004', organizationName: 'CleanAir Corp', overallScore: 79.3, airQualityScore: 95, waterQualityScore: 72, wasteManagementScore: 76, energyEfficiencyScore: 80, biodiversityScore: 70, carbonFootprintScore: 83, timestamp: daysAgo(1), rank: 4, trend: 'improving' },
  { id: 'gi-005', organizationId: 'org-005', organizationName: 'Pacific Renewables', overallScore: 76.8, airQualityScore: 74, waterQualityScore: 78, wasteManagementScore: 72, energyEfficiencyScore: 92, biodiversityScore: 65, carbonFootprintScore: 80, timestamp: daysAgo(1), rank: 5, trend: 'improving' },
  { id: 'gi-006', organizationId: 'org-006', organizationName: 'Sustainable Solutions', overallScore: 74.1, airQualityScore: 70, waterQualityScore: 76, wasteManagementScore: 78, energyEfficiencyScore: 75, biodiversityScore: 72, carbonFootprintScore: 74, timestamp: daysAgo(1), rank: 6, trend: 'stable' },
  { id: 'gi-007', organizationId: 'org-007', organizationName: 'GreenVista Corp', overallScore: 71.5, airQualityScore: 68, waterQualityScore: 73, wasteManagementScore: 70, energyEfficiencyScore: 72, biodiversityScore: 76, carbonFootprintScore: 70, timestamp: daysAgo(1), rank: 7, trend: 'declining' },
  { id: 'gi-008', organizationId: 'org-008', organizationName: 'EcoHarvest', overallScore: 68.9, airQualityScore: 65, waterQualityScore: 70, wasteManagementScore: 68, energyEfficiencyScore: 69, biodiversityScore: 80, carbonFootprintScore: 62, timestamp: daysAgo(1), rank: 8, trend: 'stable' },
  { id: 'gi-009', organizationId: 'org-009', organizationName: 'BlueSky Industries', overallScore: 65.4, airQualityScore: 62, waterQualityScore: 68, wasteManagementScore: 64, energyEfficiencyScore: 66, biodiversityScore: 63, carbonFootprintScore: 69, timestamp: daysAgo(1), rank: 9, trend: 'declining' },
  { id: 'gi-010', organizationId: 'org-010', organizationName: 'NatureFirst Inc', overallScore: 62.7, airQualityScore: 58, waterQualityScore: 65, wasteManagementScore: 60, energyEfficiencyScore: 63, biodiversityScore: 74, carbonFootprintScore: 56, timestamp: daysAgo(1), rank: 10, trend: 'declining' },
];

export const esgReports: ESGReport[] = [
  { id: 'esg-001', organizationId: 'org-001', organizationName: 'PT GreenForce', period: 'Q2 2026', environmentalScore: 89, socialScore: 82, governanceScore: 91, overallESGScore: 87.3, carbonEmissions: 12500, energyConsumption: 480000, waterUsage: 95000, wasteGenerated: 3200, renewableEnergyPercent: 68, complianceStatus: 'compliant', generatedAt: daysAgo(30), verified: true },
  { id: 'esg-002', organizationId: 'org-002', organizationName: 'EcoTech Industries', period: 'Q2 2026', environmentalScore: 85, socialScore: 79, governanceScore: 88, overallESGScore: 84.0, carbonEmissions: 18200, energyConsumption: 620000, waterUsage: 110000, wasteGenerated: 4800, renewableEnergyPercent: 55, complianceStatus: 'compliant', generatedAt: daysAgo(28), verified: true },
  { id: 'esg-003', organizationId: 'org-003', organizationName: 'Harmony Manufacturing', period: 'Q2 2026', environmentalScore: 78, socialScore: 85, governanceScore: 83, overallESGScore: 82.0, carbonEmissions: 22800, energyConsumption: 780000, waterUsage: 145000, wasteGenerated: 6200, renewableEnergyPercent: 42, complianceStatus: 'partial', generatedAt: daysAgo(25), verified: true },
  { id: 'esg-004', organizationId: 'org-004', organizationName: 'CleanAir Corp', period: 'Q2 2026', environmentalScore: 92, socialScore: 76, governanceScore: 80, overallESGScore: 82.7, carbonEmissions: 9800, energyConsumption: 390000, waterUsage: 82000, wasteGenerated: 2100, renewableEnergyPercent: 75, complianceStatus: 'compliant', generatedAt: daysAgo(22), verified: true },
  { id: 'esg-005', organizationId: 'org-005', organizationName: 'Pacific Renewables', period: 'Q2 2026', environmentalScore: 80, socialScore: 74, governanceScore: 77, overallESGScore: 77.0, carbonEmissions: 15600, energyConsumption: 550000, waterUsage: 120000, wasteGenerated: 5500, renewableEnergyPercent: 82, complianceStatus: 'compliant', generatedAt: daysAgo(20), verified: false },
];

export const greenLedgerEntries: GreenLedgerEntry[] = [
  { id: 'gle-001', transactionHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', timestamp: hoursAgo(2), type: 'carbon_credit', amount: 150.5, unit: 'tonnes CO2e', organizationId: 'org-001', organizationName: 'PT GreenForce', verified: true, blockIndex: 12450, description: 'Q2 carbon credit certification for emission reduction targets' },
  { id: 'gle-002', transactionHash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', timestamp: hoursAgo(5), type: 'emission_offset', amount: 85.3, unit: 'tonnes CO2e', organizationId: 'org-002', organizationName: 'EcoTech Industries', verified: true, blockIndex: 12451, description: 'Verified emission offset from solar panel installation project' },
  { id: 'gle-003', transactionHash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', timestamp: hoursAgo(8), type: 'renewable_energy', amount: 320, unit: 'MWh', organizationId: 'org-004', organizationName: 'CleanAir Corp', verified: true, blockIndex: 12452, description: 'Renewable energy generation from rooftop solar arrays' },
  { id: 'gle-004', transactionHash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', timestamp: hoursAgo(12), type: 'waste_reduction', amount: 12.8, unit: 'tonnes', organizationId: 'org-003', organizationName: 'Harmony Manufacturing', verified: true, blockIndex: 12453, description: 'Industrial waste reduction through circular economy practices' },
  { id: 'gle-005', transactionHash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', timestamp: hoursAgo(16), type: 'water_saving', amount: 45000, unit: 'liters', organizationId: 'org-005', organizationName: 'Pacific Renewables', verified: true, blockIndex: 12454, description: 'Water recycling system efficiency improvement' },
  { id: 'gle-006', transactionHash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', timestamp: hoursAgo(20), type: 'carbon_credit', amount: 210.7, unit: 'tonnes CO2e', organizationId: 'org-006', organizationName: 'Sustainable Solutions', verified: false, blockIndex: 12455, description: 'Pending verification for mangrove reforestation credits' },
  { id: 'gle-007', transactionHash: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', timestamp: hoursAgo(24), type: 'emission_offset', amount: 63.2, unit: 'tonnes CO2e', organizationId: 'org-007', organizationName: 'GreenVista Corp', verified: true, blockIndex: 12456, description: 'Fleet electrification emission offset certification' },
  { id: 'gle-008', transactionHash: '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', timestamp: hoursAgo(30), type: 'renewable_energy', amount: 185, unit: 'MWh', organizationId: 'org-008', organizationName: 'EcoHarvest', verified: true, blockIndex: 12457, description: 'Wind turbine renewable energy generation credit' },
  { id: 'gle-009', transactionHash: '0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', timestamp: hoursAgo(36), type: 'waste_reduction', amount: 8.5, unit: 'tonnes', organizationId: 'org-009', organizationName: 'BlueSky Industries', verified: true, blockIndex: 12458, description: 'Packaging waste reduction through biodegradable alternatives' },
  { id: 'gle-010', transactionHash: '0xd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', timestamp: hoursAgo(40), type: 'water_saving', amount: 72000, unit: 'liters', organizationId: 'org-010', organizationName: 'NatureFirst Inc', verified: false, blockIndex: 12459, description: 'Rainwater harvesting system water saving verification' },
  { id: 'gle-011', transactionHash: '0xe1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', timestamp: daysAgo(2), type: 'carbon_credit', amount: 95.1, unit: 'tonnes CO2e', organizationId: 'org-001', organizationName: 'PT GreenForce', verified: true, blockIndex: 12460, description: 'Secondary carbon credit batch from forest conservation' },
  { id: 'gle-012', transactionHash: '0xf2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3', timestamp: daysAgo(2), type: 'emission_offset', amount: 42.8, unit: 'tonnes CO2e', organizationId: 'org-004', organizationName: 'CleanAir Corp', verified: true, blockIndex: 12461, description: 'Factory emission offset via carbon capture technology' },
  { id: 'gle-013', transactionHash: '0xa3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4', timestamp: daysAgo(3), type: 'renewable_energy', amount: 510, unit: 'MWh', organizationId: 'org-002', organizationName: 'EcoTech Industries', verified: true, blockIndex: 12462, description: 'Combined solar and hydro renewable energy certification' },
  { id: 'gle-014', transactionHash: '0xb4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5', timestamp: daysAgo(3), type: 'waste_reduction', amount: 22.4, unit: 'tonnes', organizationId: 'org-003', organizationName: 'Harmony Manufacturing', verified: true, blockIndex: 12463, description: 'Electronic waste recycling and recovery program' },
  { id: 'gle-015', transactionHash: '0xc5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', timestamp: daysAgo(4), type: 'water_saving', amount: 38000, unit: 'liters', organizationId: 'org-005', organizationName: 'Pacific Renewables', verified: true, blockIndex: 12464, description: 'Cooling tower water optimization savings' },
];

export const organizations: Organization[] = [
  { id: 'org-001', name: 'PT GreenForce', industry: 'Renewable Energy', greenIndexScore: 87.5, totalCarbonCredits: 245.6, totalEmissionsOffset: 18500, verifiedReports: 12, rank: 1 },
  { id: 'org-002', name: 'EcoTech Industries', industry: 'Technology', greenIndexScore: 84.2, totalCarbonCredits: 198.3, totalEmissionsOffset: 22100, verifiedReports: 10, rank: 2 },
  { id: 'org-003', name: 'Harmony Manufacturing', industry: 'Manufacturing', greenIndexScore: 81.7, totalCarbonCredits: 165.0, totalEmissionsOffset: 35200, verifiedReports: 8, rank: 3 },
  { id: 'org-004', name: 'CleanAir Corp', industry: 'Environmental Services', greenIndexScore: 79.3, totalCarbonCredits: 142.5, totalEmissionsOffset: 15800, verifiedReports: 9, rank: 4 },
  { id: 'org-005', name: 'Pacific Renewables', industry: 'Energy', greenIndexScore: 76.8, totalCarbonCredits: 128.7, totalEmissionsOffset: 28400, verifiedReports: 7, rank: 5 },
  { id: 'org-006', name: 'Sustainable Solutions', industry: 'Consulting', greenIndexScore: 74.1, totalCarbonCredits: 210.7, totalEmissionsOffset: 19200, verifiedReports: 6, rank: 6 },
  { id: 'org-007', name: 'GreenVista Corp', industry: 'Agriculture', greenIndexScore: 71.5, totalCarbonCredits: 105.2, totalEmissionsOffset: 24600, verifiedReports: 5, rank: 7 },
  { id: 'org-008', name: 'EcoHarvest', industry: 'Food & Beverage', greenIndexScore: 68.9, totalCarbonCredits: 88.4, totalEmissionsOffset: 31500, verifiedReports: 4, rank: 8 },
  { id: 'org-009', name: 'BlueSky Industries', industry: 'Construction', greenIndexScore: 65.4, totalCarbonCredits: 72.1, totalEmissionsOffset: 42800, verifiedReports: 3, rank: 9 },
  { id: 'org-010', name: 'NatureFirst Inc', industry: 'Conservation', greenIndexScore: 62.7, totalCarbonCredits: 156.9, totalEmissionsOffset: 12400, verifiedReports: 2, rank: 10 },
];

export const dashboardStats: DashboardStats = {
  activeSensors: 9,
  totalReadings: 1847,
  activeAlerts: 4,
  greenIndex: 75.2,
  blockchainVerified: 1623,
  carbonCredits: 1513.4,
  aiRecommendations: 7,
  uptimePercent: 92.3,
};

export const chartData = {
  airQualityTrend: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: Math.round(80 + Math.sin(i / 3) * 45 + (i > 6 && i < 20 ? 60 : 0) + Math.random() * 20),
    label: i < 6 || i > 20 ? 'Night' : i < 12 ? 'Morning' : 'Afternoon',
  })) as ChartDataPoint[],

  waterQualityTrend: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: Math.round((6.5 + Math.sin(i / 4) * 0.8 + Math.random() * 0.3) * 100) / 100,
    label: (6.5 + Math.sin(i / 4) * 0.8 + Math.random() * 0.3) >= 7.0 ? 'Normal' : (6.5 + Math.sin(i / 4) * 0.8 + Math.random() * 0.3) >= 6.5 ? 'Slightly Acidic' : 'Acidic',
  })) as ChartDataPoint[],

  co2Levels: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: Math.round(380 + Math.sin(i / 3) * 120 + (i > 8 && i < 18 ? 200 : 0) + Math.random() * 30),
    label: (380 + Math.sin(i / 3) * 120 + (i > 8 && i < 18 ? 200 : 0) + Math.random() * 30) > 800 ? 'Elevated' : 'Normal',
  })) as ChartDataPoint[],

  energyConsumption: [
    { time: 'Mon', value: 485200, label: 'below average' },
    { time: 'Tue', value: 512800, label: 'above average' },
    { time: 'Wed', value: 498300, label: 'average' },
    { time: 'Thu', value: 521600, label: 'above average' },
    { time: 'Fri', value: 534100, label: 'peak' },
    { time: 'Sat', value: 445700, label: 'weekend' },
    { time: 'Sun', value: 412300, label: 'weekend' },
  ] as ChartDataPoint[],
};
