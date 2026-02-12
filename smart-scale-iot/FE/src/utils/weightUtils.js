// Calculate statistics from history data
export const calculateStats = (history) => {
  if (!history || history.length === 0) {
    return {
      newestWeight: 0,
      maxWeight: 0,
      minWeight: 0,
      totalRecords: 0
    };
  }

  return {
    newestWeight: history[0].weight,
    maxWeight: Math.max(...history.map(r => r.weight)),
    minWeight: Math.min(...history.map(r => r.weight)),
    totalRecords: history.length
  };
};

// Format weight based on unit
export const formatWeight = (value, unit = 'kg') => {
  return unit === 'kg' ? value.toFixed(2) : (value * 2.20462).toFixed(2);
};

// Format date for display
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time for display
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
