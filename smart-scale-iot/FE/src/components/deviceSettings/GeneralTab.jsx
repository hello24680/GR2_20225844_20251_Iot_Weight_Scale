import React from 'react';
import { Icon } from '../Icon';
import { ConfigStatus } from '../../constants/scaleConstants';

export const GeneralTab = ({ 
  deviceName, 
  setDeviceName, 
  caliFactor, 
  setCaliFactor, 
  offset, 
  setOffset, 
  configStatus, 
  configMessage,
  onSave 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Device Identity</h2>
          <button 
            onClick={onSave}
            disabled={configStatus === ConfigStatus.SENDING}
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {configStatus === ConfigStatus.SENDING ? 'Saving...' : 'Save'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Device Name</label>
            <input 
              type="text" 
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">This name will appear in Bluetooth pairing and app notifications.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Sensor Data</h2>
          <button 
            onClick={onSave}
            disabled={configStatus === ConfigStatus.SENDING}
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {configStatus === ConfigStatus.SENDING ? 'Saving...' : 'Save'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Calibration Factor</p>
            <input 
              type="text" 
              value={caliFactor}
              onChange={(e) => setCaliFactor(e.target.value)}
              className="w-full font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 text-gray-700 dark:text-gray-300" 
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Zero Offset</p>
            <input 
              type="text" 
              value={offset}
              onChange={(e) => setOffset(e.target.value)}
              className="w-full font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 text-gray-700 dark:text-gray-300" 
            />
          </div>
        </div>
      </div>

      {configStatus !== ConfigStatus.IDLE && (
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${
          configStatus === ConfigStatus.SUCCESS 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' 
            : configStatus === ConfigStatus.FAILED
            ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
        }`}>
          <Icon name={
            configStatus === ConfigStatus.SUCCESS ? 'check_circle' : 
            configStatus === ConfigStatus.FAILED ? 'error' : 
            'sync'
          } className={
            configStatus === ConfigStatus.SUCCESS ? 'text-green-600' : 
            configStatus === ConfigStatus.FAILED ? 'text-red-600' : 
            'text-blue-600'
          } />
          <p className={`text-sm font-medium ${
            configStatus === ConfigStatus.SUCCESS ? 'text-green-800 dark:text-green-300' : 
            configStatus === ConfigStatus.FAILED ? 'text-red-800 dark:text-red-300' : 
            'text-blue-800 dark:text-blue-300'
          }`}>
            {configMessage}
          </p>
        </div>
      )}
    </div>
  );
};
