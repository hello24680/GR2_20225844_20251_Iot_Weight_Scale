// Scale status constants
export const ScaleStatus = {
    STABLE: 'Stable',
    UNSTABLE: 'Unstable'
};

// MQTT Command types
export const MqttCommand = {
    WEIGH: 'weigh',
    UPDATE_CONFIG: 'update_config',
    UPDATE_WIFI: 'update_wifi'
};

// Config update status
export const ConfigStatus = {
    IDLE: 'idle',
    SENDING: 'sending',
    SUCCESS: 'success',
    FAILED: 'failed'
};
