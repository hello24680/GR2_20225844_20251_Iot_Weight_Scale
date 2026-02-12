-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'offline',
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weight data table
CREATE TABLE IF NOT EXISTS weight_data (
    id SERIAL PRIMARY KEY,
    weight DECIMAL(10, 3) NOT NULL,
    status VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_id VARCHAR(100) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weight_data_device_id ON weight_data(device_id);
CREATE INDEX IF NOT EXISTS idx_weight_data_timestamp ON weight_data(timestamp DESC);

-- Insert default device for demo
INSERT INTO devices (device_id, name, status, last_seen)
VALUES ('ESP32_SCALE_001', 'Smart Scale Demo', 'online', CURRENT_TIMESTAMP)
ON CONFLICT (device_id) DO NOTHING;
