import React from 'react';
import { Icon } from '../Icon';

export const ProfileHeader = ({ 
  userData, 
  isEditing, 
  onEdit, 
  onCancel, 
  onSave, 
  onOpenImageEditor 
}) => {
  return (
    <div className="relative mb-20">
      <div 
        className="h-48 w-full rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url("${userData.coverUrl}")` }}
      >
        <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
      </div>
      
      <div className="absolute -bottom-16 left-8 flex items-end gap-6">
        <div className="relative">
          <div 
            className="size-32 rounded-full border-4 border-white dark:border-[#111618] bg-cover bg-center shadow-md"
            style={{ backgroundImage: `url("${userData.avatarUrl}")` }}
          ></div>
        </div>
        <div className="mb-2">
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-sm sm:drop-shadow-none">{userData.name}</h1>
           <p className="text-gray-600 dark:text-gray-400 font-medium">Member</p>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 flex gap-3">
         {isEditing ? (
           <>
             <button 
                onClick={onCancel}
                className="px-4 py-2 bg-white/90 backdrop-blur text-gray-700 rounded-lg text-sm font-medium hover:bg-white transition-colors"
              >
                Cancel
              </button>
             <button 
                onClick={onSave}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-lg transition-colors"
              >
                Save Changes
              </button>
           </>
         ) : (
           <>
             <button 
                onClick={onOpenImageEditor}
                className="px-4 py-2 bg-white/90 backdrop-blur text-gray-700 rounded-lg text-sm font-medium hover:bg-white shadow-sm transition-colors flex items-center gap-2"
              >
                <Icon name="image" className="text-base" />
                Change Photos
             </button>
             <button 
                onClick={onEdit}
                className="px-4 py-2 bg-white/90 backdrop-blur text-gray-700 rounded-lg text-sm font-medium hover:bg-white shadow-sm transition-colors flex items-center gap-2"
              >
                <Icon name="edit" className="text-base" />
                Edit Profile
             </button>
           </>
         )}
      </div>
    </div>
  );
};
