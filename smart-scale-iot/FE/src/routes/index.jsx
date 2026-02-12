import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { HistoryLog } from '../pages/HistoryLog';
import { UserProfile } from '../pages/UserProfile';
import { DeviceSettings } from '../pages/DeviceSettings';

/**
 * App Routes Configuration
 * Quản lý tất cả các routes của ứng dụng
 */
export const AppRoutes = ({ 
  currentRecord, 
  chartData, 
  deviceInfo, 
  history, 
  unit, 
  setUnit,
  onMqttWeightReceived,
  onDataChange
}) => {
  return (
    <Routes>
      {/* Dashboard Route */}
      <Route 
        path="/" 
        element={
          <Dashboard
            currentRecord={currentRecord}
            chartData={chartData}
            deviceInfo={deviceInfo}
            history={history}
            unit={unit}
            setUnit={setUnit}
            onMqttWeightReceived={onMqttWeightReceived}
          />
        } 
      />

      {/* History Log Route */}
      <Route 
        path="/history" 
        element={<HistoryLog history={history} unit={unit} onDataChange={onDataChange} />} 
      />

      {/* User Profile Route */}
      <Route path="/profile" element={<UserProfile />} />

      {/* Device Settings Route */}
      <Route path="/settings" element={<DeviceSettings />} />

      {/* Placeholder routes cho tương lai */}
      <Route path="/wellness" element={<ComingSoonPage page="Wellness Goals" />} />
      <Route path="/balance" element={<ComingSoonPage page="Balance Analysis" />} />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * Temporary placeholder component cho pages chưa được implement
 */
const ComingSoonPage = ({ page }) => (
  <div className="flex items-center justify-center h-96 animate-in fade-in">
    <div className="text-center">
      <p className="text-gray-900 dark:text-white text-lg font-semibold mb-2">
        {page}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        This page will be implemented soon
      </p>
    </div>
  </div>
);
