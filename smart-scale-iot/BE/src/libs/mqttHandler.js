/**
 * MQTT Message Handlers
 * Handle data packets from ESP32 devices
 */

const { weightDataService, deviceService } = require('../services');

// Handle weight data from ESP32
const handleWeightData = async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('[MQTT Handler] Received:', data);
    
    const { deviceId, name, status, weight, weightStatus, caliFactor, offset } = data;
    
    if (!deviceId || weight === undefined) {
      console.error('[MQTT Handler] Missing deviceId or weight');
      return;
    }
    
    // Update or create device info
    await deviceService.upsertDevice({
      deviceId,
      name: name || `SmartScale-${deviceId.substring(6)}`,
      status: status || 'online',
      caliFactor: parseFloat(caliFactor) || -20498.12,
      offset: parseInt(offset) || 0
    });
    
    // Save weight data with timestamp from BE
    await weightDataService.createWeight({
      deviceId,
      weight: parseFloat(weight),
      status: weightStatus || 'stable'
    });
    
    console.log(`[MQTT Handler] Saved: ${weight}kg from ${name}`);
    
  } catch (error) {
    console.error('[MQTT Handler] Error:', error.message);
  }
};

// Handle config update from ESP32 (after ESP32 processed the config)
const handleConfigUpdate = async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('[MQTT Handler] Config update:', data);
    
    const { deviceId, name, caliFactor, offset } = data;
    
    if (!deviceId) {
      console.error('[MQTT Handler] Missing deviceId in config update');
      return;
    }
    
    // Update device configuration in database
    await deviceService.upsertDevice({
      deviceId,
      name: name || `SmartScale-${deviceId.substring(6)}`,
      status: 'online',
      caliFactor: parseFloat(caliFactor),
      offset: parseInt(offset)
    });
    
    console.log(`[MQTT Handler] Device config updated: ${name}`);
    
  } catch (error) {
    console.error('[MQTT Handler] Config update error:', error.message);
  }
};

// Setup MQTT message handlers
const setupMQTTHandlers = (mqttClient) => {
  mqttClient.on('message', (topic, message) => {
    console.log(`[MQTT] <<< ${topic}`);
    
    // Skip FE real-time topic - only handle device-specific topics
    if (topic === 'scale/fe/data' || topic === 'scale/fe/response') {
      console.log('[MQTT] Skipping FE topic');
      return;
    }
    
    // Handle data from device topics: scale/{deviceId}/data
    if (topic.match(/^scale\/[^/]+\/data$/)) {
      handleWeightData(topic, message);
    }
    
    // Handle config updates from device: scale/{deviceId}/config
    if (topic.match(/^scale\/[^/]+\/config$/)) {
      handleConfigUpdate(topic, message);
    }
  });
  
  console.log('[MQTT Handlers] Setup complete');
};

module.exports = {
  setupMQTTHandlers
};
