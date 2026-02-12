/*
 * MQTT Client Module
 * Dual topics: FE (real-time) + BE (database)
 */

#include "mqtt_client.h"
#include "device_config.h"
#include "wifi_config.h"
#include <WiFiClient.h>
#include <ArduinoJson.h>

extern void start_weighing();

// MQTT Configuration
const char* MQTT_BROKER = "broker.hivemq.com";
const int MQTT_PORT = 1883;

static WiFiClient wifiClient;
static PubSubClient mqttClient(wifiClient);

// Topics for FE (real-time)
static const char* topicFeCommand = "scale/fe/command";
static const char* topicFeData = "scale/fe/data";
static const char* topicFeResponse = "scale/fe/response";

// Topics for BE (database)
static String topicBeData;    // scale/{deviceId}/data
static String topicBeConfig;  // scale/{deviceId}/config

// MQTT callback
static void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.print("[MQTT] <<< ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message);
  
  // Handle FE command (real-time weighing and config)
  if (String(topic) == topicFeCommand) {
    StaticJsonDocument<300> doc;
    DeserializationError error = deserializeJson(doc, message);
    
    if (error) {
      Serial.println("[MQTT] JSON parse failed");
      return;
    }
    
    const char* action = doc["action"];
    
    if (String(action) == "weigh") {
      Serial.println("[MQTT] FE weigh command!");
      start_weighing();
    }
    else if (String(action) == "update_config") {
      Serial.println("[MQTT] FE config update command!");
      
      const char* name = doc["name"];
      float caliFactor = doc["caliFactor"];
      long offset = doc["offset"];
      
      // Update device config
      device_update_config(String(name), caliFactor, offset);
      
      // Send response to FE
      mqtt_publish_config_response(true, "Configuration updated successfully");
      
      // Send updated config to BE for database storage
      delay(100);
      mqtt_publish_config_to_be();
    }
    else if (String(action) == "update_wifi") {
      Serial.println("[MQTT] FE WiFi update command!");
      
      const char* ssid = doc["ssid"];
      const char* password = doc["password"];
      
      // Try to connect to new WiFi
      bool success = wifi_update_credentials(String(ssid), String(password));
      
      // Wait for MQTT to reconnect (up to 10 seconds)
      if (success) {
        Serial.println("[MQTT] Waiting for MQTT reconnection...");
        int reconnect_attempts = 0;
        while (!mqttClient.connected() && reconnect_attempts < 20) {
          mqtt_connect();
          delay(500);
          reconnect_attempts++;
        }
        
        if (mqttClient.connected()) {
          delay(500); // Extra delay to ensure connection is stable
          mqtt_publish_wifi_response(true, "Connected to WiFi successfully", ssid);
          Serial.println("[MQTT] WiFi response sent!");
        } else {
          Serial.println("[MQTT] Failed to reconnect MQTT after WiFi change");
        }
      } else {
        // WiFi failed, should still be connected to old WiFi
        mqtt_publish_wifi_response(false, "Failed to connect to WiFi", ssid);
      }
    }
  }
}

// Initialize MQTT
bool mqtt_init() {
  Serial.println("\n[MQTT] Init...");
  
  DeviceConfig config = device_get_config();
  Serial.print("[MQTT] Device ID: ");
  Serial.println(config.deviceId);
  
  // Setup BE data topics based on device ID
  topicBeData = "scale/" + config.deviceId + "/data";
  topicBeConfig = "scale/" + config.deviceId + "/config";
  
  Serial.print("[MQTT] FE Command topic: ");
  Serial.println(topicFeCommand);
  Serial.print("[MQTT] FE Data topic: ");
  Serial.println(topicFeData);
  Serial.print("[MQTT] FE Response topic: ");
  Serial.println(topicFeResponse);
  Serial.print("[MQTT] BE Data topic: ");
  Serial.println(topicBeData);
  Serial.print("[MQTT] BE Config topic: ");
  Serial.println(topicBeConfig);
  
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqtt_callback);
  
  Serial.println("[MQTT] Initialized");
  return true;
}

// Connect to MQTT broker
bool mqtt_connect() {
  if (mqttClient.connected()) {
    return true;
  }
  
  Serial.print("[MQTT] Connecting to ");
  Serial.print(MQTT_BROKER);
  Serial.print(":");
  Serial.println(MQTT_PORT);
  
  DeviceConfig config = device_get_config();
  String clientId = "scale_" + config.deviceId;
  
  // Connect without auth (HiveMQ public)
  if (mqttClient.connect(clientId.c_str())) {
    Serial.println("[MQTT] Connected!");
    
    // Subscribe to FE command topic for real-time weighing
    if (mqttClient.subscribe(topicFeCommand)) {
      Serial.print("[MQTT] Subscribed: ");
      Serial.println(topicFeCommand);
    } else {
      Serial.println("[MQTT] Subscribe failed!");
    }
    
    return true;
  } else {
    Serial.print("[MQTT] Connection failed, rc=");
    Serial.println(mqttClient.state());
    return false;
  }
}

// Handle MQTT loop
void mqtt_loop() {
  if (!mqttClient.connected()) {
    static unsigned long lastReconnect = 0;
    unsigned long now = millis();
    
    if (now - lastReconnect > 5000) {
      lastReconnect = now;
      Serial.println("[MQTT] Reconnecting...");
      mqtt_connect();
    }
  } else {
    mqttClient.loop();
  }
}

// Publish lightweight weight data to FE (real-time display)
void mqtt_publish_weight_to_fe(float weight, const char* weightStatus) {
  if (!mqttClient.connected()) {
    Serial.println("[MQTT] Not connected");
    return;
  }
  
  DeviceConfig config = device_get_config();
  
  // Create lightweight JSON packet for FE real-time display
  StaticJsonDocument<200> doc;
  doc["deviceId"] = config.deviceId;
  doc["weight"] = serialized(String(weight, 3));
  doc["status"] = weightStatus;
  
  String payload;
  serializeJson(doc, payload);
  
  // Publish to FE data topic
  if (mqttClient.publish(topicFeData, payload.c_str())) {
    Serial.print("[MQTT] >>> FE: ");
    Serial.println(payload);
  } else {
    Serial.println("[MQTT] FE publish failed!");
  }
}

// Publish complete weight data packet to BE (database storage)
void mqtt_publish_weight_to_be(float weight, const char* weightStatus) {
  if (!mqttClient.connected()) {
    Serial.println("[MQTT] Not connected");
    return;
  }
  
  DeviceConfig config = device_get_config();
  
  // Create complete JSON packet with device metadata
  StaticJsonDocument<400> doc;
  doc["deviceId"] = config.deviceId;
  doc["name"] = config.name;
  doc["status"] = "online";
  doc["weight"] = serialized(String(weight, 3));
  doc["weightStatus"] = weightStatus;
  doc["caliFactor"] = serialized(String(config.caliFactor, 2));
  doc["offset"] = config.offset;
  
  String payload;
  serializeJson(doc, payload);
  
  // Publish to BE data topic
  if (mqttClient.publish(topicBeData.c_str(), payload.c_str())) {
    Serial.print("[MQTT] >>> BE: ");
    Serial.println(payload);
  } else {
    Serial.println("[MQTT] BE publish failed!");
  }
}

// Check if connected
bool mqtt_is_connected() {
  return mqttClient.connected();
}

// Publish config response to FE
void mqtt_publish_config_response(bool success, const char* message) {
  if (!mqttClient.connected()) {
    Serial.println("[MQTT] Not connected");
    return;
  }
  
  StaticJsonDocument<200> doc;
  doc["type"] = "config_update";
  doc["success"] = success;
  doc["message"] = message;
  
  String payload;
  serializeJson(doc, payload);
  
  if (mqttClient.publish(topicFeResponse, payload.c_str())) {
    Serial.print("[MQTT] >>> FE Response: ");
    Serial.println(payload);
  } else {
    Serial.println("[MQTT] FE Response publish failed!");
  }
}

// Publish WiFi response to FE
void mqtt_publish_wifi_response(bool success, const char* message, const char* ssid) {
  if (!mqttClient.connected()) {
    Serial.println("[MQTT] Not connected");
    return;
  }
  
  StaticJsonDocument<200> doc;
  doc["type"] = "wifi_update";
  doc["success"] = success;
  doc["message"] = message;
  if (success && ssid != nullptr) {
    doc["ssid"] = ssid;
  }
  
  String payload;
  serializeJson(doc, payload);
  
  if (mqttClient.publish(topicFeResponse, payload.c_str())) {
    Serial.print("[MQTT] >>> FE Response: ");
    Serial.println(payload);
  } else {
    Serial.println("[MQTT] FE Response publish failed!");
  }
}

// Publish config update to BE (for database storage)
void mqtt_publish_config_to_be() {
  if (!mqttClient.connected()) {
    Serial.println("[MQTT] Not connected");
    return;
  }
  
  DeviceConfig config = device_get_config();
  
  StaticJsonDocument<300> doc;
  doc["deviceId"] = config.deviceId;
  doc["name"] = config.name;
  doc["caliFactor"] = serialized(String(config.caliFactor, 2));
  doc["offset"] = config.offset;
  
  String payload;
  serializeJson(doc, payload);
  
  if (mqttClient.publish(topicBeConfig.c_str(), payload.c_str())) {
    Serial.print("[MQTT] >>> BE Config: ");
    Serial.println(payload);
  } else {
    Serial.println("[MQTT] BE Config publish failed!");
  }
}
