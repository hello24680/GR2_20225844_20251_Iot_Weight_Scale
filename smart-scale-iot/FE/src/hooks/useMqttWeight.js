/**
 * Custom Hook: useMqttWeight
 * Quản lý kết nối MQTT và xử lý weighing commands
 */

import { useState, useEffect, useCallback } from 'react';
import { connectMqtt, sendWeighCommand, onWeightUpdate } from '../services/mqttService';

export const useMqttWeight = (onWeightReceived) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mqttConnected, setMqttConnected] = useState(false);

  // Kết nối MQTT khi mount
  useEffect(() => {
    let isMounted = true;

    connectMqtt()
      .then(() => {
        if (isMounted) {
          setMqttConnected(true);
          console.log('[useMqttWeight] MQTT connected');
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('[useMqttWeight] MQTT connection failed:', err);
          setMqttConnected(false);
        }
      });

    // Subscribe to weight updates
    const unsubscribe = onWeightUpdate((data) => {
      if (isMounted) {
        console.log('[useMqttWeight] Weight update received:', data);
        setIsRecording(false);
        
        // Notify parent component
        if (onWeightReceived) {
          onWeightReceived({
            weight: data.weight,
            status: data.status || 'stable',
            timestamp: data.timestamp || Date.now()
          });
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [onWeightReceived]);

  // Handler để bắt đầu cân
  const handleStartWeighing = useCallback(() => {
    if (!mqttConnected) {
      alert('MQTT not connected! Please wait...');
      return false;
    }

    setIsRecording(true);
    const success = sendWeighCommand();
    
    if (!success) {
      setIsRecording(false);
      alert('Failed to send command!');
      return false;
    }

    console.log('[useMqttWeight] Weigh command sent');
    
    // Auto reset after 30s if no response
    setTimeout(() => {
      setIsRecording(false);
    }, 30000);

    return true;
  }, [mqttConnected]);

  return {
    isRecording,
    mqttConnected,
    handleStartWeighing
  };
};
