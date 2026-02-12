import { apiClient } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get user profile
const getProfile = async () => {
  return await apiClient.get('/api/users/profile');
};

// Update user profile
const updateProfile = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data.data;
};

export const userService = {
  getProfile,
  updateProfile
};
