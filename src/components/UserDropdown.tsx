'use client';

import { useLocale } from 'next-intl';
import React, { useState } from 'react';
import { useAuthActions, useAuthUser } from '@/hooks/useAuthUser';
import { usePathname, useRouter } from '@/libs/I18nNavigation';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

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

const LanguageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
  </svg>
);

interface UserDropdownProps {
  className?: string;
}

const UserDropdown = ({}: UserDropdownProps) => {
  const { user, isAuthenticated } = useAuthUser();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    // Get theme from user preferences or localStorage
    if (user?.preferences?.theme) {
      return user.preferences.theme as 'system' | 'light' | 'dark';
    }
    return (typeof window !== 'undefined' ? localStorage?.getItem('theme') : null) as 'system' | 'light' | 'dark' || 'system';
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
    if (typeof window !== 'undefined') {
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
    }

    // Update user preferences
    // TODO: Call API to update preferences
  };

  const handleLanguageChange = (newLocale: string) => {
    // Use next-intl's router which handles locale switching correctly
    router.push(pathname, { locale: newLocale });
  };

  const userDisplayName = user.profile?.fullName || user.email || 'User';
  const userEmail = user.email || '';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          {user.profile?.avatarUrl && (
            <AvatarImage 
              src={user.profile.avatarUrl} 
              alt={userDisplayName}
            />
          )}
          <AvatarFallback>
            {getInitials(userDisplayName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end">
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
          <SettingsIcon className="w-4 h-4" />
          <span>Account Preferences</span>
        </DropdownMenuItem>
        
        {/* All Projects */}
        <DropdownMenuItem onClick={handleProjects}>
          <FolderIcon className="w-4 h-4" />
          <span>All Projects</span>
        </DropdownMenuItem>
        
        {/* Command Menu */}
        <DropdownMenuItem>
          <CommandIcon className="w-4 h-4" />
          <span>Command Menu</span>
          <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Language Section */}
        <DropdownMenuLabel>
          <span className="text-xs font-medium text-muted-foreground">Language</span>
        </DropdownMenuLabel>
        
        {/* Language Options */}
        <DropdownMenuRadioGroup value={locale} onValueChange={handleLanguageChange}>
          <DropdownMenuRadioItem value="zh">
            <LanguageIcon className="w-4 h-4" />
            <span>中文</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">
            <LanguageIcon className="w-4 h-4" />
            <span>English</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        {/* Theme Section */}
        <DropdownMenuLabel>
          <span className="text-xs font-medium text-muted-foreground">Theme</span>
        </DropdownMenuLabel>
        
        {/* Theme Options */}
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as 'system' | 'light' | 'dark')}>
          <DropdownMenuRadioItem value="system">
            <span>System</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <span>Dark</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogoutIcon className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserDropdown };