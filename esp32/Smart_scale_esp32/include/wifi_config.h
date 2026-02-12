/*
 * =====================================================================
 * WiFi Configuration Module - Header (Using siotcore_sdk_v2)
 * =====================================================================
 * Simple WiFi configuration wrapper for WiFiSelfEnroll library
 * With Captive Portal support and Web Weighing Interface
 */

#ifndef WIFI_CONFIG_H
#define WIFI_CONFIG_H

#include <Arduino.h>
#include <WiFiSelfEnroll.h>
#include <DNSServer.h>

// Initialize WiFi configuration system (blocks until WiFi configured)
bool wifi_config_init();

// Force WiFi configuration mode (ignores saved WiFi)
void wifi_config_force_ap();

// Check if WiFi is connected
bool wifi_is_connected();

// Get current WiFi SSID
String wifi_get_ssid();

// Get IP address
String wifi_get_ip();

// Update WiFi credentials and reconnect
bool wifi_update_credentials(const String& ssid, const String& password);

// Monitor WiFi connection and auto-start AP if disconnected
void wifi_check_connection();

// Web server functions for weighing interface
void wifi_start_weigh_server();
void wifi_handle_weigh_server();
void wifi_toggle_captive_portal();

// State/status access for web interface
bool wifi_get_weigh_status();
String wifi_get_weigh_state();
float wifi_get_last_weight();
void wifi_trigger_weigh();

#endif // WIFI_CONFIG_H
