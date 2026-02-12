# Database Schema dự kiến sau này

## Tables

### users
Stores user information for the Smart Scale IoT system.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email address |
| full_name | VARCHAR(100) | User's full name |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### devices
Stores information about ESP32 smart scale devices.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| device_id | VARCHAR(100) | Unique device identifier |
| name | VARCHAR(100) | Device name |
| type | VARCHAR(50) | Device type (default: 'smart_scale') |
| status | VARCHAR(20) | Device status (online/offline/error) |
| firmware_version | VARCHAR(20) | Firmware version |
| last_seen | TIMESTAMP | Last activity timestamp |
| user_id | INTEGER | Foreign key to users table |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### weight_data
Stores weight measurements from the smart scale.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| weight | DECIMAL(10,2) | Weight value |
| unit | VARCHAR(10) | Unit of measurement (g/kg/lb/oz) |
| timestamp | TIMESTAMP | Measurement timestamp |
| device_id | VARCHAR(100) | Foreign key to devices |
| user_id | INTEGER | Foreign key to users |
| raw_value | INTEGER | Raw sensor value |
| calibrated | BOOLEAN | Whether the value is calibrated |
| created_at | TIMESTAMP | Record creation time |

## Setup Instructions

1. Connect to your PostgreSQL database
2. Run the schema.sql file:
```bash
psql -h postgresql.toolhub.app -p 5432 -U hoangnb -d scale_hoangnb -f database/schema.sql
```

Or using pgAdmin or any PostgreSQL client, execute the contents of `schema.sql`.
