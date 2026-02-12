/*
 * =====================================================================
 * ESP32 Smart Scale - Hardware Constants
 * =====================================================================
 * Pin definitions and calibration constants for HX711 load cell
 * and OLED display (Simplified version)
 */

#ifndef CONSTANTS_H
#define CONSTANTS_H

// ===== HX711 LOAD CELL PINS =====
#define HX711_DOUT_PIN      16      // Data pin from HX711
#define HX711_SCK_PIN       4       // Clock pin to HX711

// ===== OLED DISPLAY I2C =====
#define OLED_SDA_PIN        21      // I2C Data pin
#define OLED_SCL_PIN        22      // I2C Clock pin
#define OLED_ADDRESS        0x3C    // I2C address (try 0x3D if not working)
#define OLED_RESET          -1      // Reset pin (-1 if not used)
#define SCREEN_WIDTH        128     // OLED display width in pixels
#define SCREEN_HEIGHT       64      // OLED display height in pixels

// ===== SCALE CALIBRATION =====
// #define CALIBRATION_FACTOR  19676.0f    // HX711 calibration factor for 200kg load cell
// #define CALIBRATION_FACTOR  500.0f    // HX711 calibration factor for 200kg load cell
#define CALIBRATION_FACTOR  -20498.12f

// ===== WIFI FALLBACK CONFIGURATION =====
// Used when WiFi config fails or as backup
#define DEFAULT_WIFI_SSID       "Hoang"      // Replace with your WiFi SSID
#define DEFAULT_WIFI_PASSWORD   "19042004"  // Replace with your WiFi password

// ===== MQTT BROKER CONFIGURATION =====
#define MQTT_BROKER             "broker.hivemq.com" // HiveMQ public broker
#define MQTT_PORT               1883                 // MQTT port (1883 for non-SSL)

// ===== WEIGHING SETTINGS =====
#define TARE_COUNTDOWN_SEC  5           // Countdown time for user to clear scale (5 seconds)
#define WEIGHT_SAMPLES      10          // Number of samples to average for each reading (increased for stability)
#define STABILIZATION_TIME  3000        // Time to wait for scale stabilization after placing item (ms)

#endif
