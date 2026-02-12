/*
 * =====================================================================
 * OLED Display Module - Header
 * =====================================================================
 * Functions-based SSD1306 OLED display management
 * Handles UI rendering and display updates
 */

#ifndef OLED_DISPLAY_H
#define OLED_DISPLAY_H

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "constants.h"

// Initialize the display
bool oled_init();

// Show splash screen
void oled_show_splash();

// Show countdown message (for tare countdown)
void oled_show_countdown(int seconds);

// Display weight on OLED
void oled_show_weight(float weight);

// Show a message
void oled_show_message(const char* message);

// Clear display
void oled_clear();

#endif // OLED_DISPLAY_H
