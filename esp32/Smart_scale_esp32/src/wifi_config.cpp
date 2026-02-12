/*
 * =====================================================================
 * WiFi Configuration Module - Implementation (Using siotcore_sdk_v2)
 * =====================================================================
 * Wrapper for WiFiSelfEnroll library
 * Provides simple WiFi configuration with web interface
 * Includes Captive Portal for automatic redirect
 * Includes Web Weighing Interface with button
 */

#include "wifi_config.h"
#include "oled_display.h"
#include "constants.h"
#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>

// External state machine variables from main.cpp
extern bool weighing_in_progress;
extern float last_weight;
extern int current_state;
extern void start_weighing();

// WiFi handler using siotcore library
static WiFiSelfEnroll* wifi_handler = nullptr;

// DNS Server for Captive Portal
static DNSServer* dns_server = nullptr;
static const byte DNS_PORT = 53;

// Web server for captive portal redirect and weighing interface
static WebServer* weigh_server = nullptr;

// Flag to check if we're in AP mode or captive portal mode
static bool is_captive_portal_active = false;

// HTML page for weighing interface
const char WEIGH_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ESP32 Smart Scale</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
            text-align: center;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 28px;
        }
        .status {
            padding: 12px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 16px;
            border: 2px solid #ddd;
        }
        .status.idle { 
            background: #f9f9f9; 
            color: #666;
            border-color: #ddd;
        }
        .status.busy { 
            background: #fff3cd; 
            color: #856404;
            border-color: #ffc107;
        }
        .status.complete { 
            background: #d4edda; 
            color: #155724;
            border-color: #28a745;
        }
        .weight {
            font-size: 42px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 15px 50px;
            font-size: 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.2s;
        }
        button:hover:not(:disabled) {
            background: #0056b3;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .info {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Smart Scale</h1>
        <div id="status" class="status idle">Ready</div>
        <div id="weight" class="weight">--</div>
        <button id="weighBtn" onclick="startWeigh()">CÂN</button>
        <div class="info">
            <p>Nhấn nút CÂN để bắt đầu cân</p>
            <p id="countdown"></p>
        </div>
    </div>
    
    <script>
        let updateInterval;
        
        function startWeigh() {
            fetch('/api/start-weigh')
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('weighBtn').disabled = true;
                        startStatusPolling();
                    } else {
                        alert(data.message || 'Lỗi: Đang cân');
                    }
                })
                .catch(err => alert('Lỗi kết nối'));
        }
        
        function startStatusPolling() {
            if (updateInterval) clearInterval(updateInterval);
            updateInterval = setInterval(updateStatus, 500);
        }
        
        function updateStatus() {
            fetch('/api/status')
                .then(r => r.json())
                .then(data => {
                    const statusDiv = document.getElementById('status');
                    const weightDiv = document.getElementById('weight');
                    const btnDiv = document.getElementById('weighBtn');
                    const countdownDiv = document.getElementById('countdown');
                    
                    if (data.busy) {
                        btnDiv.disabled = true;
                        statusDiv.className = 'status busy';
                        statusDiv.textContent = data.state_text;
                        
                        if (data.countdown > 0) {
                            countdownDiv.textContent = '⏱️ ' + data.countdown + ' giây';
                        } else {
                            countdownDiv.textContent = '';
                        }
                        
                        if (data.weight > 0) {
                            weightDiv.textContent = data.weight.toFixed(2) + ' kg';
                        }
                    } else {
                        btnDiv.disabled = false;
                        if (data.weight > 0) {
                            statusDiv.className = 'status complete';
                            statusDiv.textContent = '✅ Hoàn thành';
                            weightDiv.textContent = data.weight.toFixed(2) + ' kg';
                        } else {
                            statusDiv.className = 'status idle';
                            statusDiv.textContent = 'Sẵn sàng';
                            weightDiv.textContent = '--';
                        }
                        countdownDiv.textContent = '';
                        clearInterval(updateInterval);
                    }
                })
                .catch(err => console.error(err));
        }
        
        // Initial status check
        updateStatus();
        setInterval(updateStatus, 2000);
    </script>
</body>
</html>
)rawliteral";

// HTML redirect page
const char REDIRECT_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=http://192.168.15.1/enroll">
    <script>window.location.href = "http://192.168.15.1/enroll";</script>
</head>
<body>
    <p>Redirecting to WiFi setup page...</p>
    <p>If not redirected, <a href="http://192.168.15.1/enroll">click here</a></p>
</body>
</html>
)rawliteral";

/**
 * Handle captive portal redirect for all requests
 */
void handle_captive_portal() {
    String url = weigh_server->uri();
    
    // If accessing root or any other page, redirect to setup page
    if (url != "/enroll" && url != "/cgi/scan" && url != "/cgi/save" && 
        url != "/cgi/settings" && url != "/restart") {
        weigh_server->send(200, "text/html", REDIRECT_HTML);
    } else {
        weigh_server->send(404, "text/plain", "Not found");
    }
}

/**
 * Setup DNS and Web server for Captive Portal
 */
void setup_captive_portal() {
    if (is_captive_portal_active) return;
    
    // Start DNS Server
    if (dns_server == nullptr) {
        dns_server = new DNSServer();
    }
    if (dns_server != nullptr) {
        dns_server->start(DNS_PORT, "*", IPAddress(192, 168, 15, 1));
        Serial.println("[Captive Portal] DNS Server started on 192.168.15.1");
    }
    
    is_captive_portal_active = true;
    Serial.println("[Captive Portal] Activated!");
}

/**
 * Stop Captive Portal services
 */
void stop_captive_portal() {
    if (dns_server != nullptr) {
        dns_server->stop();
        delete dns_server;
        dns_server = nullptr;
    }
    
    is_captive_portal_active = false;
    Serial.println("[Captive Portal] Deactivated!");
}

/**
 * Toggle Captive Portal on/off
 */
void wifi_toggle_captive_portal() {
    if (is_captive_portal_active) {
        stop_captive_portal();
        Serial.println("[System] Captive Portal OFF");
    } else {
        setup_captive_portal();
        Serial.println("[System] Captive Portal ON");
    }
}

/**
 * Process DNS requests (call in loop)
 */
void process_captive_portal() {
    if (is_captive_portal_active && dns_server != nullptr) {
        dns_server->processNextRequest();
    }
}

// =====================================================================
// WEB SERVER API HANDLERS
// =====================================================================

/**
 * API: Start weighing
 */
void handle_api_start_weigh() {
    if (weighing_in_progress) {
        weigh_server->send(200, "application/json", 
            "{\"success\":false,\"message\":\"Busy - already weighing\"}");
    } else {
        start_weighing();
        weigh_server->send(200, "application/json", 
            "{\"success\":true,\"message\":\"Weighing started\"}");
    }
}

/**
 * API: Get weighing status
 */
void handle_api_status() {
    extern int countdown_value;
    
    String state_text = "Ready";
    switch (current_state) {
        case 0: state_text = "Sẵn sàng"; break;  // IDLE
        case 1: state_text = "Xóa cân"; break;  // TARE_COUNTDOWN
        case 2: state_text = "Đang tare"; break;  // TARING
        case 3: state_text = "Đặt vật"; break;  // WEIGH_COUNTDOWN
        case 4: state_text = "Đang cân"; break;  // WEIGHING
        case 5: state_text = "Hoàn thành"; break;  // COMPLETE
    }
    
    String json = "{";
    json += "\"busy\":" + String(weighing_in_progress ? "true" : "false") + ",";
    json += "\"state\":" + String(current_state) + ",";
    json += "\"state_text\":\"" + state_text + "\",";
    json += "\"countdown\":" + String(countdown_value) + ",";
    json += "\"weight\":" + String(last_weight, 2);
    json += "}";
    
    weigh_server->send(200, "application/json", json);
}

/**
 * Handle main weighing page
 */
void handle_weigh_page() {
    weigh_server->send(200, "text/html", WEIGH_HTML);
}

/**
 * Start web server with weighing interface
 */
void wifi_start_weigh_server() {
    if (weigh_server != nullptr) {
        Serial.println("[Web Server] Already running");
        return;
    }
    
    weigh_server = new WebServer(80);
    
    if (weigh_server == nullptr) {
        Serial.println("[Web Server] ERROR: Failed to create server");
        return;
    }
    
    // Setup routes
    weigh_server->on("/", handle_weigh_page);
    weigh_server->on("/api/start-weigh", handle_api_start_weigh);
    weigh_server->on("/api/status", handle_api_status);
    weigh_server->onNotFound(handle_captive_portal);
    
    weigh_server->begin();
    Serial.println("[Web Server] Started on port 80");
    Serial.print("[Web Server] Access at: http://");
    Serial.println(wifi_get_ip());
}

/**
 * Handle web server requests (call in loop)
 */
void wifi_handle_weigh_server() {
    if (weigh_server != nullptr) {
        weigh_server->handleClient();
    }
    process_captive_portal();
}

/**
 * Initialize WiFi configuration system
 * This will:
 * 1. Try to connect to saved WiFi credentials
 * 2. If fails or BOOT button pressed, start AP mode with web interface
 * 3. Enable Captive Portal for automatic redirect
 * 4. Block until WiFi is configured and connected
 * 
 * Default AP credentials:
 * - SSID: "ESP32-SmartScale" 
 * - Password: "12345678"
 */
bool wifi_config_init() {
    Serial.println("\n[WiFi] Initializing WiFi configuration...");
    
    // Create WiFi handler
    wifi_handler = new WiFiSelfEnroll();
    
    if (wifi_handler == nullptr) {
        Serial.println("[WiFi] ERROR: Failed to create WiFi handler!");
        return false;
    }
    
    Serial.println("[WiFi] Starting WiFi configuration system...");
    Serial.println("[WiFi] ========================================");
    Serial.println("[WiFi] INSTRUCTIONS:");
    Serial.println("[WiFi] 1. If WiFi saved → Auto-connect");
    Serial.println("[WiFi] 2. If no WiFi or press BOOT button:");
    Serial.println("[WiFi]    - AP will start: ESP32-SmartScale");
    Serial.println("[WiFi]    - Password: 12345678");
    Serial.println("[WiFi]    - Connect your phone/laptop");
    Serial.println("[WiFi]    - Browser will AUTO-OPEN setup page!");
    Serial.println("[WiFi]    - (Or go to: http://192.168.15.1)");
    Serial.println("[WiFi] ========================================\n");
    
    // Check BOOT button (GPIO 9)
    pinMode(9, INPUT_PULLUP);
    delay(100);
    bool boot_pressed = (digitalRead(9) == LOW);
    
    if (boot_pressed) {
        Serial.println("[WiFi] BOOT button pressed - Forcing AP mode!");
    }
    
    // Check if WiFi is already configured
    wifi_handler->ReadWiFiConfig();
    String saved_ssid = String(wifi_handler->GetSSID());
    
    // // If no saved config, save default WiFi to flash
    // if (saved_ssid.length() == 0) {
    //     Serial.println("[WiFi] No saved config, writing default WiFi to flash...");
    //     Preferences prefs;
    //     prefs.begin("WiFiSelfEnroll", false);
    //     prefs.putString("ssid", DEFAULT_WIFI_SSID);
    //     prefs.putString("pass", DEFAULT_WIFI_PASSWORD);
    //     prefs.end();
        
    //     // Re-read config
    //     wifi_handler->ReadWiFiConfig();
    //     saved_ssid = String(wifi_handler->GetSSID());
    //     Serial.print("[WiFi] Default WiFi saved: ");
    //     Serial.println(saved_ssid);
    // }
    
    if (saved_ssid.length() > 0 && !boot_pressed) {
        // Try to connect to saved WiFi
        Serial.print("[WiFi] Found saved WiFi: ");
        Serial.println(saved_ssid);
        Serial.println("[WiFi] Attempting to connect...");
        
        if (wifi_handler->IsConfigOK()) {
            // Connected successfully
            Serial.println("\n[WiFi] ✓ WiFi Connected Successfully!");
            Serial.print("[WiFi] SSID: ");
            Serial.println(wifi_get_ssid());
            Serial.print("[WiFi] IP Address: ");
            Serial.println(wifi_get_ip());
            Serial.print("[WiFi] Signal Strength: ");
            Serial.print(WiFi.RSSI());
            Serial.println(" dBm\n");
            return true;
        }
        
        // Saved WiFi failed, try default WiFi from constants.h
        Serial.println("[WiFi] Saved WiFi failed, trying default WiFi...");
        Serial.print("[WiFi] Default SSID: ");
        Serial.println(DEFAULT_WIFI_SSID);
        
        WiFi.begin(DEFAULT_WIFI_SSID, DEFAULT_WIFI_PASSWORD);
        int attempts = 0;
        while (WiFi.status() != WL_CONNECTED && attempts < 20) {
            delay(500);
            Serial.print(".");
            attempts++;
        }
        Serial.println();
        
        if (WiFi.status() == WL_CONNECTED) {
            Serial.println("[WiFi] ✓ Connected to default WiFi!");
            Serial.print("[WiFi] IP Address: ");
            Serial.println(WiFi.localIP());
            Serial.print("[WiFi] Signal Strength: ");
            Serial.print(WiFi.RSSI());
            Serial.println(" dBm\n");
            return true;
        }
        
        Serial.println("[WiFi] Default WiFi also failed.");
    }
    
    // Ensure clean disconnect before starting AP mode
    WiFi.disconnect(true);
    WiFi.mode(WIFI_OFF);
    delay(1000); // Give LWIP time to cleanup
    
    // No saved WiFi or connection failed or BOOT pressed
    // Setup Captive Portal BEFORE starting AP
    Serial.println("[WiFi] Starting Captive Portal...");
    setup_captive_portal();
    
    // Start WiFi configuration with AP mode
    // Note: This will block, but we need to process DNS requests
    // We'll need to modify the approach
    
    Serial.println("[WiFi] Starting Access Point mode...");
    Serial.println("[WiFi] Captive Portal is ACTIVE!");
    Serial.println("[WiFi] Connect to 'ESP32-SmartScale' and browser will auto-open!\n");
    
    // Instead of calling wifi_handler->setup() which blocks,
    // we'll handle the AP mode ourselves with captive portal support
    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP("ESP32-SmartScale", "12345678");
    
    Serial.print("[WiFi] AP IP: ");
    Serial.println(WiFi.softAPIP());
    
    // Now we need to keep processing captive portal requests
    // while waiting for WiFi configuration
    unsigned long start_time = millis();
    const unsigned long timeout = 300000; // 5 minutes
    
    while (millis() - start_time < timeout) {
        process_captive_portal();
        delay(10);
        
        // Check if WiFi credentials were saved
        wifi_handler->ReadWiFiConfig();
        String new_ssid = String(wifi_handler->GetSSID());
        
        if (new_ssid.length() > 0 && new_ssid != saved_ssid) {
            Serial.println("\n[WiFi] New WiFi credentials detected!");
            Serial.println("[WiFi] Rebooting to connect...");
            delay(2000);
            ESP.restart();
        }
    }
    
    // Timeout - reboot
    Serial.println("[WiFi] Timeout - Rebooting...");
    ESP.restart();
    
    return false;
}

/**
 * Check if WiFi is connected
 */
bool wifi_is_connected() {
    return (WiFi.status() == WL_CONNECTED);
}

/**
 * Get connected WiFi SSID
 */
String wifi_get_ssid() {
    if (wifi_handler != nullptr) {
        return String(wifi_handler->GetSSID());
    }
    if (wifi_is_connected()) {
        return WiFi.SSID();
    }
    return "Not connected";
}

/**
 * Get IP address
 */
String wifi_get_ip() {
    if (wifi_is_connected()) {
        return WiFi.localIP().toString();
    }
    return "0.0.0.0";
}

/**
 * Update WiFi credentials and try to reconnect
 */
bool wifi_update_credentials(const String& ssid, const String& password) {
    Serial.println("\n[WiFi] Updating credentials...");
    Serial.print("[WiFi] New SSID: ");
    Serial.println(ssid);
    
    // Disconnect current WiFi
    WiFi.disconnect();
    delay(100);
    
    // Try to connect to new WiFi
    WiFi.begin(ssid.c_str(), password.c_str());
    
    Serial.println("[WiFi] Connecting to new WiFi...");
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    Serial.println();
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("[WiFi] ✓ Connected to new WiFi!");
        Serial.print("[WiFi] IP: ");
        Serial.println(WiFi.localIP());
        
        // Note: WiFi credentials will persist automatically in ESP32 NVS
        // No need to manually save when using WiFi.begin()
        
        return true;
    } else {
        Serial.println("[WiFi] ✗ Failed to connect to new WiFi");
        
        // Try to reconnect to old WiFi
        if (wifi_handler != nullptr) {
            wifi_handler->ReadWiFiConfig();
            String old_ssid = String(wifi_handler->GetSSID());
            if (old_ssid.length() > 0) {
                Serial.println("[WiFi] Reconnecting to previous WiFi...");
                wifi_handler->IsConfigOK(); // This will reconnect
            }
        }
        
        return false;
    }
}

/**
 * Monitor WiFi connection health
 * If disconnected for more than 30 seconds, automatically start AP mode
 * This prevents the device from being stuck without WiFi access
 */
static unsigned long last_wifi_check = 0;
static unsigned long wifi_disconnected_time = 0;
static bool wifi_fallback_active = false;
const unsigned long WIFI_CHECK_INTERVAL = 5000; // Check every 5 seconds
const unsigned long WIFI_FALLBACK_TIMEOUT = 30000; // 30 seconds without WiFi

void wifi_check_connection() {
    unsigned long now = millis();
    
    // Don't check too frequently
    if (now - last_wifi_check < WIFI_CHECK_INTERVAL) {
        return;
    }
    last_wifi_check = now;
    
    // If already in fallback mode, don't check
    if (wifi_fallback_active) {
        return;
    }
    
    // Check WiFi status
    if (WiFi.status() != WL_CONNECTED) {
        // WiFi disconnected
        if (wifi_disconnected_time == 0) {
            wifi_disconnected_time = now;
            Serial.println("\\n[WiFi] Connection lost! Starting fallback timer...");
        }
        
        // Check if disconnected for too long
        if (now - wifi_disconnected_time > WIFI_FALLBACK_TIMEOUT) {
            Serial.println("[WiFi] ⚠️ WiFi disconnected for 30+ seconds!");
            Serial.println("[WiFi] Starting AP mode for reconfiguration...");
            
            wifi_fallback_active = true;
            wifi_disconnected_time = 0;
            
            // Start AP mode for reconfiguration
            wifi_config_force_ap();
            
            // After reconfiguration, reboot
            Serial.println("[WiFi] Rebooting to apply new WiFi settings...");
            delay(2000);
            ESP.restart();
        }
    } else {
        // WiFi connected - reset disconnect timer
        if (wifi_disconnected_time > 0) {
            Serial.println("[WiFi] Connection restored!");
            wifi_disconnected_time = 0;
        }
    }
}

/**
 * Force WiFi configuration mode (ignores saved WiFi)
 * Opens AP mode for WiFi reconfiguration
 */
void wifi_config_force_ap() {
    Serial.println("\n[WiFi] Force WiFi Configuration Mode");
    Serial.println("[WiFi] ========================================");
    Serial.println("[WiFi] Starting WiFi configuration web interface...");
    Serial.println("[WiFi] This will take 5 minutes or until configured");
    Serial.println("[WiFi] ========================================\n");
    
    oled_show_message("WiFi Config...");
    
    // Stop weighing web server to free port 80
    if (weigh_server != nullptr) {
        Serial.println("[WiFi] Stopping weighing web server...");
        weigh_server->stop();
        delete weigh_server;
        weigh_server = nullptr;
    }
    
    // Use WiFiSelfEnroll library to handle AP mode + web server
    if (wifi_handler != nullptr) {
        Serial.println("[WiFi] Starting WiFiSelfEnroll web interface...");
        wifi_handler->SetupStation("ESP32-SmartScale", "12345678");
        // Note: SetupStation() will block for 5 minutes or until config saved
        // It automatically reboots after saving new WiFi credentials
    }
    
    // If we get here, timeout occurred - reboot to restart properly
    Serial.println("[WiFi] Configuration timeout - Rebooting...");
    delay(2000);
    ESP.restart();
}

// =====================================================================
// HELPER FUNCTIONS FOR WEB INTERFACE
// =====================================================================

/**
 * Get weighing status for web interface
 */
bool wifi_get_weigh_status() {
    return weighing_in_progress;
}

/**
 * Get weighing state as string
 */
String wifi_get_weigh_state() {
    switch (current_state) {
        case 0: return "IDLE";
        case 1: return "TARE_COUNTDOWN";
        case 2: return "TARING";
        case 3: return "WEIGH_COUNTDOWN";
        case 4: return "WEIGHING";
        case 5: return "COMPLETE";
        default: return "UNKNOWN";
    }
}

/**
 * Get last weight reading
 */
float wifi_get_last_weight() {
    return last_weight;
}

/**
 * Trigger weighing from web interface
 */
void wifi_trigger_weigh() {
    start_weighing();
}
