/**
 * Component hiển thị thông tin thiết bị ESP32
 * Bao gồm: trạng thái kết nối, tín hiệu WiFi, pin, và thời gian đồng bộ cuối
 * 
 * Props:
 * @param {DeviceInfo} info - Thông tin thiết bị
 */
export const DeviceInfoCard = ({ info }) => {
  const lastSyncDate = new Date(info.lastSync).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Device Information (ESP32)</h3>
      <div className="space-y-4">
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-[#9cb0ba]">Device Status</p>
          <p className={`text-sm font-medium ${info.status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
            {info.status}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-[#9cb0ba]">Last Sync</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white">{lastSyncDate}</p>
        </div>
      </div>
    </div>
  );
};
