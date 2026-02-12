/*
 * MQTT Client Module
 * Dual-topic architecture:
 * - FE real-time: scale/fe/command (sub), scale/fe/data (pub), scale/fe/response (pub)
 * - BE database: scale/{deviceId}/data (pub), scale/{deviceId}/config (pub)
 */

#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H

#include <Arduino.h>
#include <PubSubClient.h>
#include <WiFi.h>

bool mqtt_init();
bool mqtt_connect();
void mqtt_loop();
void mqtt_publish_weight_to_fe(float weight, const char* weightStatus);
void mqtt_publish_weight_to_be(float weight, const char* weightStatus);
void mqtt_publish_config_response(bool success, const char* message);
void mqtt_publish_wifi_response(bool success, const char* message, const char* ssid);
void mqtt_publish_config_to_be();
bool mqtt_is_connected();

#endif
