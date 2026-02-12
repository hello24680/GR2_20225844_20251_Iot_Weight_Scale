import React from 'react';
import { Icon } from '../Icon';

export const StatsCard = ({ stats, unit, formatWeight }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-[#111618] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
          <Icon name="scale" className="text-2xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Newest Weight</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatWeight(stats.newestWeight)} <span className="text-sm font-normal">{unit}</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111618] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
          <Icon name="check_circle" className="text-2xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecords}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111618] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
          <Icon name="vertical_align_top" className="text-2xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Highest / Lowest</p>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatWeight(stats.maxWeight)}</p>
            <span className="text-xs text-gray-400">/</span>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatWeight(stats.minWeight)}</p>
            <span className="text-xs text-gray-400">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
