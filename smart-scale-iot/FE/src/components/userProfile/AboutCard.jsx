import React from 'react';
import { Icon } from '../Icon';

export const AboutCard = ({ userData, isEditing, setUserData }) => {
  return (
    <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h2>
      <div className="space-y-4">
         <div className="flex items-start gap-3 text-sm">
            <Icon name="person" className="text-gray-400 mt-0.5" />
            <div>
               <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Full Name</p>
               {isEditing ? (
                 <input 
                   type="text" 
                   value={userData.name}
                   onChange={(e) => setUserData({...userData, name: e.target.value})}
                   className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                 />
               ) : (
                 <p className="text-gray-900 dark:text-white font-medium">{userData.name}</p>
               )}
            </div>
         </div>
         
         <div className="flex items-start gap-3 text-sm">
            <Icon name="mail" className="text-gray-400 mt-0.5" />
            <div>
               <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Email</p>
                {isEditing ? (
                 <input 
                   type="email" 
                   value={userData.email}
                   onChange={(e) => setUserData({...userData, email: e.target.value})}
                   className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                 />
               ) : (
                 <p className="text-gray-900 dark:text-white font-medium">{userData.email}</p>
               )}
            </div>
         </div>

         <div className="flex items-start gap-3 text-sm">
            <Icon name="location_on" className="text-gray-400 mt-0.5" />
            <div>
               <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Location</p>
                {isEditing ? (
                 <input 
                   type="text" 
                   value={userData.location || ''}
                   onChange={(e) => setUserData({...userData, location: e.target.value})}
                   className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                 />
               ) : (
                 <p className="text-gray-900 dark:text-white font-medium">{userData.location || 'Not set'}</p>
               )}
            </div>
         </div>

        <div className="flex items-start gap-3 text-sm">
          <Icon name="phone" className="text-gray-400 mt-0.5" />
          <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Phone</p>
              {isEditing ? (
                <input 
                  type="text"
                  value={userData.phone || ''}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium">{userData.phone || 'Not set'}</p>
              )}
          </div>
        </div>

         <div className="flex items-start gap-3 text-sm">
            <Icon name="calendar_month" className="text-gray-400 mt-0.5" />
            <div>
               <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Joined</p>
               <p className="text-gray-900 dark:text-white font-medium">{userData.joinDate}</p>
            </div>
         </div>
      </div>
    </div>
  );
};
