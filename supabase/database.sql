-- =============================================================
-- EnviroChain Database Schema
-- PostgreSQL / Supabase
-- =============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- ORGANIZATIONS
-- =============================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- SENSORS (IoT Devices)
-- =============================================================
CREATE TABLE sensors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'air_quality', 'water_quality', 'soil', 'noise',
    'temperature', 'humidity', 'co2', 'pm25', 'radiation'
  )),
  location TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ENVIRONMENTAL READINGS
-- =============================================================
CREATE TABLE environmental_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_id UUID REFERENCES sensors(id) NOT NULL,
  value DECIMAL(12, 4) NOT NULL,
  unit TEXT NOT NULL,
  quality TEXT CHECK (quality IN ('excellent', 'good', 'moderate', 'poor', 'hazardous')),
  verified BOOLEAN DEFAULT FALSE,
  blockchain_hash TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ENVIRONMENTAL ALERTS
-- =============================================================
CREATE TABLE environmental_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('warning', 'critical', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sensor_id UUID REFERENCES sensors(id) NOT NULL,
  value DECIMAL(12, 4),
  threshold DECIMAL(12, 4),
  unit TEXT,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- BLOCKCHAIN BLOCKS
-- =============================================================
CREATE TABLE blockchain_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_index INTEGER NOT NULL UNIQUE,
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
CREATE TABLE green_index_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  overall_score DECIMAL(5, 2),
  air_quality_score DECIMAL(5, 2),
  water_quality_score DECIMAL(5, 2),
  waste_management_score DECIMAL(5, 2),
  energy_efficiency_score DECIMAL(5, 2),
  biodiversity_score DECIMAL(5, 2),
  carbon_footprint_score DECIMAL(5, 2),
  trend TEXT CHECK (trend IN ('improving', 'stable', 'declining')),
  scored_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ESG REPORTS
-- =============================================================
CREATE TABLE esg_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
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
  verified BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- GREEN LEDGER ENTRIES
-- =============================================================
CREATE TABLE green_ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_hash TEXT NOT NULL UNIQUE,
  block_index INTEGER,
  type TEXT NOT NULL CHECK (type IN (
    'carbon_credit', 'emission_offset', 'renewable_energy',
    'waste_reduction', 'water_saving'
  )),
  amount DECIMAL(12, 4) NOT NULL,
  unit TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- INDEXES
-- =============================================================
CREATE INDEX idx_readings_sensor ON environmental_readings(sensor_id);
CREATE INDEX idx_readings_time ON environmental_readings(recorded_at DESC);
CREATE INDEX idx_readings_quality ON environmental_readings(quality);
CREATE INDEX idx_alerts_time ON environmental_alerts(created_at DESC);
CREATE INDEX idx_alerts_type ON environmental_alerts(type);
CREATE INDEX idx_alerts_ack ON environmental_alerts(acknowledged);
CREATE INDEX idx_sensors_org ON sensors(organization_id);
CREATE INDEX idx_sensors_type ON sensors(type);
CREATE INDEX idx_green_idx_org ON green_index_scores(organization_id);
CREATE INDEX idx_esg_org ON esg_reports(organization_id);
CREATE INDEX idx_ledger_type ON green_ledger_entries(type);
CREATE INDEX idx_ledger_org ON green_ledger_entries(organization_id);
CREATE INDEX idx_ledger_time ON green_ledger_entries(created_at DESC);

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_index_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE esg_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_ledger_entries ENABLE ROW LEVEL SECURITY;

-- Public read access for demo/prototype
CREATE POLICY "Public read access" ON organizations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sensors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON environmental_readings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON environmental_alerts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON blockchain_blocks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON green_index_scores FOR SELECT USING (true);
CREATE POLICY "Public read access" ON esg_reports FOR SELECT USING (true);
CREATE POLICY "Public read access" ON green_ledger_entries FOR SELECT USING (true);

-- =============================================================
-- REALTIME SUBSCRIPTIONS
-- =============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE environmental_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE environmental_alerts;
