/*
 * =====================================================================
 * Scale Sensor Module - Header
 * =====================================================================
 * Functions-based HX711 load cell management
 * Handles weight reading and tare operations
 */

#ifndef SCALE_SENSOR_H
#define SCALE_SENSOR_H

#include <Arduino.h>
#include <HX711.h>
#include "constants.h"

// Initialize the scale sensor
bool scale_init();

// Tare the scale (reset to zero)
void scale_tare();

// Get current weight reading
float scale_get_weight();

#endif // SCALE_SENSOR_H
