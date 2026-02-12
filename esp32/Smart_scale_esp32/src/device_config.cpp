/*
 * Device Configuration - Implementation
 */

#include "device_config.h"
#include "constants.h"
#include <esp_system.h>
#include <Preferences.h>

// Global device config
static DeviceConfig globalConfig;
static bool initialized = false;
static Preferences preferences;

// NVS namespace
const char* NVS_NAMESPACE = "device_cfg";

// Initialize device config with defaults
static void device_init_config() {
  if (initialized) return;
  
  // Get MAC address as device ID
  uint8_t mac[6];
  esp_read_mac(mac, ESP_MAC_WIFI_STA);
  char macStr[13];
  sprintf(macStr, "%02x%02x%02x%02x%02x%02x", 
          mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  
  globalConfig.deviceId = String(macStr);
  globalConfig.name = "SmartScale-" + String(macStr).substring(6); // Last 6 chars
  globalConfig.caliFactor = CALIBRATION_FACTOR;
  globalConfig.offset = 0; // Will be set during tare
  
  // Try to load from NVS (overrides defaults if exists)
  device_load_config();
  
  initialized = true;
}

// Get device configuration
DeviceConfig device_get_config() {
  if (!initialized) {
    device_init_config();
  }
  return globalConfig;
}

// Update device configuration from command
void device_update_config(const String& name, float caliFactor, long offset) {
  if (!initialized) {
    device_init_config();
  }
  
  if (name.length() > 0) {
    globalConfig.name = name;
  }
  if (caliFactor != 0) {
    globalConfig.caliFactor = caliFactor;
  }
  globalConfig.offset = offset;
  
  Serial.println("[Device] Config updated:");
  Serial.print("  Name: "); Serial.println(globalConfig.name);
  Serial.print("  CaliFactor: "); Serial.println(globalConfig.caliFactor);
  Serial.print("  Offset: "); Serial.println(globalConfig.offset);
  
  // Save to NVS for persistence
  device_save_config();
}

// Save device configuration to NVS
void device_save_config() {
  preferences.begin(NVS_NAMESPACE, false); // Read-write mode
  
  preferences.putString("name", globalConfig.name);
  preferences.putFloat("caliFactor", globalConfig.caliFactor);
  preferences.putLong("offset", globalConfig.offset);
  
  preferences.end();
  Serial.println("[Device] Config saved to NVS");
}

// Load device configuration from NVS
void device_load_config() {
  preferences.begin(NVS_NAMESPACE, true); // Read-only mode
  
  // Check if config exists in NVS
  if (preferences.isKey("name")) {
    globalConfig.name = preferences.getString("name", globalConfig.name);
    globalConfig.caliFactor = preferences.getFloat("caliFactor", globalConfig.caliFactor);
    globalConfig.offset = preferences.getLong("offset", globalConfig.offset);
    
    Serial.println("[Device] Config loaded from NVS:");
    Serial.print("  Name: "); Serial.println(globalConfig.name);
    Serial.print("  CaliFactor: "); Serial.println(globalConfig.caliFactor);
    Serial.print("  Offset: "); Serial.println(globalConfig.offset);
  } else {
    Serial.println("[Device] No saved config in NVS, using defaults");
  }
  
  preferences.end();
}
