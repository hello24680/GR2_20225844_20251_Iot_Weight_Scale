import React from 'react';
import { Search } from 'lucide-react';

export const SearchToolbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative max-w-sm w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by date, time, weight or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>
      <div className="flex gap-2">
        <select className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary cursor-pointer">
          <option>All Status</option>
          <option>Stable</option>
          <option>Unstable</option>
        </select>
      </div>
    </div>
  );
};
