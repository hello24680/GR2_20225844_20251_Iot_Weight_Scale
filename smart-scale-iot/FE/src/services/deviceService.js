import { apiClient } from './apiClient';

// Get device info from BE
const getInfo = async () => {
    const data = await apiClient.get('/api/device');
    return {
        deviceId: data.deviceId,
        name: data.name,
        status: data.status === 'online' ? 'Online' : 'Offline',
        lastSync: new Date(data.lastSeen).getTime(),
        caliFactor: parseFloat(data.caliFactor),
        offset: parseInt(data.offset)
    };
};

export const deviceService = {
    getInfo
};