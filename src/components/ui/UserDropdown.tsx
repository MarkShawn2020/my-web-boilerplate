'use client';

import React, { useState } from 'react';
import { useRouter } from '@/libs/I18nNavigation';
import { useAuthActions, useAuthUser } from '@/hooks/useAuthUser';
import { Avatar } from './Avatar';
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './DropdownMenu';

// Icons as SVG components
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const CommandIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-1.414-.586H13l-2.293-2.293a1 1 0 0 0-.707-.293H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2.172a2 2 0 0 0 1.414-.586L15 21" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

interface UserDropdownProps {
  className?: string;
}

const UserDropdown = ({}: UserDropdownProps) => {
  const { user, isAuthenticated } = useAuthUser();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    // Get theme from user preferences or localStorage
    if (user?.preferences?.theme) {
      return user.preferences.theme as 'system' | 'light' | 'dark';
    }
    return localStorage?.getItem('theme') as 'system' | 'light' | 'dark' || 'system';
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
  };

  const handlePreferences = () => {
    router.push('/dashboard/preferences');
  };

  const handleProjects = () => {
    router.push('/dashboard/projects');
  };

  const handleThemeChange = (newTheme: 'system' | 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme immediately
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Update user preferences
    // TODO: Call API to update preferences
  };

  const userDisplayName = user.profile?.fullName || user.email || 'User';
  const userEmail = user.email || '';

  return (
    <DropdownMenu
      trigger={
        <Avatar
          src={user.profile?.avatarUrl || undefined}
          alt={userDisplayName}
          fallback={userDisplayName}
          size="md"
        />
      }
      align="end"
      className="w-64"
    >
      {/* User Info */}
      <DropdownMenuLabel>
        <div className="flex items-center space-x-2">
          <UserIcon className="w-4 h-4" />
          <span className="truncate">{userEmail}</span>
        </div>
      </DropdownMenuLabel>
      
      <DropdownMenuSeparator />
      
      {/* Account Preferences */}
      <DropdownMenuItem onClick={handlePreferences}>
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-4 h-4" />
          <span>Account Preferences</span>
        </div>
      </DropdownMenuItem>
      
      {/* All Projects */}
      <DropdownMenuItem onClick={handleProjects}>
        <div className="flex items-center space-x-2">
          <FolderIcon className="w-4 h-4" />
          <span>All Projects</span>
        </div>
      </DropdownMenuItem>
      
      {/* Command Menu */}
      <DropdownMenuItem>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <CommandIcon className="w-4 h-4" />
            <span>Command Menu</span>
          </div>
          <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded border dark:bg-gray-700">⌘K</kbd>
        </div>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      {/* Theme Section */}
      <DropdownMenuLabel>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Theme</span>
      </DropdownMenuLabel>
      
      {/* Theme Options */}
      {['system', 'light', 'dark'].map((themeOption) => (
        <DropdownMenuItem
          key={themeOption}
          onClick={() => handleThemeChange(themeOption as 'system' | 'light' | 'dark')}
        >
          <div className="flex items-center space-x-2 w-full">
            <div className="flex items-center justify-center w-4 h-4">
              {theme === themeOption && (
                <div className="w-2 h-2 bg-current rounded-full" />
              )}
            </div>
            <span className="capitalize">{themeOption}</span>
          </div>
        </DropdownMenuItem>
      ))}
      
      <DropdownMenuSeparator />
      
      {/* Logout */}
      <DropdownMenuItem onClick={handleLogout}>
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <LogoutIcon className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </DropdownMenuItem>
    </DropdownMenu>
  );
};

export { UserDropdown };