-- =============================================================
-- EnviroChain Supabase Database Schema
-- PostgreSQL / Supabase
-- Includes Auth, All Tables, Seed Data, RLS Policies
-- =============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- SUPABASE AUTH - USER PROFILES (extends auth.users)
-- =============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  organization TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_id, email, full_name, organization, role)
  VALUES (
    NEW.email,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'organization', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::text, 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles untuk user yang sudah ada sebelum trigger dibuat (mencegah login loop 403)
INSERT INTO public.profiles (id, auth_id, email, full_name, organization, role)
SELECT
  u.email,
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.raw_user_meta_data->>'organization', ''),
  COALESCE((u.raw_user_meta_data->>'role')::text, 'viewer')
FROM auth.users u
LEFT JOIN public.profiles p ON p.auth_id = u.id
WHERE p.auth_id IS NULL AND u.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- ORGANIZATIONS
-- =============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- SENSORS (IoT Devices)
-- =============================================================
CREATE TABLE IF NOT EXISTS sensors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'air_quality', 'water_quality', 'soil', 'noise',
    'temperature', 'humidity', 'co2', 'pm25', 'radiation'
  )),
  location TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
  organization_id TEXT REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ENVIRONMENTAL READINGS
-- =============================================================
CREATE TABLE IF NOT EXISTS environmental_readings (
  id TEXT PRIMARY KEY,
  sensor_id TEXT REFERENCES sensors(id) NOT NULL,
  sensor_name TEXT,
  sensor_type TEXT,
  value DECIMAL(12, 4) NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  location TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  quality TEXT CHECK (quality IN ('excellent', 'good', 'moderate', 'poor', 'hazardous')),
  verified BOOLEAN DEFAULT FALSE,
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ENVIRONMENTAL ALERTS
-- =============================================================
CREATE TABLE IF NOT EXISTS environmental_alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('warning', 'critical', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sensor_id TEXT REFERENCES sensors(id) NOT NULL,
  sensor_name TEXT,
  value DECIMAL(12, 4),
  threshold DECIMAL(12, 4),
  unit TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- BLOCKCHAIN BLOCKS
-- =============================================================
CREATE TABLE IF NOT EXISTS blockchain_blocks (
  id TEXT PRIMARY KEY,
  block_index INTEGER NOT NULL UNIQUE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  previous_hash TEXT NOT NULL,
  hash TEXT NOT NULL,
  nonce INTEGER DEFAULT 0,
  data_type TEXT,
  data_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  validator TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- GREEN INDEX SCORES
-- =============================================================
CREATE TABLE IF NOT EXISTS green_index_scores (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id) NOT NULL,
  organization_name TEXT,
  overall_score DECIMAL(5, 2),
  air_quality_score DECIMAL(5, 2),
  water_quality_score DECIMAL(5, 2),
  waste_management_score DECIMAL(5, 2),
  energy_efficiency_score DECIMAL(5, 2),
  biodiversity_score DECIMAL(5, 2),
  carbon_footprint_score DECIMAL(5, 2),
  trend TEXT CHECK (trend IN ('improving', 'stable', 'declining')),
  rank INTEGER,
  scored_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ESG REPORTS
-- =============================================================
CREATE TABLE IF NOT EXISTS esg_reports (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id) NOT NULL,
  organization_name TEXT,
  period TEXT NOT NULL,
  environmental_score DECIMAL(5, 2),
  social_score DECIMAL(5, 2),
  governance_score DECIMAL(5, 2),
  overall_esg_score DECIMAL(5, 2),
  carbon_emissions DECIMAL(12, 2),
  energy_consumption DECIMAL(12, 2),
  water_usage DECIMAL(12, 2),
  waste_generated DECIMAL(12, 2),
  renewable_energy_percent DECIMAL(5, 2),
  compliance_status TEXT DEFAULT 'partial' CHECK (compliance_status IN ('compliant', 'partial', 'non_compliant')),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);

-- =============================================================
-- GREEN LEDGER ENTRIES
-- =============================================================
CREATE TABLE IF NOT EXISTS green_ledger_entries (
  id TEXT PRIMARY KEY,
  transaction_hash TEXT NOT NULL UNIQUE,
  block_index INTEGER,
  type TEXT NOT NULL CHECK (type IN (
    'carbon_credit', 'emission_offset', 'renewable_energy',
    'waste_reduction', 'water_saving'
  )),
  amount DECIMAL(12, 4) NOT NULL,
  unit TEXT NOT NULL,
  organization_id TEXT REFERENCES organizations(id) NOT NULL,
  organization_name TEXT,
  verified BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- AI RECOMMENDATIONS
-- =============================================================
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('optimization', 'alert', 'prediction', 'action')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence DECIMAL(5, 2),
  impact TEXT CHECK (impact IN ('low', 'medium', 'high', 'critical')),
  category TEXT,
  data_points INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ENVIRONMENTAL INSIGHTS
-- =============================================================
CREATE TABLE IF NOT EXISTS environmental_insights (
  id TEXT PRIMARY KEY,
  insight TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- DASHBOARD STATS (cached aggregate values)
-- =============================================================
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id TEXT PRIMARY KEY DEFAULT 'main',
  active_sensors INTEGER DEFAULT 0,
  total_readings BIGINT DEFAULT 0,
  active_alerts INTEGER DEFAULT 0,
  green_index DECIMAL(5, 2) DEFAULT 0,
  blockchain_verified BIGINT DEFAULT 0,
  carbon_credits DECIMAL(12, 4) DEFAULT 0,
  ai_recommendations INTEGER DEFAULT 0,
  uptime_percent DECIMAL(5, 2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO dashboard_stats (id) VALUES ('main');

-- =============================================================
-- SEED DATA - ORGANIZATIONS
-- =============================================================
INSERT INTO organizations (id, name, industry) VALUES
  ('org-001', 'PT GreenForce', 'Renewable Energy'),
  ('org-002', 'EcoTech Industries', 'Technology'),
  ('org-003', 'Harmony Manufacturing', 'Manufacturing'),
  ('org-004', 'CleanAir Corp', 'Environmental Services'),
  ('org-005', 'Pacific Renewables', 'Energy'),
  ('org-006', 'Sustainable Solutions', 'Consulting'),
  ('org-007', 'GreenVista Corp', 'Agriculture'),
  ('org-008', 'EcoHarvest', 'Food & Beverage'),
  ('org-009', 'BlueSky Industries', 'Construction'),
  ('org-010', 'NatureFirst Inc', 'Conservation');

-- =============================================================
-- SEED DATA - SENSORS
-- =============================================================
INSERT INTO sensors (id, name, type, location, latitude, longitude, status, organization_id) VALUES
  ('sensor-001', 'Jakarta Central AQ Monitor', 'air_quality', 'Jakarta Pusat', -6.2088, 106.8456, 'online', 'org-001'),
  ('sensor-002', 'Ciliwung River pH Sensor', 'water_quality', 'Jakarta Timur', -6.2297, 106.8627, 'online', 'org-002'),
  ('sensor-003', 'Bandung Soil Monitor', 'soil', 'Bandung Barat', -6.8896, 107.6138, 'maintenance', 'org-003'),
  ('sensor-004', 'Surabaya Noise Tracker', 'noise', 'Surabaya Pusat', -7.2575, 112.7521, 'online', 'org-004'),
  ('sensor-005', 'Jakarta Selatan Temp Station', 'temperature', 'Jakarta Selatan', -6.2615, 106.8106, 'online', 'org-001'),
  ('sensor-006', 'Bandung Humidity Sensor', 'humidity', 'Bandung Kota', -6.9175, 107.6191, 'offline', 'org-005'),
  ('sensor-007', 'Jakarta Utara CO2 Monitor', 'co2', 'Jakarta Utara', -6.1219, 106.8748, 'online', 'org-006'),
  ('sensor-008', 'Surabaya PM2.5 Station', 'pm25', 'Surabaya Timur', -7.2575, 112.7811, 'online', 'org-007'),
  ('sensor-009', 'Bandung Air Quality Hub', 'air_quality', 'Bandung Selatan', -7.0050, 107.5740, 'online', 'org-008'),
  ('sensor-010', 'Jakarta Barat Water Sensor', 'water_quality', 'Jakarta Barat', -6.1681, 106.7589, 'maintenance', 'org-009'),
  ('sensor-011', 'Surabaya Temperature Array', 'temperature', 'Surabaya Utara', -7.2395, 112.7410, 'online', 'org-010'),
  ('sensor-012', 'Jakarta Pusat CO2 Level', 'co2', 'Jakarta Pusat', -6.1944, 106.8329, 'offline', 'org-002');

-- =============================================================
-- SEED DATA - ENVIRONMENTAL READINGS
-- =============================================================
INSERT INTO environmental_readings (id, sensor_id, sensor_name, sensor_type, value, unit, timestamp, location, latitude, longitude, quality, verified, blockchain_hash) VALUES
  ('reading-001', 'sensor-001', 'Jakarta Central AQ Monitor', 'air_quality', 142, 'AQI', NOW() - INTERVAL '5 minutes', 'Jakarta Pusat', -6.2088, 106.8456, 'moderate', TRUE, '0x7f3a8b2c1d4e5f6a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2'),
  ('reading-002', 'sensor-002', 'Ciliwung River pH Sensor', 'water_quality', 6.8, 'pH', NOW() - INTERVAL '12 minutes', 'Jakarta Timur', -6.2297, 106.8627, 'good', TRUE, '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a'),
  ('reading-003', 'sensor-004', 'Surabaya Noise Tracker', 'noise', 72.3, 'dB', NOW() - INTERVAL '3 minutes', 'Surabaya Pusat', -7.2575, 112.7521, 'moderate', TRUE, '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2'),
  ('reading-004', 'sensor-005', 'Jakarta Selatan Temp Station', 'temperature', 32.5, '°C', NOW() - INTERVAL '8 minutes', 'Jakarta Selatan', -6.2615, 106.8106, 'good', TRUE, '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3'),
  ('reading-005', 'sensor-007', 'Jakarta Utara CO2 Monitor', 'co2', 625, 'ppm', NOW() - INTERVAL '1 minute', 'Jakarta Utara', -6.1219, 106.8748, 'moderate', TRUE, '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4'),
  ('reading-006', 'sensor-008', 'Surabaya PM2.5 Station', 'pm25', 55.2, 'µg/m³', NOW() - INTERVAL '6 minutes', 'Surabaya Timur', -7.2575, 112.7811, 'moderate', TRUE, NULL),
  ('reading-007', 'sensor-009', 'Bandung Air Quality Hub', 'air_quality', 85, 'AQI', NOW() - INTERVAL '4 minutes', 'Bandung Selatan', -7.0050, 107.5740, 'good', TRUE, '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5'),
  ('reading-008', 'sensor-011', 'Surabaya Temperature Array', 'temperature', 31.8, '°C', NOW() - INTERVAL '10 minutes', 'Surabaya Utara', -7.2395, 112.7410, 'good', FALSE, NULL),
  ('reading-009', 'sensor-001', 'Jakarta Central AQ Monitor', 'air_quality', 178, 'AQI', NOW() - INTERVAL '35 minutes', 'Jakarta Pusat', -6.2088, 106.8456, 'poor', TRUE, '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6'),
  ('reading-010', 'sensor-002', 'Ciliwung River pH Sensor', 'water_quality', 5.9, 'pH', NOW() - INTERVAL '42 minutes', 'Jakarta Timur', -6.2297, 106.8627, 'poor', TRUE, '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7'),
  ('reading-011', 'sensor-004', 'Surabaya Noise Tracker', 'noise', 88.1, 'dB', NOW() - INTERVAL '55 minutes', 'Surabaya Pusat', -7.2575, 112.7521, 'poor', TRUE, '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8'),
  ('reading-012', 'sensor-007', 'Jakarta Utara CO2 Monitor', 'co2', 810, 'ppm', NOW() - INTERVAL '48 minutes', 'Jakarta Utara', -6.1219, 106.8748, 'poor', TRUE, NULL),
  ('reading-013', 'sensor-008', 'Surabaya PM2.5 Station', 'pm25', 128, 'µg/m³', NOW() - INTERVAL '60 minutes', 'Surabaya Timur', -7.2575, 112.7811, 'hazardous', TRUE, '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9'),
  ('reading-014', 'sensor-009', 'Bandung Air Quality Hub', 'air_quality', 42, 'AQI', NOW() - INTERVAL '50 minutes', 'Bandung Selatan', -7.0050, 107.5740, 'excellent', TRUE, '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1'),
  ('reading-015', 'sensor-005', 'Jakarta Selatan Temp Station', 'temperature', 34.1, '°C', NOW() - INTERVAL '65 minutes', 'Jakarta Selatan', -6.2615, 106.8106, 'moderate', TRUE, '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2'),
  ('reading-016', 'sensor-011', 'Surabaya Temperature Array', 'temperature', 29.4, '°C', NOW() - INTERVAL '75 minutes', 'Surabaya Utara', -7.2395, 112.7410, 'excellent', FALSE, NULL),
  ('reading-017', 'sensor-001', 'Jakarta Central AQ Monitor', 'air_quality', 210, 'AQI', NOW() - INTERVAL '90 minutes', 'Jakarta Pusat', -6.2088, 106.8456, 'poor', TRUE, '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3'),
  ('reading-018', 'sensor-002', 'Ciliwung River pH Sensor', 'water_quality', 7.2, 'pH', NOW() - INTERVAL '95 minutes', 'Jakarta Timur', -6.2297, 106.8627, 'excellent', TRUE, '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4'),
  ('reading-019', 'sensor-004', 'Surabaya Noise Tracker', 'noise', 58.7, 'dB', NOW() - INTERVAL '100 minutes', 'Surabaya Pusat', -7.2575, 112.7521, 'good', TRUE, NULL),
  ('reading-020', 'sensor-007', 'Jakarta Utara CO2 Monitor', 'co2', 490, 'ppm', NOW() - INTERVAL '105 minutes', 'Jakarta Utara', -6.1219, 106.8748, 'good', TRUE, '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5'),
  ('reading-021', 'sensor-009', 'Bandung Air Quality Hub', 'air_quality', 110, 'AQI', NOW() - INTERVAL '2 hours', 'Bandung Selatan', -7.0050, 107.5740, 'moderate', TRUE, NULL),
  ('reading-022', 'sensor-008', 'Surabaya PM2.5 Station', 'pm25', 38.9, 'µg/m³', NOW() - INTERVAL '2.5 hours', 'Surabaya Timur', -7.2575, 112.7811, 'good', TRUE, '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6'),
  ('reading-023', 'sensor-005', 'Jakarta Selatan Temp Station', 'temperature', 30.2, '°C', NOW() - INTERVAL '3 hours', 'Jakarta Selatan', -6.2615, 106.8106, 'excellent', TRUE, '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7'),
  ('reading-024', 'sensor-001', 'Jakarta Central AQ Monitor', 'air_quality', 165, 'AQI', NOW() - INTERVAL '3.5 hours', 'Jakarta Pusat', -6.2088, 106.8456, 'poor', TRUE, NULL),
  ('reading-025', 'sensor-002', 'Ciliwung River pH Sensor', 'water_quality', 6.1, 'pH', NOW() - INTERVAL '4 hours', 'Jakarta Timur', -6.2297, 106.8627, 'moderate', TRUE, '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8'),
  ('reading-026', 'sensor-004', 'Surabaya Noise Tracker', 'noise', 65.4, 'dB', NOW() - INTERVAL '4.5 hours', 'Surabaya Pusat', -7.2575, 112.7521, 'moderate', TRUE, '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9'),
  ('reading-027', 'sensor-007', 'Jakarta Utara CO2 Monitor', 'co2', 380, 'ppm', NOW() - INTERVAL '5 hours', 'Jakarta Utara', -6.1219, 106.8748, 'excellent', TRUE, '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0'),
  ('reading-028', 'sensor-011', 'Surabaya Temperature Array', 'temperature', 33.7, '°C', NOW() - INTERVAL '5.5 hours', 'Surabaya Utara', -7.2395, 112.7410, 'moderate', TRUE, NULL),
  ('reading-029', 'sensor-009', 'Bandung Air Quality Hub', 'air_quality', 68, 'AQI', NOW() - INTERVAL '6 hours', 'Bandung Selatan', -7.0050, 107.5740, 'good', TRUE, '0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1'),
  ('reading-030', 'sensor-008', 'Surabaya PM2.5 Station', 'pm25', 72.1, 'µg/m³', NOW() - INTERVAL '6.5 hours', 'Surabaya Timur', -7.2575, 112.7811, 'moderate', TRUE, NULL);

-- =============================================================
-- SEED DATA - ENVIRONMENTAL ALERTS
-- =============================================================
INSERT INTO environmental_alerts (id, type, title, message, sensor_id, sensor_name, value, threshold, unit, timestamp, acknowledged, location) VALUES
  ('alert-001', 'critical', 'Hazardous PM2.5 Levels Detected', 'PM2.5 concentration in Surabaya Timur has exceeded hazardous threshold. Immediate action recommended.', 'sensor-008', 'Surabaya PM2.5 Station', 128, 100, 'µg/m³', NOW() - INTERVAL '6 minutes', FALSE, 'Surabaya Timur'),
  ('alert-002', 'warning', 'Elevated Air Quality Index', 'AQI in Jakarta Pusat trending upward. Consider issuing public advisory.', 'sensor-001', 'Jakarta Central AQ Monitor', 210, 200, 'AQI', NOW() - INTERVAL '90 minutes', FALSE, 'Jakarta Pusat'),
  ('alert-003', 'critical', 'High Noise Pollution Detected', 'Noise levels in Surabaya Pusat exceeded 85 dB. Potential health hazard for nearby residents.', 'sensor-004', 'Surabaya Noise Tracker', 88.1, 85, 'dB', NOW() - INTERVAL '55 minutes', TRUE, 'Surabaya Pusat'),
  ('alert-004', 'warning', 'CO2 Levels Rising', 'CO2 concentration in Jakarta Utara has been steadily increasing over the past 2 hours.', 'sensor-007', 'Jakarta Utara CO2 Monitor', 810, 800, 'ppm', NOW() - INTERVAL '48 minutes', FALSE, 'Jakarta Utara'),
  ('alert-005', 'info', 'Water pH Returning to Normal', 'Ciliwung River pH levels have recovered from acidic readings. Monitoring continues.', 'sensor-002', 'Ciliwung River pH Sensor', 7.2, 7.0, 'pH', NOW() - INTERVAL '95 minutes', TRUE, 'Jakarta Timur'),
  ('alert-006', 'warning', 'Sensor Offline Alert', 'Jakarta Pusat CO2 Level sensor has been offline for 48 hours. Maintenance required.', 'sensor-012', 'Jakarta Pusat CO2 Level', 0, 0, 'status', NOW() - INTERVAL '2 hours', FALSE, 'Jakarta Pusat'),
  ('alert-007', 'info', 'Bandung Air Quality Improving', 'Air quality index in Bandung Selatan has improved to excellent levels. No action needed.', 'sensor-009', 'Bandung Air Quality Hub', 42, 50, 'AQI', NOW() - INTERVAL '50 minutes', TRUE, 'Bandung Selatan'),
  ('alert-008', 'warning', 'Temperature Exceeding Comfort Zone', 'Temperature in Jakarta Selatan consistently above 33°C. Heat advisory recommended.', 'sensor-005', 'Jakarta Selatan Temp Station', 34.1, 33, '°C', NOW() - INTERVAL '65 minutes', FALSE, 'Jakarta Selatan');

-- =============================================================
-- SEED DATA - GREEN INDEX SCORES
-- =============================================================
INSERT INTO green_index_scores (id, organization_id, organization_name, overall_score, air_quality_score, water_quality_score, waste_management_score, energy_efficiency_score, biodiversity_score, carbon_footprint_score, trend, rank, scored_at) VALUES
  ('gi-001', 'org-001', 'PT GreenForce', 87.5, 92, 85, 88, 90, 78, 92, 'improving', 1, NOW() - INTERVAL '1 day'),
  ('gi-002', 'org-002', 'EcoTech Industries', 84.2, 88, 82, 80, 86, 83, 86, 'improving', 2, NOW() - INTERVAL '1 day'),
  ('gi-003', 'org-003', 'Harmony Manufacturing', 81.7, 79, 84, 82, 78, 85, 82, 'stable', 3, NOW() - INTERVAL '1 day'),
  ('gi-004', 'org-004', 'CleanAir Corp', 79.3, 95, 72, 76, 80, 70, 83, 'improving', 4, NOW() - INTERVAL '1 day'),
  ('gi-005', 'org-005', 'Pacific Renewables', 76.8, 74, 78, 72, 92, 65, 80, 'improving', 5, NOW() - INTERVAL '1 day'),
  ('gi-006', 'org-006', 'Sustainable Solutions', 74.1, 70, 76, 78, 75, 72, 74, 'stable', 6, NOW() - INTERVAL '1 day'),
  ('gi-007', 'org-007', 'GreenVista Corp', 71.5, 68, 73, 70, 72, 76, 70, 'declining', 7, NOW() - INTERVAL '1 day'),
  ('gi-008', 'org-008', 'EcoHarvest', 68.9, 65, 70, 68, 69, 80, 62, 'stable', 8, NOW() - INTERVAL '1 day'),
  ('gi-009', 'org-009', 'BlueSky Industries', 65.4, 62, 68, 64, 66, 63, 69, 'declining', 9, NOW() - INTERVAL '1 day'),
  ('gi-010', 'org-010', 'NatureFirst Inc', 62.7, 58, 65, 60, 63, 74, 56, 'declining', 10, NOW() - INTERVAL '1 day');

-- =============================================================
-- SEED DATA - ESG REPORTS
-- =============================================================
INSERT INTO esg_reports (id, organization_id, organization_name, period, environmental_score, social_score, governance_score, overall_esg_score, carbon_emissions, energy_consumption, water_usage, waste_generated, renewable_energy_percent, compliance_status, generated_at, verified) VALUES
  ('esg-001', 'org-001', 'PT GreenForce', 'Q2 2026', 89, 82, 91, 87.3, 12500, 480000, 95000, 3200, 68, 'compliant', NOW() - INTERVAL '30 days', TRUE),
  ('esg-002', 'org-002', 'EcoTech Industries', 'Q2 2026', 85, 79, 88, 84.0, 18200, 620000, 110000, 4800, 55, 'compliant', NOW() - INTERVAL '28 days', TRUE),
  ('esg-003', 'org-003', 'Harmony Manufacturing', 'Q2 2026', 78, 85, 83, 82.0, 22800, 780000, 145000, 6200, 42, 'partial', NOW() - INTERVAL '25 days', TRUE),
  ('esg-004', 'org-004', 'CleanAir Corp', 'Q2 2026', 92, 76, 80, 82.7, 9800, 390000, 82000, 2100, 75, 'compliant', NOW() - INTERVAL '22 days', TRUE),
  ('esg-005', 'org-005', 'Pacific Renewables', 'Q2 2026', 80, 74, 77, 77.0, 15600, 550000, 120000, 5500, 82, 'compliant', NOW() - INTERVAL '20 days', FALSE);

-- =============================================================
-- SEED DATA - GREEN LEDGER ENTRIES
-- =============================================================
INSERT INTO green_ledger_entries (id, transaction_hash, block_index, type, amount, unit, organization_id, organization_name, verified, description) VALUES
  ('gle-001', '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', 12450, 'carbon_credit', 150.5, 'tonnes CO2e', 'org-001', 'PT GreenForce', TRUE, 'Q2 carbon credit certification for emission reduction targets'),
  ('gle-002', '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', 12451, 'emission_offset', 85.3, 'tonnes CO2e', 'org-002', 'EcoTech Industries', TRUE, 'Verified emission offset from solar panel installation project'),
  ('gle-003', '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', 12452, 'renewable_energy', 320, 'MWh', 'org-004', 'CleanAir Corp', TRUE, 'Renewable energy generation from rooftop solar arrays'),
  ('gle-004', '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', 12453, 'waste_reduction', 12.8, 'tonnes', 'org-003', 'Harmony Manufacturing', TRUE, 'Industrial waste reduction through circular economy practices'),
  ('gle-005', '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', 12454, 'water_saving', 45000, 'liters', 'org-005', 'Pacific Renewables', TRUE, 'Water recycling system efficiency improvement'),
  ('gle-006', '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', 12455, 'carbon_credit', 210.7, 'tonnes CO2e', 'org-006', 'Sustainable Solutions', FALSE, 'Pending verification for mangrove reforestation credits'),
  ('gle-007', '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', 12456, 'emission_offset', 63.2, 'tonnes CO2e', 'org-007', 'GreenVista Corp', TRUE, 'Fleet electrification emission offset certification'),
  ('gle-008', '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', 12457, 'renewable_energy', 185, 'MWh', 'org-008', 'EcoHarvest', TRUE, 'Wind turbine renewable energy generation credit'),
  ('gle-009', '0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', 12458, 'waste_reduction', 8.5, 'tonnes', 'org-009', 'BlueSky Industries', TRUE, 'Packaging waste reduction through biodegradable alternatives'),
  ('gle-010', '0xd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', 12459, 'water_saving', 72000, 'liters', 'org-010', 'NatureFirst Inc', FALSE, 'Rainwater harvesting system water saving verification'),
  ('gle-011', '0xe1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', 12460, 'carbon_credit', 95.1, 'tonnes CO2e', 'org-001', 'PT GreenForce', TRUE, 'Secondary carbon credit batch from forest conservation'),
  ('gle-012', '0xf2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3', 12461, 'emission_offset', 42.8, 'tonnes CO2e', 'org-004', 'CleanAir Corp', TRUE, 'Factory emission offset via carbon capture technology'),
  ('gle-013', '0xa3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4', 12462, 'renewable_energy', 510, 'MWh', 'org-002', 'EcoTech Industries', TRUE, 'Combined solar and hydro renewable energy certification'),
  ('gle-014', '0xb4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5', 12463, 'waste_reduction', 22.4, 'tonnes', 'org-003', 'Harmony Manufacturing', TRUE, 'Electronic waste recycling and recovery program'),
  ('gle-015', '0xc5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', 12464, 'water_saving', 38000, 'liters', 'org-005', 'Pacific Renewables', TRUE, 'Cooling tower water optimization savings');

-- =============================================================
-- SEED DATA - AI RECOMMENDATIONS
-- =============================================================
INSERT INTO ai_recommendations (id, type, title, description, confidence, impact, category, data_points) VALUES
  ('rec-001', 'optimization', 'Optimize Sensor Network Coverage', 'Analysis indicates a 15km gap in air quality monitoring between Jakarta Pusat and Jakarta Utara. Deploying an additional sensor could improve data accuracy by 23%.', 87, 'medium', 'sensor_network', 1240),
  ('rec-002', 'alert', 'Predicted AQI Spike in 4 Hours', 'Machine learning model forecasts an AQI increase of 35-50 points in Jakarta Pusat based on current wind patterns and emission sources.', 91, 'high', 'air_quality', 890),
  ('rec-003', 'prediction', 'Water Quality Recovery Timeline', 'Ciliwung River pH levels are projected to return to normal range (6.5-7.5) within 18 hours based on current dilution rates and upstream flow data.', 78, 'medium', 'water_quality', 560),
  ('rec-004', 'action', 'Activate Emergency Filtration', 'PM2.5 levels in Surabaya have exceeded 100 µg/m³ for three consecutive readings. Activating building filtration systems could reduce indoor exposure by 60%.', 95, 'critical', 'pm25', 420),
  ('rec-005', 'optimization', 'Reduce Energy Consumption During Off-Peak', 'Energy consumption data shows 18% waste during off-peak hours. Implementing automated shutdown protocols could save approximately 45,000 kWh per month.', 82, 'medium', 'energy', 2100),
  ('rec-006', 'prediction', 'Carbon Credit Opportunity', 'Based on current emission reduction trajectory, PT GreenForce is on track to earn 45 additional carbon credits by end of quarter if current practices continue.', 74, 'low', 'carbon_credits', 780),
  ('rec-007', 'action', 'Schedule Noise Compliance Review', 'Surabaya Pusat noise tracker has recorded 7 exceedances this week. Recommend immediate compliance review with nearby construction sites.', 89, 'high', 'noise', 340),
  ('rec-008', 'optimization', 'Expand Green Corridor Monitoring', 'Bandung Selatan consistently shows excellent air quality (AQI 42). Recommend establishing additional monitoring points to study and replicate success factors.', 82, 'low', 'air_quality', 650);

-- =============================================================
-- SEED DATA - ENVIRONMENTAL INSIGHTS
-- =============================================================
INSERT INTO environmental_insights (id, insight, category) VALUES
  ('insight-001', 'Air quality in Jakarta Pusat has been declining over the past 6 hours. Wind pattern analysis suggests pollutants are being trapped by a high-pressure system. Recommend issuing public advisory.', 'air_quality'),
  ('insight-002', 'Water pH levels in Ciliwung River are recovering after an acidic episode. Upstream industrial discharge appears to have reduced. Continue monitoring for 24 hours before resuming normal operations.', 'water_quality'),
  ('insight-003', 'PM2.5 concentrations in Surabaya have crossed hazardous thresholds. Satellite imagery confirms a regional haze event. Recommend activating emergency filtration protocols.', 'pm25'),
  ('insight-004', 'CO2 levels in Jakarta Utara show a strong correlation with traffic patterns. Peak concentrations coincide with morning and evening rush hours. Urban planning adjustment could reduce exposure.', 'co2'),
  ('insight-005', 'Temperature readings across Jakarta network indicate urban heat island effect is intensifying. Green roof installations on nearby buildings could reduce local temperatures by 2-3°C.', 'temperature'),
  ('insight-006', 'Noise pollution in Surabaya Pusat is primarily driven by construction activity. Temporal analysis shows violations concentrated between 10:00-14:00. Enforcement of quiet hours recommended.', 'noise'),
  ('insight-007', 'Bandung air quality is trending positive. Increased vegetation cover and reduced industrial output are contributing factors. Current trajectory suggests continued improvement over the next week.', 'air_quality'),
  ('insight-008', 'Humidity sensors in Bandung report below-normal readings. Combined with elevated temperatures, this creates fire risk conditions. Recommend issuing fire advisory for affected areas.', 'humidity');

-- =============================================================
-- SEED DATA - BLOCKCHAIN BLOCKS
-- =============================================================
INSERT INTO blockchain_blocks (id, block_index, timestamp, previous_hash, hash, nonce, data_type, data_count, verified, validator) VALUES
  ('block-0', 0, '2026-01-01T00:00:00Z', '0', '0x0000000000000000000000000000000000000000000000000000000000000000', 0, 'genesis', 0, TRUE, 'genesis-node'),
  ('block-1', 1, NOW() - INTERVAL '2 hours', '0x0000000000000000000000000000000000000000000000000000000000000000', '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', 12345, 'environmental_readings', 5, TRUE, 'validator-1'),
  ('block-2', 2, NOW() - INTERVAL '1 hour', '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c', 67890, 'environmental_readings', 3, TRUE, 'validator-2'),
  ('block-3', 3, NOW() - INTERVAL '30 minutes', '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c', '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d', 11111, 'environmental_readings', 4, TRUE, 'validator-3'),
  ('block-4', 4, NOW() - INTERVAL '15 minutes', '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d', '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', 22222, 'environmental_readings', 2, TRUE, 'validator-4');

-- =============================================================
-- INDEXES
-- =============================================================
CREATE INDEX idx_readings_sensor ON environmental_readings(sensor_id);
CREATE INDEX idx_readings_time ON environmental_readings(timestamp DESC);
CREATE INDEX idx_readings_quality ON environmental_readings(quality);
CREATE INDEX idx_readings_type ON environmental_readings(sensor_type);
CREATE INDEX idx_alerts_time ON environmental_alerts(timestamp DESC);
CREATE INDEX idx_alerts_type ON environmental_alerts(type);
CREATE INDEX idx_alerts_ack ON environmental_alerts(acknowledged);
CREATE INDEX idx_sensors_org ON sensors(organization_id);
CREATE INDEX idx_sensors_type ON sensors(type);
CREATE INDEX idx_green_idx_org ON green_index_scores(organization_id);
CREATE INDEX idx_esg_org ON esg_reports(organization_id);
CREATE INDEX idx_ledger_type ON green_ledger_entries(type);
CREATE INDEX idx_ledger_org ON green_ledger_entries(organization_id);
CREATE INDEX idx_ledger_time ON green_ledger_entries(created_at DESC);
CREATE INDEX idx_ai_rec_type ON ai_recommendations(type);
CREATE INDEX idx_profiles_org ON profiles(organization);
CREATE INDEX idx_blocks_index ON blockchain_blocks(block_index);

-- =============================================================
-- REALTIME PUBLICATIONS
-- =============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE environmental_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE environmental_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE sensors;
ALTER PUBLICATION supabase_realtime ADD TABLE green_ledger_entries;

-- =============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_index_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE esg_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING ((select auth.uid()) = auth_id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING ((select auth.uid()) = auth_id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = auth_id);
CREATE POLICY "Public read for authenticated users" ON profiles
  FOR SELECT USING ((select auth.role()) = 'authenticated');

-- ORGANIZATIONS POLICIES
CREATE POLICY "Authenticated users can read organizations" ON organizations
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can insert organizations" ON organizations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can update organizations" ON organizations
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- SENSORS POLICIES
CREATE POLICY "Authenticated users can read sensors" ON sensors
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can insert sensors" ON sensors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can update sensors" ON sensors
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- ENVIRONMENTAL READINGS POLICIES
CREATE POLICY "Authenticated users can read readings" ON environmental_readings
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can insert readings" ON environmental_readings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update readings" ON environmental_readings
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- ENVIRONMENTAL ALERTS POLICIES
CREATE POLICY "Authenticated users can read alerts" ON environmental_alerts
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage alerts" ON environmental_alerts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- BLOCKCHAIN BLOCKS POLICIES
CREATE POLICY "Authenticated users can read blockchain" ON blockchain_blocks
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can insert blocks" ON blockchain_blocks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- GREEN INDEX SCORES POLICIES
CREATE POLICY "Authenticated users can read green index" ON green_index_scores
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage green index" ON green_index_scores
  FOR ALL USING (auth.role() = 'authenticated');

-- ESG REPORTS POLICIES
CREATE POLICY "Authenticated users can read ESG reports" ON esg_reports
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage ESG reports" ON esg_reports
  FOR ALL USING (auth.role() = 'authenticated');

-- GREEN LEDGER ENTRIES POLICIES
CREATE POLICY "Authenticated users can read ledger" ON green_ledger_entries
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage ledger" ON green_ledger_entries
  FOR ALL USING (auth.role() = 'authenticated');

-- AI RECOMMENDATIONS POLICIES
CREATE POLICY "Authenticated users can read AI recommendations" ON ai_recommendations
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage AI recommendations" ON ai_recommendations
  FOR ALL USING (auth.role() = 'authenticated');

-- ENVIRONMENTAL INSIGHTS POLICIES
CREATE POLICY "Authenticated users can read insights" ON environmental_insights
  FOR SELECT USING (auth.role() = 'authenticated');

-- DASHBOARD STATS POLICIES
CREATE POLICY "Authenticated users can read dashboard stats" ON dashboard_stats
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update dashboard stats" ON dashboard_stats
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- =============================================================
-- DEFAULT ADMIN USER
-- =============================================================
-- Create admin user via Supabase Dashboard first, then:
-- INSERT INTO profiles (id, auth_id, email, full_name, organization, role)
-- VALUES ('admin@envirochain.io', '<admin-uuid>', 'admin@envirochain.io', 'Enviro Admin', 'PT GreenForce', 'admin');
