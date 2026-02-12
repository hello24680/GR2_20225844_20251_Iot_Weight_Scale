import React from 'react';
import { Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Icon } from '../Icon';
import { ScaleStatus } from '../../constants/scaleConstants';

export const HistoryTable = ({ 
  paginatedData, 
  filteredHistory, 
  unit, 
  formatWeight, 
  formatDate, 
  formatTime, 
  onDelete 
}) => {
  return (
    <div className="overflow-x-auto custom-scrollbar flex-1">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50 sticky top-0">
          <tr>
            <th className="px-6 py-3">Date & Time</th>
            <th className="px-6 py-3">Weight ({unit})</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Trend</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {paginatedData.length > 0 ? (
            paginatedData.map((record) => {
              const currentIndex = filteredHistory.indexOf(record);
              const prevRecord = filteredHistory[currentIndex + 1];
              
              let TrendIcon = Minus;
              let trendColor = 'text-gray-400';

              if (prevRecord) {
                if (record.weight > prevRecord.weight) {
                  TrendIcon = TrendingUp;
                  trendColor = 'text-green-500';
                } else if (record.weight < prevRecord.weight) {
                  TrendIcon = TrendingDown;
                  trendColor = 'text-red-500';
                }
              }

              return (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">{formatDate(record.timestamp)}</span>
                      <span className="text-xs text-gray-500">{formatTime(record.timestamp)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">{formatWeight(record.weight)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      record.status === ScaleStatus.STABLE
                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <Icon name="history" className="text-4xl opacity-20" />
                  <p>No records found matching your criteria.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
