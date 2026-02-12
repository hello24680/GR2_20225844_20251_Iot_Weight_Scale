import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { userService } from '../services/userService';

export const Sidebar = () => {
  const [userAvatar, setUserAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBXKPLYnrBjhuakf0rkrK7I87OON1_Bi7VBb5OY1VeKQPxIJZj_BwMBG9ENLP5Uw3AK6I9QhRFpKAGyUALKJn-AjRPcCtzRf_dDVqahRUmfNb9Oof5ulci_xlNyw2lGeVSVK91dMEr-dsTKQ6_5EdliHEapxSxGZ5DKfzXfgg7soEEIoG8qUJX7SV_D1YQqG01aJrUs_H-mml1mQXqFlJ7_ev1xVWohNZuhCnH01EPex6ybPLJMqdShB9sXIXHaGkoGAnrPG0MuZXAw');
  const [userName, setUserName] = useState('Smart Scale');

  const navItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard', end: true },
    { path: '/history', icon: 'history', label: 'History Log' },
    // { path: '/wellness', icon: 'health_and_safety', label: 'Wellness Goals' },
    // { path: '/balance', icon: 'accessibility_new', label: 'Balance Analysis' },
    { path: '/profile', icon: 'account_circle', label: 'User Profile' },
    { path: '/settings', icon: 'settings', label: 'Device Settings' },
  ];

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await userService.getProfile();
        if (profile.avatarUrl) {
          setUserAvatar(profile.avatarUrl);
        }
        if (profile.name) {
          setUserName(profile.name);
        }
      } catch (error) {
        console.error('Failed to load user profile in Sidebar:', error);
      }
    };

    loadUserProfile();
  }, []);

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#111618] p-4 flex flex-col justify-between border-r border-gray-200 dark:border-gray-800 md:flex">
      <div className="flex flex-col gap-8">
        {/* Logo & Company Name */}
        <NavLink 
          to="/profile"
          className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-primary/10 rounded-lg transition-colors group"
          title="Go to User Profile"
        >
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 group-hover:ring-2 ring-primary transition-all" 
            style={{ backgroundImage: `url("${userAvatar}")` }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal group-hover:text-primary transition-colors">{userName}</h1>
            <p className="text-gray-500 dark:text-[#9cb0ba] text-sm font-normal leading-normal">Member</p>
          </div>
        </NavLink>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-primary/10'
                }
              `}
            >
              <Icon name={item.icon} />
              <p className="text-sm font-medium leading-normal">{item.label}</p>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
