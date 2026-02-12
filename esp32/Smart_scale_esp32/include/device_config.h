/*
 * Device Configuration - Store device metadata
 */

#ifndef DEVICE_CONFIG_H
#define DEVICE_CONFIG_H

#include <Arduino.h>

// Device metadata structure
struct DeviceConfig {
  String deviceId;        // MAC address
  String name;            // Device name
  float caliFactor;       // Calibration factor
  long offset;            // Zero offset
};

// Get device configuration
DeviceConfig device_get_config();

// Update device configuration from command
void device_update_config(const String& name, float caliFactor, long offset);

// Save device configuration to NVS
void device_save_config();

// Load device configuration from NVS
void device_load_config();

#endif
