/*
 * =====================================================================
 * Scale Sensor Module - Implementation
 * =====================================================================
 */

#include "scale_sensor.h"

// Global HX711 object
static HX711 scale;
static bool initialized = false;

/**
 * Initialize the scale sensor
 */
bool scale_init() {
  Serial.println("\n[Scale] Initializing HX711...");

  // Initialize HX711
  scale.begin(HX711_DOUT_PIN, HX711_SCK_PIN);
  
  // Wait for HX711 to stabilize after power-on
  Serial.println("[Scale] Waiting for HX711 to stabilize...");
  delay(2000);
  
  // Check if scale is ready
  if (!scale.is_ready()) {
    Serial.println("[Scale] ERROR: HX711 not ready!");
    return false;
  }

  // Set calibration factor
  scale.set_scale(CALIBRATION_FACTOR);
  Serial.print("[Scale] Calibration factor: ");
  Serial.println(CALIBRATION_FACTOR);

  Serial.println("[Scale] Initialization complete\n");
  initialized = true;
  return true;
}

/**
 * Tare the scale (reset to zero)
 */
void scale_tare() {
  if (!initialized) {
    Serial.println("[Scale] ERROR: Scale not initialized!");
    return;
  }

  Serial.println("[Scale] Taring scale...");
  scale.tare(10);  // Average 10 readings for tare
  delay(500);
  Serial.println("[Scale] Tare complete (zero set)\n");
}

/**
 * Get current weight reading
 */
float scale_get_weight() {
  if (!initialized) {
    Serial.println("[Scale] ERROR: Scale not initialized!");
    return 0.0f;
  }

  if (!scale.is_ready()) {
    Serial.println("[Scale] WARNING: Scale not ready");
    return 0.0f;
  }

  // Get raw value for debugging
  long raw_value = scale.read_average(WEIGHT_SAMPLES);
  Serial.print("[Scale Debug] Raw value: ");
  Serial.println(raw_value);

  // Get weight with averaging
  float weight = scale.get_units(WEIGHT_SAMPLES);
  Serial.print("[Scale Debug] Converted weight: ");
  Serial.print(weight, 4);
  Serial.println(" kg");
  
  return weight;
}
