import React from 'react';

export const BioSection = ({ userData, isEditing, setUserData }) => {
  return (
    <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bio</h2>
      {isEditing ? (
        <textarea
          value={userData.bio || ''}
          onChange={(e) => setUserData({...userData, bio: e.target.value})}
          rows="4"
          className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none resize-none"
          placeholder="Tell us about yourself..."
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {userData.bio || 'No bio yet'}
        </p>
      )}
    </div>
  );
};
