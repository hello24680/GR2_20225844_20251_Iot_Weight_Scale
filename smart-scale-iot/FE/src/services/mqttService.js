/**
 * MQTT Service - Kết nối và xử lý MQTT messages
 * Functional style - No OOP
 */

import mqtt from 'mqtt';

// MQTT Configuration from environment variables
const MQTT_CONFIG = {
  broker: import.meta.env.VITE_MQTT_BROKER || 'ws://broker.hivemq.com:8000/mqtt',
  topics: {
    feCommand: 'scale/fe/command',
    feData: 'scale/fe/data',
    feResponse: 'scale/fe/response'
  },
  options: {
    clientId: `scale_fe_${Math.random().toString(16).slice(2, 8)}`,
    clean: true,
    reconnectPeriod: 10000, // Reconnect every 10 seconds (not 5)
    keepalive: 30, // Send ping every 30 seconds (more frequent)
    connectTimeout: 30000 // 30 second connection timeout
  }
};

// Global client instance
let mqttClient = null;
let weightCallback = null;
let configResponseCallback = null;

/**
 * Kết nối đến MQTT broker
 */
export const connectMqtt = () => {
  return new Promise((resolve, reject) => {
    if (mqttClient?.connected) {
      console.log('[MQTT] Already connected');
      resolve(mqttClient);
      return;
    }

    console.log('[MQTT] Connecting to broker:', MQTT_CONFIG.broker);
    mqttClient = mqtt.connect(MQTT_CONFIG.broker, MQTT_CONFIG.options);

    mqttClient.on('connect', () => {
      console.log('[MQTT] Connected successfully');
      
      // Subscribe to FE data topic for real-time weight
      mqttClient.subscribe(MQTT_CONFIG.topics.feData, (err) => {
        if (err) {
          console.error('[MQTT] Subscribe error:', err);
        } else {
          console.log('[MQTT] Subscribed to:', MQTT_CONFIG.topics.feData);
        }
      });

      // Subscribe to FE response topic for config updates
      mqttClient.subscribe(MQTT_CONFIG.topics.feResponse, (err) => {
        if (err) {
          console.error('[MQTT] Subscribe error:', err);
        } else {
          console.log('[MQTT] Subscribed to:', MQTT_CONFIG.topics.feResponse);
        }
      });

      resolve(mqttClient);
    });

    mqttClient.on('error', (err) => {
      console.error('[MQTT] Connection error:', err);
      reject(err);
    });

    mqttClient.on('message', handleMessage);

    mqttClient.on('reconnect', () => {
      console.log('[MQTT] Reconnecting...');
    });

    mqttClient.on('offline', () => {
      console.log('[MQTT] Client offline');
    });
  });
};

/**
 * Xử lý message nhận được
 */
const handleMessage = (topic, payload) => {
  console.log('[MQTT] Received message:', topic);
  
  if (topic === MQTT_CONFIG.topics.feData) {
    try {
      const data = JSON.parse(payload.toString());
      console.log('[MQTT] Weight data:', data);
      
      if (weightCallback) {
        weightCallback(data);
      }
    } catch (err) {
      console.error('[MQTT] Parse error:', err);
    }
  }
  
  if (topic === MQTT_CONFIG.topics.feResponse) {
    try {
      const data = JSON.parse(payload.toString());
      console.log('[MQTT] Config response:', data);
      
      if (configResponseCallback) {
        configResponseCallback(data);
      }
    } catch (err) {
      console.error('[MQTT] Parse error:', err);
    }
  }
};

/**
 * Gửi lệnh cân đến ESP32
 */
export const sendWeighCommand = () => {
  if (!mqttClient?.connected) {
    console.error('[MQTT] Not connected');
    return false;
  }

  const command = { action: 'weigh' };
  const payload = JSON.stringify(command);
  
  mqttClient.publish(MQTT_CONFIG.topics.feCommand, payload, { qos: 0 }, (err) => {
    if (err) {
      console.error('[MQTT] Publish error:', err);
    } else {
      console.log('[MQTT] Command sent:', command);
    }
  });

  return true;
};

/**
 * Gửi lệnh cập nhật config (name, caliFactor, offset) đến ESP32
 */
export const sendConfigUpdate = (config) => {
  if (!mqttClient?.connected) {
    console.error('[MQTT] Not connected');
    return false;
  }

  const command = {
    action: 'update_config',
    name: config.name,
    caliFactor: parseFloat(config.caliFactor),
    offset: parseInt(config.offset)
  };
  const payload = JSON.stringify(command);
  
  mqttClient.publish(MQTT_CONFIG.topics.feCommand, payload, { qos: 1 }, (err) => {
    if (err) {
      console.error('[MQTT] Publish error:', err);
    } else {
      console.log('[MQTT] Config update sent:', command);
    }
  });

  return true;
};

/**
 * Gửi lệnh cập nhật WiFi (ssid, password) đến ESP32
 */
export const sendWifiUpdate = (wifi) => {
  if (!mqttClient?.connected) {
    console.error('[MQTT] Not connected');
    return false;
  }

  const command = {
    action: 'update_wifi',
    ssid: wifi.ssid,
    password: wifi.password
  };
  const payload = JSON.stringify(command);
  
  mqttClient.publish(MQTT_CONFIG.topics.feCommand, payload, { qos: 1 }, (err) => {
    if (err) {
      console.error('[MQTT] Publish error:', err);
    } else {
      console.log('[MQTT] WiFi update sent:', command);
    }
  });

  return true;
};

/**
 * Subscribe weight updates
 */
export const onWeightUpdate = (callback) => {
  weightCallback = callback;
  return () => {
    weightCallback = null;
  };
};

/**
 * Subscribe config response updates
 */
export const onConfigResponse = (callback) => {
  configResponseCallback = callback;
  return () => {
    configResponseCallback = null;
  };
};

/**
 * Ngắt kết nối MQTT
 */
export const disconnectMqtt = () => {
  if (mqttClient) {
    mqttClient.end();
    mqttClient = null;
    console.log('[MQTT] Disconnected');
  }
};

/**
 * Kiểm tra trạng thái kết nối
 */
export const isConnected = () => {
  return mqttClient?.connected || false;
};
