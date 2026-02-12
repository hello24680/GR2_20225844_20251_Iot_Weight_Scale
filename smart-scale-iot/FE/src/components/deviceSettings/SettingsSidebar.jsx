import React from 'react';
import { Icon } from '../Icon';

export const SettingsSidebar = ({ SETTINGS_TABS, activeTab, setActiveTab, deviceInfo, MOCK_DEVICE_INFO }) => {
  return (
    <div className="md:col-span-1">
      <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {SETTINGS_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
              activeTab === tab.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Icon name={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-2">Device Info</p>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
          {deviceInfo.deviceId && (
            <p>Device ID: <span className="font-mono">{deviceInfo.deviceId}</span></p>
          )}
          {deviceInfo.name && (
            <p>Name: <span className="font-mono">{deviceInfo.name}</span></p>
          )}
          <p>Model: <span className="font-mono">{MOCK_DEVICE_INFO.model}</span></p>
          {deviceInfo.caliFactor && (
            <p>Cali Factor: <span className="font-mono">{deviceInfo.caliFactor}</span></p>
          )}
        </div>
      </div>
    </div>
  );
};
