/**
 * Utility Functions: Weight Data Handlers
 * Xử lý và transform weight data
 */

import { ScaleStatus } from '../constants/scaleConstants';

/**
 * Chuyển đổi weight data từ MQTT thành record format
 */
export const transformMqttWeightData = (data) => {
  return {
    id: `mqtt_${Date.now()}`,
    weight: data.weight || 0,
    status: data.status || ScaleStatus.STABLE,
    timestamp: data.timestamp || Date.now()
  };
};

/**
 * Kiểm tra xem record có nên thêm vào history không
 */
export const shouldAddToHistory = (newRecord, history) => {
  if (newRecord.status !== ScaleStatus.STABLE) {
    return false;
  }

  // Avoid duplicate entries
  if (history.length > 0) {
    const lastRecord = history[0];
    if (Math.abs(lastRecord.weight - newRecord.weight) < 0.01) {
      return false;
    }
  }

  return true;
};

/**
 * Update chart data với giới hạn số điểm
 */
export const updateChartData = (currentData, newRecord, maxPoints = 50) => {
  const newData = [...currentData, newRecord];
  
  if (newData.length > maxPoints) {
    return newData.slice(newData.length - maxPoints);
  }
  
  return newData;
};

/**
 * Update history với giới hạn số records
 */
export const updateHistory = (currentHistory, newRecord, maxRecords = 100) => {
  const newHistory = [newRecord, ...currentHistory];
  
  if (newHistory.length > maxRecords) {
    return newHistory.slice(0, maxRecords);
  }
  
  return newHistory;
};

/**
 * Convert weight unit (kg to lbs hoặc ngược lại)
 */
export const convertWeightUnit = (weight, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462;
  }
  
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return weight / 2.20462;
  }
  
  return weight;
};

/**
 * Format weight display với số thập phân
 */
export const formatWeight = (weight, decimals = 2) => {
  return weight.toFixed(decimals);
};
