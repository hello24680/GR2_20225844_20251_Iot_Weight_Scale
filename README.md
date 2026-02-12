# HỆ THỐNG CÂN THÔNG MINH IoT - SMART SCALE IoT SYSTEM

## TÁC GIẢ

- **Họ tên sinh viên**: Nguyễn Bá Hoàng
- **Mã Số Sinh Viên**: 20225844
- **Giảng viên hướng dẫn**: Nguyễn Đức Tiến

## GIỚI THIỆU

Hệ thống cân thông minh IoT là một giải pháp hoàn chỉnh kết hợp phần cứng ESP32, backend server và giao diện web để đo lường, theo dõi và quản lý dữ liệu trọng lượng theo thời gian thực. Hệ thống sử dụng giao thức MQTT để truyền dữ liệu giữa các thành phần, đảm bảo độ trễ thấp và khả năng mở rộng cao.

### Tính năng chính:
- **Đo trọng lượng chính xác** với cảm biến Load Cell 200kg và module HX711 (ADC 24-bit)
- **Hiển thị real-time** trên màn hình OLED SSD1306 (128x64)
- **Kết nối IoT** qua WiFi với cấu hình Captive Portal
- **Truyền dữ liệu MQTT** theo thời gian thực đến server
- **Dashboard web** với biểu đồ, lịch sử và quản lý thiết bị
- **Database PostgreSQL** lưu trữ dữ liệu lâu dài với Prisma ORM
- **RESTful API** cho tích hợp dễ dàng với các hệ thống khác


- Hình ảnh tổng quan:  
<div align="center">
<img src="docs\Tong_quan.png" width="700"/>
</div>  
<p align="center"><em>Hình 1: Giao diện tổng quan </em></p>


## KIẾN TRÚC HỆ THỐNG

Hệ thống được chia thành 3 thành phần chính:

### 1. **ESP32 Firmware** (Embedded C/C++)
- Vi điều khiển: ESP32 DevKit V1
- Cảm biến: HX711 + Load Cell 200kg
- Hiển thị: OLED SSD1306 (I2C)
- Kết nối: WiFi 2.4GHz + MQTT Client
- Framework: Arduino + PlatformIO

### 2. **Backend Server** (Node.js)
- Framework: Express.js
- Database: PostgreSQL + Prisma ORM
- MQTT Broker Client: mqtt.js
- API: RESTful endpoints

### 3. **Frontend Web** (React)
- Framework: React 19 + Vite
- UI Library: TailwindCSS + DaisyUI
- Charts: Recharts
- State Management: Zustand
- Real-time: MQTT WebSocket Client

- Sơ đồ kiến trúc tổng quan:
<div align="center">
<img src="docs\luong_hoat_dong.png" width="700"/>
</div>  
<p align="center"><em>Hình 2: Luồng hoạt động tổng quan </em></p>

## MÔI TRƯỜNG HOẠT ĐỘNG

### Thiết kế phần cứng

Hệ thống phần cứng được xây dựng xung quanh vi điều khiển ESP32, tích hợp các module cảm biến và hiển thị để đo lường trọng lượng và truyền dữ liệu qua mạng WiFi.

**Các thành phần chính:**

| Thành phần | Mô tả | Vai trò |
|------------|-------|---------|
| **ESP32 DevKit V1** | Vi điều khiển 32-bit, WiFi/BLE | Xử lý trung tâm, điều phối các module, kết nối IoT |
| **Load Cell 200kg** | Cảm biến trọng lượng điện trở | Chuyển đổi lực nén thành tín hiệu điện áp analog |
| **HX711 Module** | ADC 24-bit chuyên dụng | Khuếch đại và chuyển đổi tín hiệu từ Load Cell |
| **OLED SSD1306** | Màn hình 128x64, I2C | Hiển thị trọng lượng, trạng thái, menu cấu hình |
| **Nguồn 5V** | Adapter hoặc USB | Cấp nguồn cho toàn bộ hệ thống |

**Giao tiếp:**
- HX711 ↔ ESP32: GPIO (2 dây Data + Clock)
- OLED ↔ ESP32: I2C (SDA/SCL)
- ESP32 ↔ Server: WiFi MQTT over TCP/IP

- Hình ảnh thực tế:
<div align="center">
<img src="docs\phan_cung_thuc_te.jpg" width="700"/>
</div>  
<p align="center"><em>Hình 3: phần cứng thực tế </em></p>


### Thiết kế phần mềm

**ESP32 Firmware:**
```
Smart_scale_esp32/
├── src/
│   ├── main.cpp              # State machine chính, luồng điều khiển
│   ├── scale_sensor.cpp      # Đọc HX711, xử lý tín hiệu ADC
│   ├── oled_display.cpp      # Điều khiển màn hình OLED (menu, hiển thị)
│   ├── wifi_config.cpp       # WiFiSelfEnroll với Captive Portal
│   ├── mqtt_client.cpp       # Kết nối và publish dữ liệu MQTT
│   └── device_config.cpp     # Lưu/đọc cấu hình từ Preferences
└── include/
    └── constants.h           # Pin definitions, calibration factor
```

**Backend Server:**
```
BE/
├── src/
│   ├── server.js             # Entry point, khởi tạo Express + MQTT
│   ├── config/
│   │   ├── database.js       # Cấu hình PostgreSQL
│   │   ├── mqtt.js           # MQTT broker client setup
│   │   └── prisma.client.js  # Prisma ORM instance
│   ├── controllers/          # Business logic handlers
│   ├── services/             # Database operations
│   ├── routes/               # RESTful API endpoints
│   ├── libs/
│   │   └── mqttHandler.js    # Subscribe/handle MQTT messages
│   └── middlewares/
│       └── errorHandler.js   # Centralized error handling
└── prisma/
    ├── schema.prisma         # Database schema (Device, WeightData, User)
    └── migrations/           # Database migration history
```

**Frontend Application:**
```
FE/
├── src/
│   ├── App.jsx               # Root component, MQTT connection
│   ├── pages/
│   │   ├── Dashboard.jsx     # Trang chính với chart + real-time weight
│   │   ├── HistoryLog.jsx    # Lịch sử đo, filter, export
│   │   ├── DeviceSettings.jsx# Cấu hình thiết bị (caliFactor, offset)
│   │   └── UserProfile.jsx   # Quản lý tài khoản người dùng
│   ├── components/           # Reusable UI components
│   ├── services/
│   │   ├── apiClient.js      # Axios instance
│   │   └── weightService.js  # API calls cho weight data
│   ├── hooks/
│   │   └── useMqttWeight.js  # Custom hook cho MQTT real-time
│   └── stores/               # Zustand state management
└── public/                   # Static assets
```

## SƠ ĐỒ SCHEMATIC

### Kết nối phần cứng ESP32

**Sơ đồ chân kết nối:**

#### 1. HX711 Load Cell Module
| HX711 Pin | ESP32 Pin | Ghi chú |
|-----------|-----------|---------|
| VCC       | 5V        | Nguồn 5V (hoặc VIN) |
| GND       | GND       | Ground chung |
| DT (DOUT) | GPIO 16   | Data output (có thể thay đổi) |
| SCK       | GPIO 4    | Serial clock (có thể thay đổi) |

**Load Cell (4 dây) ↔ HX711:**
| Load Cell | HX711 |
|-----------|-------|
| Red (E+)  | E+    |
| Black (E-)| E-    |
| White (A-)| A-    |
| Green (A+)| A+    |

> **Lưu ý**: Nếu đấu ngược A+ và A-, giá trị sẽ bị đảo dấu. Cần lấy giá trị tuyệt đối hoặc đổi chân.

#### 2. OLED SSD1306 Display (I2C)
| OLED Pin | ESP32 Pin | Ghi chú |
|----------|-----------|---------|
| VCC      | 5V      | Nguồn 5V |
| GND      | GND       | Ground chung |
| SDA      | GPIO 21   | I2C Data (mặc định) |
| SCL      | GPIO 22   | I2C Clock (mặc định) |

**Địa chỉ I2C**: 0x3C (hoặc 0x3D tùy module)

#### 3. Nguồn cấp
- **USB**: Cắm trực tiếp vào cổng USB của ESP32 (5V/500mA)
- **Adapter**: 5V/1A qua chân VIN (khuyến nghị cho ổn định)

- Mô phỏng kết nối:
<div align="center">
<img src="docs\mo_phong_ket_noi.png" width="700"/>
</div>  
<p align="center"><em>Hình 4: Mô phỏng kết nối phần cứng</em></p>

## HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY THỬ

### Bước 1: Chuẩn bị môi trường

#### 1.1. ESP32 Firmware

**Yêu cầu:**
- [VS Code](https://code.visualstudio.com/) + [PlatformIO Extension](https://platformio.org/install/ide?install=vscode)
- Driver USB CP2102 hoặc CH340 (tùy board ESP32)
- Cable USB Type-C hoặc Micro USB

**Cài đặt môi trường:**

```bash
# 1. Cài đặt VS Code
# Tải từ: https://code.visualstudio.com/

# 2. Cài PlatformIO Extension
# Vào Extensions (Ctrl+Shift+X), tìm "PlatformIO IDE" và Install

# 3. Mở project ESP32
# File > Open Folder > Chọn: gr2/esp32/Smart_scale_esp32
```

**Cấu hình trước khi build:**

Chỉnh sửa [esp32/Smart_scale_esp32/include/constants.h](esp32/Smart_scale_esp32/include/constants.h):

```cpp
// ===== WIFI FALLBACK CONFIGURATION =====
#define FALLBACK_WIFI_SSID "Your_WiFi_Name"
#define FALLBACK_WIFI_PASSWORD "Your_WiFi_Password"

// ===== MQTT BROKER CONFIGURATION =====
#define MQTT_BROKER "broker.hivemq.com"  // Hoặc broker của bạn
#define MQTT_PORT 1883
#define MQTT_USER ""                      // Nếu broker yêu cầu auth
#define MQTT_PASSWORD ""

// ===== SCALE CALIBRATION =====
#define CALIBRATION_FACTOR  -20498.12f    // Điều chỉnh sau khi cân mẫu chuẩn
```

**Build và Upload:**

```bash
# Trong VS Code với PlatformIO:

# 1. Build (Ctrl+Alt+B)
# Hoặc click icon "✓ Build" ở thanh dưới

# 2. Upload to ESP32 (Ctrl+Alt+U)
# Hoặc click icon "→ Upload"

# 3. Mở Serial Monitor (Baud: 115200)
# Click icon "🔌 Serial Monitor" hoặc Ctrl+Alt+S
```

- Screenshot giao diện PlatformIO khi build thành công:
<div align="center">
<img src="docs\build_thanh_cong.png" width="700"/>
</div>  
<p align="center"><em>Hình 5: Build thành công</em></p>


#### 1.2. Backend Server

**Yêu cầu:**
- [Node.js](https://nodejs.org/) >= 18.x
- [PostgreSQL](https://www.postgresql.org/) >= 14.x
- MQTT Broker (HiveMQ Cloud, Mosquitto, hoặc EMQX)

**Cài đặt:**

```bash
# Di chuyển vào thư mục BE
cd gr2/smart-scale-iot/BE

# Cài đặt dependencies
npm install

# Tạo file .env từ mẫu
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
# DATABASE_URL="postgresql://user:password@localhost:5432/smart_scale"
# MQTT_BROKER_URL="mqtt://broker.hivemq.com:1883"
# PORT=3000
```

**Khởi tạo database:**

```bash
# Chạy migrations (tạo schema)
npx prisma migrate deploy

# Seed dữ liệu mẫu (optional)
npm run seed
```

**Chạy server:**

```bash
# Development mode với auto-reload
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

Test API:
```bash
curl http://localhost:3000/
# Response: {"success": true, "message": "Smart Scale IoT Backend API..."}
```

-  Screenshot terminal khi server start thành công:
<div align="center">
<img src="docs\BE_build.png" width="700"/>
</div>  
<p align="center"><em>Hình 6: Build BE</em></p>


#### 1.3. Frontend Web Application

**Yêu cầu:**
- Node.js >= 18.x

**Cài đặt:**

```bash
# Di chuyển vào thư mục FE
cd gr2/smart-scale-iot/FE

# Cài đặt dependencies
npm install

# Tạo file .env từ mẫu
cp .env.example .env

# Chỉnh sửa .env
# VITE_API_BASE_URL=http://localhost:3000/api
# VITE_MQTT_BROKER_URL=ws://broker.hivemq.com:8000/mqtt
```

**Chạy development server:**

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

**Build production:**

```bash
npm run build
npm run preview  # Preview production build
```

-  Screenshot terminal khi FE start thành công:
<div align="center">
<img src="docs\FE_build.png" width="700"/>
</div>  
<p align="center"><em>Hình 7: Build FE</em></p>

### Bước 2: Vận hành hệ thống

#### 2.1. Khởi động ESP32

1. **Power on**: Cắm nguồn vào ESP32
2. **Auto-connect WiFi**:
   - Nếu đã lưu WiFi trước đó → kết nối tự động
   - Nếu chưa → ESP32 tạo Access Point `SmartScale_XXXXXX`
3. **Cấu hình WiFi** (nếu cần):
   - Kết nối WiFi điện thoại/laptop vào AP `SmartScale_XXXXXX`
   - Trình duyệt tự động mở (Captive Portal)
   - Chọn WiFi và nhập password
   - ESP32 sẽ kết nối và lưu cấu hình

4. **MQTT Connection**:
   - Sau khi có Internet, ESP32 kết nối đến MQTT broker
   - OLED hiển thị: `WiFi: Connected`, `MQTT: Connected`

#### 2.2. Quy trình cân đo

**Từ ESP32 (Standalone):**

1. Màn hình OLED hiển thị: "Press W to start"
2. Mở Serial Monitor, nhập `w` hoặc `Enter`
3. Hệ thống đếm ngược 5s để bạn dọn cân
4. Tự động Tare (đặt điểm 0)
5. Đặt vật lên cân
6. Màn hình hiển thị trọng lượng real-time
7. Dữ liệu tự động gửi lên MQTT broker

#### 2.3. Xem lịch sử và thống kê

**Trên Web Dashboard:**

- **Tab Dashboard**: 
  - Xem biểu đồ 50 lần đo gần nhất
  - Theo dõi trọng lượng real-time
  - Thống kê lịch sử cân, trạng thái thiết bị cân

<div align="center">
<img src="docs\DashBoard.png" width="700"/>
</div>  
<p align="center"><em>Hình 8: Dashboard</em></p>

- **Tab History Log**:
  - Xem toàn bộ lịch sử (phân trang)
  - Filter theo thời gian, status, weight
  - Xóa bản ghi nếu cần

<div align="center">
<img src="docs\HistoryLog.png" width="700"/>
</div>  
<p align="center"><em>Hình 9: History log</em></p>

- **Tab User profile**:
  - Xem thông tin thiết bị user
  - Điều chỉnh thông tin user
  - Bật tắt thông báo email

<div align="center">
<img src="docs\UserProfile.png" width="700"/>
</div>  
<p align="center"><em>Hình 10: User profile</em></p>

- **Tab Device Settings**:
  - Xem thông tin thiết bị (Device ID, status, last seen,...)
  - Điều chỉnh calibration factor từ xa
  - Update offset
  - Điều chỉnh wifi kết nối

<div align="center">
<img src="docs\Setting.png" width="700"/>
</div>  
<p align="center"><em>Hình 11: Device Settings</em></p>

<div align="center">
<img src="docs\Network_setting.png" width="700"/>
</div>  
<p align="center"><em>Hình 12: Network setting</em></p>

## NGUYÊN LÝ CƠ BẢN

### 1. Kiến trúc tổng quan

Hệ thống Smart Scale IoT hoạt động theo mô hình phân tán với 3 tầng:

**Tầng 1: IoT Device Layer (ESP32)**
- Thu thập dữ liệu từ cảm biến vật lý
- Xử lý tín hiệu analog → digital (ADC 24-bit)
- Publish dữ liệu lên MQTT broker
- Nhận lệnh điều khiển từ cloud (subscribe)

**Tầng 2: Application Layer (Backend Server)**
- MQTT Client subscribe dữ liệu từ ESP32
- Lưu trữ vào PostgreSQL với timestamp
- Cung cấp RESTful API cho frontend
- Xử lý business logic (tính toán, validation)

**Tầng 3: Presentation Layer (Web Frontend)**
- MQTT WebSocket Client nhận real-time data
- Hiển thị UI/UX dashboard
- Biểu đồ, lịch sử, thống kê
- Gửi lệnh điều khiển thiết bị


### 2. Nguyên lý đo trọng lượng

#### 2.1. Load Cell và HX711

**Load Cell (Strain Gauge):**
- Nguyên lý: Hiệu ứng điện trở khi biến dạng
- Khi có lực nén/kéo → điện trở thay đổi → điện áp thay đổi
- Tín hiệu ra: mV (millivolt) rất nhỏ, cần khuếch đại

**HX711 ADC:**
- Khuếch đại tín hiệu từ Load Cell (Gain: 128x)
- Chuyển đổi analog → digital 24-bit (16.7 triệu mức)
- Giao tiếp với MCU qua 2 dây đơn giản (Data + Clock)
- Tốc độ: 10Hz hoặc 80Hz (có thể cấu hình)

#### 2.2. Quy trình xử lý tín hiệu
<div align="center">
<img src="docs\so_do_hx711.png" width="700"/>
</div>  
<p align="center"><em>Hình 13: Sơ đồ xử lý tín hiệu từ HX711</em></p>

### 3. Giao thức MQTT

#### 3.1. Tại sao dùng MQTT?

- **Lightweight**: Overhead thấp (~2 bytes header), tiết kiệm băng thông
- **Pub/Sub model**: Decoupling giữa publisher và subscriber
- **QoS levels**: Đảm bảo độ tin cậy (At most once, At least once, Exactly once)
- **Retained messages**: Client mới kết nối nhận được message cuối cùng
- **Last Will Testament**: Phát hiện thiết bị offline

#### 3.2. Topics Structure

**Kiến trúc Dual-Topic:**
Hệ thống sử dụng 2 nhóm topics riêng biệt cho Frontend (real-time) và Backend (database):

```
scale/
├── fe/                         # Frontend Topics (real-time)
│   ├── command                 # [ESP32 Sub] Lệnh từ FE: weigh, update_config, update_wifi
│   ├── data                    # [ESP32 Pub → FE Sub] Real-time weight data
│   └── response                # [ESP32 Pub → FE Sub] Response config/wifi updates
│
└── {deviceId}/                 # Backend Topics (database) - per device
    ├── data                    # [ESP32 Pub → BE Sub] Weight data cho database
    └── config                  # [ESP32 Pub → BE Sub] Config updates cho database
```

**Chi tiết Topics:**

| Topic | Direction | Payload | Mô tả |
|-------|-----------|---------|-------|
| `scale/fe/command` | FE → ESP32 | `{"action":"weigh"}` | Lệnh bắt đầu cân |
| | | `{"action":"update_config", "name":"...", "caliFactor":..., "offset":...}` | Cập nhật cấu hình |
| | | `{"action":"update_wifi", "ssid":"...", "password":"..."}` | Cập nhật WiFi |
| `scale/fe/data` | ESP32 → FE | `{"deviceId":"...", "weight":2.5, "status":"stable", "timestamp":...}` | Weight real-time |
| `scale/fe/response` | ESP32 → FE | `{"success":true, "message":"...", "action":"config"}` | Response config |
| | | `{"success":true, "message":"...", "action":"wifi", "ssid":"..."}` | Response WiFi |
| `scale/{deviceId}/data` | ESP32 → BE | `{"deviceId":"...", "name":"...", "weight":2.5, "weightStatus":"stable", ...}` | Weight + device info |
| `scale/{deviceId}/config` | ESP32 → BE | `{"deviceId":"...", "name":"...", "caliFactor":..., "offset":...}` | Config updates |

**Backend Subscribe Pattern:**
- `scale/+/data` - Wildcard để nhận từ tất cả devices
- `scale/+/config` - Wildcard để nhận config từ tất cả devices

### 4. Database Schema

**Prisma Schema (PostgreSQL):**

```prisma
// Bảng thiết bị (ESP32)
model Device {
  id         Int      @id @default(autoincrement())
  deviceId   String   @unique @map("device_id") @db.VarChar(100)
  name       String   @db.VarChar(100)
  status     String   @default("offline") @db.VarChar(20)
  caliFactor Float    @default(-20498.12) @map("cali_factor")
  offset     BigInt   @default(0)
  lastSeen   DateTime @default(now()) @map("last_seen") @db.Timestamp(6)
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  
  weights    WeightData[]                // Quan hệ 1-nhiều
  
  @@map("devices")
}

// Bảng dữ liệu cân
model WeightData {
  id        Int      @id @default(autoincrement())
  weight    Decimal  @db.Decimal(10, 3)
  status    String   @db.VarChar(20)
  timestamp DateTime @default(now()) @db.Timestamp(6)
  deviceId  String   @map("device_id") @db.VarChar(100)
  
  device    Device   @relation(fields: [deviceId], references: [deviceId], onDelete: Cascade)
  
  @@index([deviceId])
  @@index([timestamp(sort: Desc)])
  @@map("weight_data")
}

// Bảng người dùng
model User {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(100)
  email       String   @unique @db.VarChar(100)
  phone       String?  @db.VarChar(50)
  location    String?  @db.VarChar(100)
  bio         String?  @db.Text
  password    String   @db.VarChar(255)
  avatarUrl   String?  @map("avatar_url") @db.Text
  coverUrl    String?  @map("cover_url") @db.Text
  joinDate    String   @default("August 2023") @map("join_date") @db.VarChar(50)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamp(6)
  
  @@map("users")
}
```

**Quan hệ:**
- **Device ↔ WeightData**: 1-N (1 device có nhiều weight records)
- **Cascade Delete**: Xóa Device → xóa tất cả WeightData liên quan
- **User**: Độc lập, quản lý thông tin người dùng hệ thống

- ERD (Entity Relationship Diagram)
<div align="center">
<img src="docs\erd_db.png" width="700"/>
</div>  
<p align="center"><em>Hình 14: ERD database</em></p>


### 5. Luồng dữ liệu End-to-End

**Latency:**
- ESP32 → MQTT Broker: ~20-50ms (WiFi)
- MQTT Broker → Backend: ~10-30ms (local network)
- Backend → Frontend: ~10-20ms (WebSocket)

**Scenario: Người dùng muốn cân một vật và gửi lệnh từ Frontend**
<div align="center">
<img src="docs\scale_sq_diagram.png" width="700"/>
</div>  
<p align="center"><em>Hình 15: Sequence Diagram</em></p>

## KẾT QUẢ

### 1. Thành tựu đạt được

**Hoàn thành đầy đủ hệ thống IoT 3 tầng**:
- Tầng Device: ESP32 với các cảm biến
- Tầng Server: Backend Node.js + Database
- Tầng Client: Web dashboard responsive

**Khả năng mở rộng**: 
- API RESTful cho tích hợp bên thứ 3
- WebSocket/MQTT cho real-time


### 2. Hướng phát triển tương lai

1. **Bảo mật**:
   - Implement JWT authentication
   - SSL/TLS cho MQTT (port 8883)
   - Role-based access control

2. **Tính năng**:
   - Mobile app (React Native / Flutter)
   - Push notification (Firebase)
   - Email/SMS alert khi vượt ngưỡng
   - Machine Learning để phát hiện anomaly

3. **Triển khai**:
   - Docker containerization
   - Kubernetes orchestration
   - CI/CD pipeline (GitHub Actions)
   - Cloud deployment (AWS/Azure/GCP)
