import React from 'react';
import { Icon } from '../Icon';

export const AccountSettings = ({ userData, setUserData, onDeleteAccount }) => {
  return (
    <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="notifications" className="text-gray-400" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium text-sm">Email Notifications</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Receive updates via email</p>
            </div>
          </div>
          <button 
            onClick={() => setUserData({...userData, notifications: !userData.notifications})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${userData.notifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userData.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={onDeleteAccount}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
          >
            <Icon name="delete" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
