import React from 'react';
import { Icon } from '../Icon';
import { ConfigStatus } from '../../constants/scaleConstants';

export const NetworkTab = ({ 
  ssid, 
  setSsid, 
  password, 
  setPassword, 
  wifiStatus, 
  wifiMessage, 
  currentSsid, 
  isConnected, 
  onSave 
}) => {
  return (
    <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Network Configuration</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WiFi SSID</label>
          <input 
            type="text" 
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            placeholder="Enter WiFi network name"
            className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter WiFi password"
            className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Connection Status</p>
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${
            wifiStatus === ConfigStatus.SUCCESS || isConnected
              ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' 
              : wifiStatus === ConfigStatus.FAILED
              ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
              : 'bg-gray-50 dark:bg-gray-900/20 border-gray-100 dark:border-gray-800'
          }`}>
            <Icon name={
              wifiStatus === ConfigStatus.SUCCESS || isConnected ? 'check_circle' : 
              wifiStatus === ConfigStatus.FAILED ? 'error' : 
              wifiStatus === ConfigStatus.SENDING ? 'sync' : 
              'wifi_off'
            } className={
              wifiStatus === ConfigStatus.SUCCESS || isConnected ? 'text-green-600' : 
              wifiStatus === ConfigStatus.FAILED ? 'text-red-600' : 
              wifiStatus === ConfigStatus.SENDING ? 'text-blue-600' : 
              'text-gray-600'
            } />
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                wifiStatus === ConfigStatus.SUCCESS || isConnected ? 'text-green-800 dark:text-green-300' : 
                wifiStatus === ConfigStatus.FAILED ? 'text-red-800 dark:text-red-300' : 
                wifiStatus === ConfigStatus.SENDING ? 'text-blue-800 dark:text-blue-300' : 
                'text-gray-600 dark:text-gray-400'
              }`}>
                {wifiMessage || (isConnected ? `Connected to ${currentSsid}` : 'Not connected')}
              </p>
            </div>
            <Icon name={
              wifiStatus === ConfigStatus.SUCCESS || isConnected ? 'signal_wifi_4_bar' : 'signal_wifi_off'
            } className={
              wifiStatus === ConfigStatus.SUCCESS || isConnected ? 'text-green-600' : 'text-gray-600'
            } />
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button 
            onClick={onSave}
            disabled={wifiStatus === ConfigStatus.SENDING}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-colors disabled:opacity-50"
          >
            {wifiStatus === ConfigStatus.SENDING ? 'Connecting...' : 'Save & Connect'}
          </button>
        </div>
      </div>
    </div>
  );
};
