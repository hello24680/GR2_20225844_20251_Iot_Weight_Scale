// API Client for Backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data.data;
};

export const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return handleResponse(response);
  },
};