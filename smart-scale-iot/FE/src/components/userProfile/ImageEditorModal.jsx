import React from 'react';
import { User, ImageIcon } from 'lucide-react';

export const ImageEditorModal = ({ isOpen, tempImageUrls, setTempImageUrls, onSave, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111618] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md mx-4 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Change Profile Photos</h3>
        
        <div className="space-y-4">
          {/* Avatar URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="inline w-5 h-5 mr-1" />
              Avatar URL
            </label>
            <input 
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={tempImageUrls.avatarUrl}
              onChange={(e) => setTempImageUrls({...tempImageUrls, avatarUrl: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            {tempImageUrls.avatarUrl && (
              <div className="mt-2 flex justify-center">
                <div 
                  className="size-20 rounded-full bg-cover bg-center border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundImage: `url("${tempImageUrls.avatarUrl}")` }}
                ></div>
              </div>
            )}
          </div>

          {/* Cover URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ImageIcon className="inline w-5 h-5 mr-1" />
              Cover Image URL
            </label>
            <input 
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={tempImageUrls.coverUrl}
              onChange={(e) => setTempImageUrls({...tempImageUrls, coverUrl: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            {tempImageUrls.coverUrl && (
              <div className="mt-2">
                <div 
                  className="h-24 w-full rounded-lg bg-cover bg-center border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundImage: `url("${tempImageUrls.coverUrl}")` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
