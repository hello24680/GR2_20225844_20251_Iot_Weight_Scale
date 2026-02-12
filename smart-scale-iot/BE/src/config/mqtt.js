/**
 * MQTT Configuration
 * Subscribe: scale/+/data (receive weight data from all devices)
 * Publish: scale/{deviceId}/command (send commands to specific device)
 */

const mqtt = require('mqtt');

let mqttClient = null;

// Initialize MQTT connection
const initMQTT = () => {
  const broker = process.env.MQTT_BROKER || 'broker.hivemq.com';
  const port = process.env.MQTT_PORT || 1883;
  const username = process.env.MQTT_USERNAME;
  const password = process.env.MQTT_PASSWORD;

  const options = {
    clientId: `be_${Math.random().toString(16).slice(2, 10)}`,
    clean: true,
    reconnectPeriod: 1000,
  };

  if (username) options.username = username;
  if (password) options.password = password;

  console.log(`[MQTT] Connecting to ${broker}:${port}...`);
  mqttClient = mqtt.connect(`mqtt://${broker}:${port}`, options);

  mqttClient.on('connect', () => {
    console.log('[MQTT] Connected');
    
    // Subscribe to all devices data topic using wildcard
    mqttClient.subscribe('scale/+/data', (err) => {
      if (err) {
        console.error('[MQTT] Subscribe error:', err);
      } else {
        console.log('[MQTT] Subscribed: scale/+/data');
      }
    });

    // Subscribe to all devices config updates
    mqttClient.subscribe('scale/+/config', (err) => {
      if (err) {
        console.error('[MQTT] Subscribe error:', err);
      } else {
        console.log('[MQTT] Subscribed: scale/+/config');
      }
    });
  });

  mqttClient.on('error', (error) => {
    console.error('[MQTT] Error:', error);
  });

  mqttClient.on('reconnect', () => {
    console.log('[MQTT] Reconnecting...');
  });

  mqttClient.on('offline', () => {
    console.log('[MQTT] Offline');
  });

  return mqttClient;
};

// Get MQTT client instance
const getMQTTClient = () => {
  if (!mqttClient) {
    throw new Error('MQTT not initialized');
  }
  return mqttClient;
};

// Publish command to device
const publishCommand = (deviceId, command) => {
  return new Promise((resolve, reject) => {
    if (!mqttClient) {
      return reject(new Error('MQTT not initialized'));
    }

    const topic = `scale/${deviceId}/command`;
    const payload = JSON.stringify(command);
    
    mqttClient.publish(topic, payload, (error) => {
      if (error) {
        console.error(`[MQTT] Publish failed:`, error);
        reject(error);
      } else {
        console.log(`[MQTT] Published to ${topic}:`, payload);
        resolve();
      }
    });
  });
};

// Register message handler
const onMessage = (callback) => {
  if (!mqttClient) {
    throw new Error('MQTT not initialized');
  }
  mqttClient.on('message', callback);
};

// Close connection
const close = () => {
  if (mqttClient) {
    mqttClient.end();
    console.log('🔌 MQTT connection closed');
  }
};

module.exports = {
  initMQTT,
  getMQTTClient,
  publishCommand,
  onMessage,
  close
};
