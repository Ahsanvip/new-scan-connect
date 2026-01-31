-- Antigravity QR Vehicle Emergency Contact System
-- Database Schema for Neon PostgreSQL

-- Activation codes table
CREATE TABLE IF NOT EXISTS activation_codes (
  code TEXT PRIMARY KEY,
  used BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table with extended owner information
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  address TEXT,
  car_registration TEXT NOT NULL,
  car_model TEXT NOT NULL,
  city TEXT,
  activation_code TEXT UNIQUE REFERENCES activation_codes(code) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications log for analytics and debugging
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  method TEXT, -- 'whatsapp_api', 'sms', 'link'
  reason TEXT,
  scanner_coords TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  ip_address TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_activation_code ON vehicles(activation_code);
CREATE INDEX IF NOT EXISTS idx_notifications_vehicle_id ON notifications(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- Insert test activation codes (for development)
INSERT INTO activation_codes (code, used, is_active) VALUES
  ('TEST123', false, false),
  ('DEMO456', false, false),
  ('PKR789', false, false)
ON CONFLICT (code) DO NOTHING;
