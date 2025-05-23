"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, Info, Clock } from 'lucide-react';
import { toast } from 'sonner';

type StatusIndicatorProps = {
  lastSyncTime?: Date;
  autoRefresh?: boolean;
  onRefreshAction?: () => Promise<void>;
  className?: string;
};

export function StatusIndicator({ 
  lastSyncTime: initialLastSyncTime, 
  autoRefresh = false, 
  onRefreshAction, 
  className = '' 
}: StatusIndicatorProps) {
  const [lastSyncTime, setLastSyncTime] = useState<Date>(initialLastSyncTime || new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Format time as HH:MM:SS AM/PM
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(date);
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing || !onRefreshAction) return;
    
    setIsRefreshing(true);
    try {
      await onRefreshAction();
      setLastSyncTime(new Date());
      toast.success('Dashboard refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Set up auto-refresh
  useEffect(() => {
    if (autoRefresh && onRefreshAction) {
      const interval = setInterval(async () => {
        setIsRefreshing(true);
        try {
          await onRefreshAction();
          setLastSyncTime(new Date());
        } catch (error) {
          console.error('Auto-refresh error:', error);
        } finally {
          setIsRefreshing(false);
        }
      }, 5 * 60 * 1000); // 5 minutes
      
      setRefreshInterval(interval);
      
      return () => {
        if (refreshInterval) clearInterval(refreshInterval);
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, onRefreshAction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [refreshInterval]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="relative mr-2 p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-sm"
          aria-label="Refresh dashboard"
        >
          <RefreshCw 
            className={`h-3.5 w-3.5 text-violet-600 dark:text-violet-400 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
          {isRefreshing && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </button>
        
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-900 dark:text-gray-200 flex items-center">
            <Clock className="h-3 w-3 mr-1 text-violet-500 dark:text-violet-400" />
            <span>Last synchronized</span>
            {autoRefresh && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full">AUTO</span>
            )}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(lastSyncTime)}
          </span>
        </div>
      </div>
      
      {autoRefresh && (
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span>Auto-refresh on</span>
        </div>
      )}
    </div>
  );
}
