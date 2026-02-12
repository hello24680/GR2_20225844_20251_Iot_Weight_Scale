/*
 * =====================================================================
 * OLED Display Module - Implementation
 * =====================================================================
 */

#include "oled_display.h"

// Global display object
static Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
static bool initialized = false;

/**
 * Initialize the display
 */
bool oled_init() {
  Serial.println("\n[OLED] Initializing display...");

  // Initialize I2C
  Wire.begin(OLED_SDA_PIN, OLED_SCL_PIN);
  Serial.println("[OLED] I2C initialized");

  // Initialize display
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
    Serial.println("[OLED] ERROR: Display not found!");
    Serial.print("[OLED] Check I2C address (current: 0x");
    Serial.print(OLED_ADDRESS, HEX);
    Serial.println("). Try 0x3D if 0x3C fails.");
    return false;
  }

  Serial.println("[OLED] Display initialized successfully\n");
  initialized = true;
  
  // Clear display
  display.clearDisplay();
  display.display();
  
  return true;
}

/**
 * Show splash screen
 */
void oled_show_splash() {
  if (!initialized) return;

  display.clearDisplay();
  display.setTextSize(3);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 15);
  display.println("SMART");
  display.setCursor(10, 40);
  display.println("SCALE");
  display.display();
}

/**
 * Show countdown message
 */
void oled_show_countdown(int seconds) {
  if (!initialized) return;

  display.clearDisplay();
  
  // Title
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 5);
  display.println("Clear scale now!");
  
  // Countdown number (large)
  display.setTextSize(4);
  display.setCursor(50, 25);
  display.print(seconds);
  
  display.display();
}

/**
 * Display weight on OLED
 */
void oled_show_weight(float weight) {
  if (!initialized) return;

  display.clearDisplay();
  
  // Title
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Weight:");
  
  // Weight value (large)
  display.setTextSize(2);
  display.setCursor(5, 20);
  
  // Format weight with sign
  char weightStr[16];
  dtostrf(weight, 6, 2, weightStr); // width=6, precision=2
  display.print(weightStr);
  
  // Unit
  display.setTextSize(1);
  display.setCursor(95, 30);
  display.print("kg");
  
  // Bottom info
  display.setTextSize(1);
  display.setCursor(0, 55);
  display.print("Ready for next");
  
  display.display();
}

/**
 * Show a message
 */
void oled_show_message(const char* message) {
  if (!initialized) return;

  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  
  // Center the message
  int16_t x1, y1;
  uint16_t w, h;
  display.getTextBounds(message, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, (SCREEN_HEIGHT - h) / 2);
  
  display.print(message);
  display.display();
}

/**
 * Clear display
 */
void oled_clear() {
  if (!initialized) return;
  
  display.clearDisplay();
  display.display();
}
