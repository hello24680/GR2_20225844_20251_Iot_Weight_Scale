import { apiClient } from './apiClient';

// Get latest weight from BE
const getLatest = async () => {
    const data = await apiClient.get('/api/weights/latest');
    return {
        id: data.id,
        weight: parseFloat(data.weight),
        status: data.status,
        timestamp: new Date(data.timestamp).getTime(),
    };
};

// Get weight history from BE (50 latest records)
const getHistory = async () => {
    const dataList = await apiClient.get('/api/weights');
    return dataList.map(item => ({
        id: item.id,
        weight: parseFloat(item.weight),
        status: item.status,
        timestamp: new Date(item.timestamp).getTime(),
    }));
};

// Delete weight record by ID
const deleteWeight = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/weights/${id}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to delete weight record: ${response.status}`);
    }
    
    return await response.json();
};

export const weightService = {
    getLatest,
    getHistory,
    deleteWeight
};