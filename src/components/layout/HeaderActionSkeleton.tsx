'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface HeaderActionSkeletonProps {
  variant?: 'desktop' | 'mobile';
}

const HeaderActionSkeleton = ({ variant = 'desktop' }: HeaderActionSkeletonProps) => {
  if (variant === 'desktop') {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          {/*  Dashboard */}
          <Skeleton className="h-10 w-16" />
          {/* Avatar skeleton - circular */}
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    );
  }

  // Mobile variant
  return (
    <div className="flex flex-col space-y-3">
      {/* User info skeleton for mobile */}
      <div className="flex items-center justify-between px-2 py-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      {/* Button skeleton for mobile */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

// Alternative: Create specific skeletons for different auth states
const AuthenticatedDesktopSkeleton = () => (
  <div className="flex items-center space-x-4">
    {/* Dashboard button skeleton */}
    <Skeleton className="h-10 w-20" />
    {/* Avatar skeleton */}
    <Skeleton className="h-10 w-10 rounded-full" />
  </div>
);

const UnauthenticatedDesktopSkeleton = () => (
  <div className="flex items-center space-x-4">
    {/* Login button skeleton */}
    <Skeleton className="h-10 w-16" />
    {/* Try now button skeleton */}
    <Skeleton className="h-10 w-20" />
  </div>
);

const AuthenticatedMobileSkeleton = () => (
  <div className="flex flex-col space-y-3">
    {/* User info */}
    <div className="flex items-center justify-between px-2 py-1">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    {/* Dashboard button */}
    <Skeleton className="h-10 w-full" />
  </div>
);

const UnauthenticatedMobileSkeleton = () => (
  <div className="flex flex-col space-y-3">
    {/* Login button */}
    <Skeleton className="h-10 w-full" />
    {/* Try now button */}
    <Skeleton className="h-10 w-full" />
  </div>
);

export { 
  AuthenticatedDesktopSkeleton,
  AuthenticatedMobileSkeleton,
  HeaderActionSkeleton,
  UnauthenticatedDesktopSkeleton,
  UnauthenticatedMobileSkeleton
};