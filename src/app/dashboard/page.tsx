"use client";

import React, { useState, FormEvent, useEffect, useMemo, useCallback } from 'react';
import { ExternalLink, Moon, RefreshCcw, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { VisualSettings, VisualSettingsState } from '@/components/ui/visual-settings';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { cn } from "../../lib/utils";
import { Skeleton } from '@/components/ui/skeleton';
import { TaskItem } from '@/components/ui/task-item';
import { PRStatusIcon } from '@/components/ui/pr-status-icon';

// Component types
type CommitActivity = Array<{
  date: string;
  count: number;
}>;

type PullRequest = {
  id: string;
  title: string;
  repository: string;
  status: 'open' | 'merged' | 'draft';
  url: string;
};

type Repository = {
  name: string;
  stars: number;
  lastCommitDate: string;
  description?: string;
};

type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export default function Dashboard() {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Repository filter state
  const [repoFilter, setRepoFilter] = useState<'stars' | 'activity'>('stars');

  // Theme state - initialized from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // First try to get from localStorage
      const savedTheme = localStorage.getItem('devdashboard-theme');
      if (savedTheme !== null) {
        return savedTheme === 'dark';
      }
      // If no saved preference, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    // Default to dark mode if not in browser
    return true;
  });

  // Apply theme class based on state
  const applyTheme = (isDark: boolean) => {
    // Update document class for global theme styling
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply the theme when component mounts
  React.useEffect(() => {
    applyTheme(darkMode);
  }, [darkMode]);

  // Simulate loading for demo purposes
  React.useEffect(() => {
    // Show loading state initially
    setIsLoading(true);

    // Simulate API/data loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // We'll define filteredRepositories after repositories is initialized

  // Setup dnd sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Input state for new tasks
  const [newTask, setNewTask] = useState('');

  // Generate sample commit activity data for the heatmap
  const generateCommitActivity = (): CommitActivity => {
    const activity: CommitActivity = [];
    const now = new Date();

    // Generate data for the last 12 weeks (84 days)
    for (let i = 83; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      // Higher probability of commits on weekdays
      const dayOfWeek = date.getDay();
      const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
      const maxCommits = isWeekday ? 8 : 4;
      activity.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * maxCommits) // 0-7 commits on weekdays, 0-3 on weekends
      });
    }

    return activity;
  };

  // Sample data
  const commitActivity = generateCommitActivity();

  // Sample pull requests
  const [pullRequests] = useState<PullRequest[]>([
    { id: '1', title: 'Fix authentication bug', repository: 'auth-service', status: 'open', url: '#' },
    { id: '2', title: 'Add dark mode toggle', repository: 'ui-components', status: 'merged', url: '#' },
    { id: '3', title: 'Implement search feature', repository: 'search-api', status: 'draft', url: '#' },
    { id: '4', title: 'Update documentation', repository: 'docs', status: 'open', url: '#' },
    { id: '5', title: 'Optimize database queries', repository: 'backend', status: 'open', url: '#' },
  ]);

  // Sample repositories
  const [repositories] = useState<Repository[]>([
    { name: 'frontend-app', stars: 24, lastCommitDate: '2025-05-20', description: 'Main frontend application' },
    { name: 'api-service', stars: 16, lastCommitDate: '2025-05-18', description: 'Core API services' },
    { name: 'ui-components', stars: 57, lastCommitDate: '2025-05-15', description: 'Reusable UI components' },
    { name: 'utilities', stars: 12, lastCommitDate: '2025-05-10', description: 'Helper functions and utilities' },
    { name: 'docs-site', stars: 8, lastCommitDate: '2025-05-22', description: 'Documentation website' },
    { name: 'backend', stars: 32, lastCommitDate: '2025-05-19', description: 'Backend services and API endpoints' },
  ]);

  // Filter repositories based on selected filter
  const filteredRepositories = useMemo(() => {
    return [...repositories].sort((a, b) => {
      if (repoFilter === 'stars') {
        // Sort by stars (descending)
        return b.stars - a.stars;
      } else {
        // Sort by activity (most recent first)
        return new Date(b.lastCommitDate).getTime() - new Date(a.lastCommitDate).getTime();
      }
    });
  }, [repositories, repoFilter]);

  // Load checklist from localStorage or use default items
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedChecklist = localStorage.getItem('devdashboard-checklist');
      if (savedChecklist) {
        try {
          return JSON.parse(savedChecklist);
        } catch (e) {
          console.error('Failed to parse checklist from localStorage:', e);
        }
      }
    }
    return [
      { id: '1', text: 'Fix login bug', completed: false },
      { id: '2', text: 'Add dark mode toggle', completed: true },
      { id: '3', text: 'Implement search feature', completed: false },
      { id: '4', text: 'Update README', completed: false },
      { id: '5', text: 'Deploy to production', completed: false },
    ];
  });

  // Save checklist to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devdashboard-checklist', JSON.stringify(checklist));
    }
  }, [checklist]);

  // Handle task reordering (drag and drop)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setChecklist((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Notify user of the change
        toast.success(`Task reordered`);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Toggle checklist item completion
  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => {
      if (item.id === id) {
        const newState = !item.completed;
        toast.success(newState ? 'Task completed! 🎉' : 'Task marked incomplete');
        return { ...item, completed: newState };
      }
      return item;
    }));

    const updatedList = checklist.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    if (visualSettings?.enableMicrointeractions &&
      updatedList.length > 0 &&
      updatedList.every(item => item.completed)) {
      toast.success('All tasks completed! 🎉', {
        style: { background: '#7c3aed', color: 'white' },
        duration: 3000,
      });
    }
  };

  // Add new task
  const addTask = (e: FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newId = String(Date.now());
      const newTaskItem = { id: newId, text: newTask.trim(), completed: false };
      setChecklist([...checklist, newTaskItem]);
      setNewTask('');
      toast.success('New task added');
    }
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
    toast('Task removed', { icon: '🗑️' });
  };

  // Clear completed tasks
  const clearCompleted = () => {
    const completedCount = checklist.filter(item => item.completed).length;
    setChecklist(checklist.filter(item => !item.completed));
    toast(`Cleared ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}`);
  };

  // Get status color for PR
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500 dark:bg-green-600 text-white';
      case 'merged': return 'bg-purple-500 dark:bg-purple-600 text-white';
      case 'draft': return 'bg-gray-500 dark:bg-gray-600 text-white';
      default: return 'bg-gray-500 dark:bg-gray-600 text-white';
    }
  };

  // Define theme colors as constants to avoid TDZ issues
  const THEME_COLORS = {
    violet: { primary: '#8b5cf6', secondary: '#6d28d9' },
    blue: { primary: '#3b82f6', secondary: '#2563eb' },
    green: { primary: '#10b981', secondary: '#059669' },
    amber: { primary: '#f59e0b', secondary: '#d97706' }
  };

  // Define animation speeds as constants
  const ANIMATION_SPEEDS = {
    slow: 0.1,
    normal: 0.2,
    fast: 0.4
  };

  // Initial visual settings state - defined before any usage
  const initialVisualSettings: VisualSettingsState = {
    enableAnimations: true,
    backgroundStyle: 'code',
    enableMicrointeractions: true,
    colorTheme: 'violet',
    animationSpeed: 'normal',
    layoutDensity: 'comfortable',
    contrastMode: 'standard',
  };

  // Load saved visual settings on component mount
  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    try {
      const savedSettings = localStorage.getItem('visualSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings) as VisualSettingsState;
        setVisualSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading saved visual settings', error);
      // Fallback to initial settings on error
      setVisualSettings(initialVisualSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Visual settings state
  const [visualSettings, setVisualSettings] = useState<VisualSettingsState>(initialVisualSettings);

  // Save visual settings to localStorage
  const saveVisualSettings = useCallback((settings: VisualSettingsState) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('visualSettings', JSON.stringify(settings));
    }
  }, []);
  
  // Update visual settings when they change
  useEffect(() => {
    saveVisualSettings(visualSettings);
  }, [visualSettings, saveVisualSettings]);

  // Helper function to get color theme CSS variables
  const getThemeColor = () => {
    // Use safe access to avoid TDZ
    const colorTheme = visualSettings?.colorTheme || 'violet';
    return THEME_COLORS[colorTheme] || THEME_COLORS.violet;
  };

  // Get animation speed value in seconds
  const getAnimationSpeed = () => {
    // Use safe access to avoid TDZ
    const speed = visualSettings?.animationSpeed || 'normal';
    return ANIMATION_SPEEDS[speed] || ANIMATION_SPEEDS.normal;
  };

  // Get layout spacing class based on density setting
  const getLayoutClasses = () => {
    const baseClasses = "flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 relative";
    
    // Safe access to avoid TDZ
    const contrastMode = visualSettings?.contrastMode || 'standard';
    const layoutDensity = visualSettings?.layoutDensity || 'comfortable';
    
    // Add high contrast if enabled
    const contrastClass = contrastMode === 'high' ? 'high-contrast' : '';
    
    // Add layout density classes
    let densityClass = '';
    switch(layoutDensity) {
      case 'compact': densityClass = 'layout-compact'; break;
      case 'comfortable': densityClass = 'layout-comfortable'; break;
      case 'spacious': densityClass = 'layout-spacious'; break;
      default: densityClass = 'layout-comfortable';
    }
    
    return `${baseClasses} ${densityClass} ${contrastClass}`;
  };
  
  // Get the current theme colors - Memoize to avoid recalculation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeColors = useMemo(() => getThemeColor(), [visualSettings?.colorTheme]);
  
  return (
    <div 
      className={getLayoutClasses()}
      style={{ 
        fontFamily: 'var(--font-space-grotesk)',
        '--theme-primary': themeColors.primary,
        '--theme-secondary': themeColors.secondary,
      } as React.CSSProperties}
    >
      {/* Animated Background - with safety guards against TDZ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {visualSettings?.enableAnimations && visualSettings?.backgroundStyle !== 'none' && (
          <AnimatedBackground
            variant={visualSettings?.backgroundStyle || 'code'}
            opacity={(visualSettings?.contrastMode === 'high') ? 0.06 : 0.04}
            speed={getAnimationSpeed()}
            color={darkMode ? 
                  (themeColors?.primary || '#8b5cf6') : 
                  (themeColors?.secondary || '#6d28d9')}
          />
        )}
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
              <div className="h-8 w-8 rounded-md overflow-hidden flex items-center justify-center">
                <Image src="/Group 2.svg" alt="DevDashboard Logo" width={32} height={32} className="h-full w-full" />
              </div>
              <h1
                className="px-4 py-2 text-white rounded-md text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-md button-press glow-on-hover theme-button"
                style={{ 
                  fontFamily: 'var(--font-jetbrains-mono)',
                  backgroundColor: 'var(--theme-primary)'
                }}
              >DevDashboard</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
              aria-label="Refresh dashboard"
            >
              <RefreshCcw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
              onClick={() => {
                setDarkMode(!darkMode);
                document.documentElement.classList.toggle('dark');
              }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            {/* Visual Settings moved to its own section above main content */}
          </div>
          <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
            GH
          </div>
        </div>
      </header>

      {/* Visual Settings Panel */}
      <div className="container mx-auto px-4 pt-6 pb-2">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-theme-primary font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Dashboard Settings</h2>
            <VisualSettings
              onChangeAction={setVisualSettings}
              className="transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Top Row: GitHub Activity + Today's Goals */}
          <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-900 rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg card-hover staggered-card-1 card dashboard-card">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Recent Activity</h2>
              <span className="text-xs text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">Last 12 weeks</span>
            </div>

            {/* Contribution heatmap - GitHub style */}
            <div className="pb-2">
              <div className="flex">
                {/* Month labels */}
                <div className="flex flex-col justify-between pr-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>

                {/* Contribution grid */}
                <div className="flex-1">
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(7, 1fr)', gap: '2px' }}>
                    {Array.from({ length: 84 }).map((_, index) => {
                      const day = commitActivity[index] || { count: 0 };

                      // Map activity level to color - Theme responsive
                      let bgColorClass = 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'; // Default (no activity)
                      if (day.count > 0) {
                        if (day.count === 1) bgColorClass = 'bg-green-100 dark:bg-green-900';
                        else if (day.count < 3) bgColorClass = 'bg-green-200 dark:bg-green-800';
                        else if (day.count < 5) bgColorClass = 'bg-green-300 dark:bg-green-700';
                        else bgColorClass = 'bg-green-400 dark:bg-green-600';
                      }

                      // Check if it's today's commit dot
                      const isToday = day.date === new Date().toISOString().split('T')[0];
                      const pulseEffect = isToday && visualSettings.enableMicrointeractions ? 'animate-pulse shadow-lg shadow-green-500/30 ring-2 ring-green-400 dark:ring-green-600 z-10' : '';

                      return (
                        <div
                          key={`cell-${index}`}
                          className={`aspect-square rounded-sm ${bgColorClass} hover:ring-1 hover:ring-blue-500 transition-all ${pulseEffect}`}
                          title={`${day.date}: ${day.count} commits${isToday ? ' (Today)' : ''}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-end items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="mr-2">Less</span>
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-1"></div>
                <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900 mr-1"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-800 mr-1"></div>
                <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700 mr-1"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600 mr-1"></div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Today&apos;s Goals - Now in the top row, right side */}
          <div className="col-span-1 bg-white dark:bg-gray-900 rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg card-hover staggered-card-2 card dashboard-card">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Today&apos;s Goals</h2>

            <form onSubmit={addTask} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-theme-primary transition-colors button-hover"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z" />
                  </svg>
                </button>
              </div>
            </form>

            {isLoading ? (
              <div className="space-y-3 max-h-[230px] mb-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="max-h-[230px] overflow-y-auto mb-3">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={checklist.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                      {checklist.map(item => (
                        <TaskItem
                          key={item.id}
                          id={item.id}
                          text={item.text}
                          completed={item.completed}
                          onToggle={toggleChecklistItem}
                          onDelete={deleteTask}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {checklist.some(item => item.completed) && (
              <div className="text-right">
                <button 
                  onClick={clearCompleted}
                  className="text-xs text-theme-primary hover:opacity-80 transition-colors button-hover button-press"
                >
                  Clear completed
                </button>
              </div>
            )}
          </div>

          {/* Bottom Row: Open Pull Requests and Top Repositories */}
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-800 dashboard-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Pull Requests</h2>
              <div className="flex gap-2">
                <button className="text-xs px-2 py-1 rounded-md bg-blue-500 text-white font-medium button-hover button-press">All</button>
                <button className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 button-hover button-press">Open</button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3 pr-1">
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {pullRequests.map(pr => (
                  <div key={pr.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 transform hover:scale-[1.01] hover:translate-x-1 task-item">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <PRStatusIcon
                          status={pr.status}
                          className={pr.status === 'open' ? 'text-green-500' :
                            pr.status === 'merged' ? 'text-purple-500' :
                              'text-gray-400'}
                          size={14}
                        />
                        <h3 className="text-xs font-medium text-blue-500 truncate mb-1 flex-1">{pr.title}</h3>
                      </div>
                      <a href={pr.url} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" aria-label="External link">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between mt-2 pl-6">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{pr.repository}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(pr.status)}`}>
                        {pr.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Repositories */}
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-800 dashboard-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Top Repositories</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setRepoFilter('stars')} 
                  className={cn(
                    "text-xs px-2 py-1 rounded-md transition-colors",
                    repoFilter === 'stars'
                      ? "bg-theme-primary text-white" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  )}
                >
                  Most Starred
                </button>
                <button 
                  onClick={() => setRepoFilter('activity')} 
                  className={cn(
                    "text-xs px-2 py-1 rounded-md transition-colors",
                    repoFilter === 'activity'
                      ? "bg-theme-primary text-white" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  )}
                >
                  Recent Activity
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3 pr-1">
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {filteredRepositories.map(repo => (
                  <div key={repo.name} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.01] hover:translate-x-1 task-item">
                    <h3 className="text-xs font-medium text-blue-500 truncate mb-1">{repo.name}</h3>
                    {repo.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{repo.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="h-3 w-3 mr-1" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                        </svg>
                        {repo.stars}
                      </div>
                      <span>Updated {new Date(repo.lastCommitDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-4 text-center text-xs text-[#8B949E] mt-6">
        <p>
          Built with <span className="text-[#F85149]">❤️</span> by a Developer for Developers |
          <a href="https://github.com/Sifee27/DevDashboard" className="text-[#58A6FF] hover:underline ml-1">GitHub</a>
        </p>
      </footer>
    </div>
  );
}
