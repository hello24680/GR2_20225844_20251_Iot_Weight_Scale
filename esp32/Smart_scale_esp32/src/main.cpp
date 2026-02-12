/*
 * =====================================================================
 * ESP32 Smart Scale - Main Application (Simplified)
 * =====================================================================
 * Features:
 * - HX711 Load Cell for weight measurement
 * - OLED SSD1306 Display (128x64)
 * - Simple weighing process: confirm -> tare countdown -> weigh -> display
 * 
 * Process:
 * 1. User confirms via Serial (press 'w' or Enter)
 * 2. System shows 5-second countdown to clear scale
 * 3. After countdown, system tares (sets zero)
 * 4. User can place item on scale
 * 5. Weight is displayed on OLED and Serial
 */

#include <Arduino.h>
#include "constants.h"
#include "scale_sensor.h"
#include "oled_display.h"
#include "wifi_config.h"
#include "mqtt_client.h"

// =====================================================================
// STATE MACHINE FOR NON-BLOCKING WEIGHING
// =====================================================================
enum WeighState {
  IDLE,                 // Waiting for user to start
  TARE_COUNTDOWN,       // Countdown before tare (clear scale)
  TARING,              // Performing tare operation
  WEIGH_COUNTDOWN,     // Countdown to place item
  WEIGHING,            // Reading weight
  COMPLETE             // Display result
};

// Global state variables (exported for web interface access)
WeighState current_state = IDLE;
unsigned long state_start_time = 0;
int countdown_value = 0;
float last_weight = 0.0f;
bool weighing_in_progress = false;

// =====================================================================
// FUNCTION DECLARATIONS
// =====================================================================
void process_state_machine();
void start_weighing();
void handle_serial_input();

// =====================================================================
// SETUP
// =====================================================================
void setup() {
  // Initialize Serial
  Serial.begin(115200);
  delay(500);
  
  Serial.println("\n\n=======================================");
  Serial.println("    ESP32 SMART SCALE - Simple Version");
  Serial.println("=======================================\n");

  // Initialize OLED Display
  if (!oled_init()) {
    Serial.println("[FATAL] OLED initialization failed!");
    Serial.println("Check I2C connections and address");
    while (1) { delay(1000); }
  }

  // Show splash screen
  oled_show_splash();
  delay(2000);

  // Initialize Scale Sensor
  if (!scale_init()) {
    Serial.println("[FATAL] Scale initialization failed!");
    Serial.println("Check HX711 connections (DOUT, SCK pins)");
    oled_show_message("Scale Error!");
    while (1) { delay(1000); }
  }

  // Initialize WiFi Configuration (Non-blocking with web interface)
  oled_show_message("WiFi Setup...");
  if (!wifi_config_init()) {
    Serial.println("[WARNING] WiFi initialization failed!");
    Serial.println("Continuing without WiFi...");
    oled_show_message("WiFi Failed!");
    delay(2000);
  } else {
    oled_show_message("WiFi OK!");
    delay(1000);
  }

  // Start web server with weighing interface
  wifi_start_weigh_server();

  // Initialize MQTT client
  mqtt_init();
  if (mqtt_connect()) {
    Serial.println("[MQTT] MQTT connected and ready!");
  } else {
    Serial.println("[MQTT] MQTT connection failed, will retry...");
  }

  Serial.println("=======================================");
  Serial.println("System Ready!");
  Serial.println("=======================================\n");
  Serial.println("Commands:");
  Serial.println("  'w' or Enter - Start weighing");
  Serial.println("  'q'          - WiFi configuration");
  Serial.println("  'c'          - Toggle Captive Portal");
  Serial.println("---------------------------------------");
  Serial.print("Web Interface: http://");
  Serial.println(wifi_get_ip());
  Serial.println("---------------------------------------\n");

  // Show ready message
  oled_show_message("Ready!");
  delay(1000);
  oled_clear();
}


// =====================================================================
// MAIN LOOP (NON-BLOCKING)
// =====================================================================
void loop() {
  // Monitor WiFi connection health (auto-fallback to AP if disconnected)
  wifi_check_connection();
  
  // Process web server requests
  wifi_handle_weigh_server();
  
  // Handle MQTT messages (only if WiFi is connected)
  if (wifi_is_connected()) {
    mqtt_loop();
  }
  
  // Handle serial commands (non-blocking)
  handle_serial_input();
  
  // Process weighing state machine
  process_state_machine();
  
  // Small delay to prevent watchdog issues
  delay(10);
}

// =====================================================================
// WEIGHING CONTROL FUNCTIONS
// =====================================================================

/**
 * Start weighing process (called from web or serial)
 */
void start_weighing() {
  if (weighing_in_progress) {
    Serial.println("[Weighing] BUSY - Already weighing!");
    return;
  }
  
  Serial.println("\n[Weighing] Starting weighing process...");
  current_state = TARE_COUNTDOWN;
  countdown_value = TARE_COUNTDOWN_SEC;
  state_start_time = millis();
  weighing_in_progress = true;
  last_weight = 0.0f;
}

/**
 * Handle serial input (non-blocking)
 */
void handle_serial_input() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    // Clear serial buffer
    while (Serial.available() > 0) {
      Serial.read();
    }
    
    // 'w' or Enter - Start weighing
    if (cmd == 'w' || cmd == 'W' || cmd == '\n' || cmd == '\r') {
      start_weighing();
    }
    // 'q' - WiFi configuration
    else if (cmd == 'q' || cmd == 'Q') {
      Serial.println("\n[System] Opening WiFi Configuration...");
      wifi_config_force_ap();
    }
    // 'c' - Toggle captive portal
    else if (cmd == 'c' || cmd == 'C') {
      wifi_toggle_captive_portal();
    }
  }
}

/**
 * Process non-blocking state machine
 */
void process_state_machine() {
  unsigned long current_time = millis();
  unsigned long elapsed = current_time - state_start_time;
  
  switch (current_state) {
    case IDLE:
      // Waiting for user input
      if (!weighing_in_progress) {
        static unsigned long last_idle_update = 0;
        if (current_time - last_idle_update > 5000) {
          oled_show_message("Ready!");
          last_idle_update = current_time;
        }
      }
      break;
      
    case TARE_COUNTDOWN:
      // Countdown before tare (update every second)
      if (elapsed >= 1000) {
        countdown_value--;
        if (countdown_value > 0) {
          Serial.print("[Tare Countdown] ");
          Serial.println(countdown_value);
          oled_show_countdown(countdown_value);
          state_start_time = current_time;
        } else {
          // Countdown complete, move to taring
          Serial.println("[Countdown] 0 - Taring now!\n");
          current_state = TARING;
          state_start_time = current_time;
        }
      }
      break;
      
    case TARING:
      // Perform tare operation
      oled_show_message("TARE...");
      scale_tare();
      Serial.println("[Weighing] Tare complete. Place item on scale.\n");
      
      // Move to weigh countdown
      current_state = WEIGH_COUNTDOWN;
      countdown_value = 5;
      state_start_time = current_time;
      break;
      
    case WEIGH_COUNTDOWN:
      // Countdown before weighing (update every second)
      if (elapsed >= 1000) {
        countdown_value--;
        if (countdown_value > 0) {
          Serial.print("[Place Item] ");
          Serial.println(countdown_value);
          oled_show_countdown(countdown_value);
          state_start_time = current_time;
        } else {
          // Countdown complete, move to weighing
          Serial.println("[Place Item] Weighing now...\n");
          current_state = WEIGHING;
          state_start_time = current_time;
        }
      }
      break;
      
    case WEIGHING:
      // Wait for stabilization
      if (elapsed < STABILIZATION_TIME) {
        oled_show_message("Stabilizing...");
      } else {
        // Read weight
        Serial.println("[Weighing] Reading weight...");
        oled_show_message("Reading...");
        
        last_weight = scale_get_weight();
        
        Serial.print("[Result] Weight: ");
        Serial.print(last_weight, 2);
        Serial.println(" kg");
        
        oled_show_weight(last_weight);
        
        Serial.println("[Weighing] Complete!\n");
        
        // Move to complete state
        current_state = COMPLETE;
        state_start_time = current_time;
      }
      break;
      
    case COMPLETE:
      // Display result for 5 seconds
      if (elapsed >= 5000) {
        // Publish weight to BOTH FE (real-time) and BE (database)
        mqtt_publish_weight_to_fe(last_weight, "stable");
        mqtt_publish_weight_to_be(last_weight, "stable");
        
        // Return to idle
        current_state = IDLE;
        weighing_in_progress = false;
        Serial.println("---------------------------------------");
        Serial.println("Ready for next weighing (press 'w' or use web)");
        Serial.println("---------------------------------------\n");
      }
      break;
  }
}