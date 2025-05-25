"use client";

import React, { useState, FormEvent, useEffect, useMemo, useCallback } from 'react';
import { ExternalLink, Moon, RefreshCcw, Sun, LineChart, LayoutGrid, X, Play, Pause, RotateCcw, Timer } from 'lucide-react'; // Removed unused imports
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { VisualSettings, VisualSettingsState } from '@/components/ui/visual-settings';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, rectSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "../../lib/utils";
import { Skeleton } from '@/components/ui/skeleton';
import { TaskItem } from '@/components/ui/task-item';
import { PRStatusIcon } from '@/components/ui/pr-status-icon';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { GitHubStatusBadge } from '@/components/ui/github-status-badge';
import { CommitLineChart } from '@/components/ui/commit-line-chart';
import { QuickNotesCard } from '@/components/ui/quick-notes-card';

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

type DashboardCard = {
  id: string;
  title: string;
  type: 'github-activity' | 'goals' | 'pull-requests' | 'repositories' | 'languages' | 'commit-line-chart' | 'pomodoro' | 'quick-links' | 'quick-notes' | 'color-palette' | 'api-tester' | 'code-snippets' | 'network-monitor' | 'system-info';
  colSpan: string;
  visible: boolean;
};

// Generate sample commit activity data
const generateCommitActivity = (): CommitActivity => {
  const today = new Date();
  return Array.from({ length: 84 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (83 - i));
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 8)
    };
  });
};

// Sortable Card Component
function SortableCard({ id, children, className, onClose, visualSettings }: { id: string; children: React.ReactNode; className?: string; onClose?: () => void; visualSettings?: VisualSettingsState }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  // Apply visual settings classes
  const getCardClasses = () => {
    if (!visualSettings) return className || '';

    const borderRadiusClass = `border-radius-${visualSettings.borderRadius}`;
    const cardShadowClass = `card-shadow-${visualSettings.cardShadow}`;
    const cardStyleClass = `card-style-${visualSettings.cardStyle}`;
    const fontFamilyClass = `font-family-${visualSettings.fontFamily}`;
    const spacingClass = `spacing-${visualSettings.spacing}`;

    return `${className || ''} ${borderRadiusClass} ${cardShadowClass} ${cardStyleClass} ${fontFamilyClass} ${spacingClass}`;
  };

  // Customize this for each card type or index with the card-1, card-2 classes
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`${getCardClasses()} ${isDragging ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : ''} group relative transition-all duration-200`}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{
        scale: isDragging ? 1.05 : 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 p-1 rounded-md bg-red-500 hover:bg-red-600 text-white shadow-lg"
          title="Close card"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Drag handle - improved visibility and UX */}
      <div
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing z-20"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        <motion.div
          className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </motion.div>
      </div>
      {children}
    </motion.div>
  );
}

// Card rendering functions
function renderCard(card: DashboardCard, props: {
  commitActivity: CommitActivity;
  visualSettings: VisualSettingsState;
  isLoading: boolean;
  newTask: string;
  setNewTask: (value: string) => void;
  addTask: (e: FormEvent) => void;
  checklist: ChecklistItem[];
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (event: DragEndEvent) => void;
  toggleChecklistItem: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
  pullRequests: PullRequest[];
  getStatusColor: (status: string) => string;
  repoFilter: 'stars' | 'activity';
  setRepoFilter: (filter: 'stars' | 'activity') => void;
  filteredRepositories: Repository[];
  onCloseCard: (cardId: string) => void;
  // Pomodoro timer props
  pomodoroTime: number;
  pomodoroActive: boolean;
  pomodoroSessions: number;
  isBreak: boolean;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  formatTime: (seconds: number) => string;
}) {
  
  const {
    commitActivity,
    visualSettings,
    isLoading,
    newTask,
    setNewTask,
    addTask,
    checklist,
    sensors,
    handleDragEnd,
    toggleChecklistItem,
    deleteTask,
    clearCompleted,
    pullRequests,
    getStatusColor,
    repoFilter,
    setRepoFilter,
    filteredRepositories,
    onCloseCard,
    // Pomodoro timer props
    pomodoroTime,
    pomodoroActive,
    pomodoroSessions,
    isBreak,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    formatTime
  } = props;

  switch (card.type) {
    case 'github-activity':
      return (
        <SortableCard
          id={card.id}
          className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary staggered-card-1 card dashboard-card min-h-[320px]`}
          onClose={() => onCloseCard(card.id)}
          visualSettings={visualSettings}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Recent Activity Heatmap</h2>
            <span className="text-sm text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">Last 12 weeks</span>
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
                <div className="grid grid-auto-rows min-h-[180px]" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(7, 1fr)', gap: '2px' }}>
                  {Array.from({ length: 84 }).map((_, index) => {
                    const day = commitActivity[index] || { count: 0, date: '' };

                    // Map activity level to color - Theme responsive
                    let bgColorClass = 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
                    if (day.count > 0) {
                      if (day.count === 1) bgColorClass = 'bg-green-100 dark:bg-green-900';
                      else if (day.count < 3) bgColorClass = 'bg-green-200 dark:bg-green-800';
                      else if (day.count < 5) bgColorClass = 'bg-green-300 dark:bg-green-700';
                      else bgColorClass = 'bg-green-400 dark:bg-green-600';
                    }

                    const isToday = day.date === new Date().toISOString().split('T')[0];
                    const pulseEffect = isToday && visualSettings.enableMicrointeractions ? 'animate-pulse shadow-lg shadow-green-500/30 ring-2 ring-green-400 dark:ring-green-600 z-10' : '';

                    return (
                      <div
                        key={`cell-${index}`}
                        className={`aspect-square rounded-sm ${bgColorClass} hover:ring-1 hover:ring-blue-500 transition-all ${pulseEffect}`}
                        title={`${day.date || 'No date'}: ${day.count} commits${isToday ? ' (Today)' : ''}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>            {/* Legend */}
            <div className="flex justify-end items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="mr-2">Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={`legend-${level}`}
                  className={`w-3 h-3 rounded-sm mr-1 ${level === 0 ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700' :
                    level === 1 ? 'bg-green-100 dark:bg-green-900' :
                      level === 2 ? 'bg-green-200 dark:bg-green-800' :
                        level === 3 ? 'bg-green-300 dark:bg-green-700' :
                          'bg-green-400 dark:bg-green-600'
                    }`}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </SortableCard>); case 'commit-line-chart':
      return (
        <SortableCard
          id={card.id}
          className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary dashboard-card min-h-[320px]`}
          onClose={() => onCloseCard(card.id)}
          visualSettings={visualSettings}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Commit Activity Over Time</h2>
            <LineChart className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          {isLoading ? (
            <div className="space-y-3 pr-1 h-[250px]">
              <Skeleton className="h-full w-full rounded-md" />
            </div>
          ) : (
            <CommitLineChart
              data={commitActivity} // Pass commitActivity data
              isDarkMode={props.visualSettings.colorTheme.includes('dark')} // Determine darkMode for the chart
              themeColor={props.visualSettings.colorTheme} // Pass theme color
              height={250} // Set chart height
            />
          )}
        </SortableCard>); case 'goals':
      return (
        <SortableCard
          id={card.id}
          className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary staggered-card-2 card dashboard-card min-h-[320px]`}
          onClose={() => onCloseCard(card.id)}
          visualSettings={visualSettings}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Today&apos;s Goals</h2>

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
                <SortableContext items={checklist.map((item: ChecklistItem) => item.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1">
                    {checklist.map((item: ChecklistItem) => (
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

          {checklist.some((item: ChecklistItem) => item.completed) && (
            <div className="text-right">
              <button
                onClick={clearCompleted}
                className="text-xs text-theme-primary hover:opacity-80 transition-colors button-hover button-press"
              >
                Clear completed
              </button>
            </div>
          )}
        </SortableCard>); case 'pull-requests':
      return (
        <SortableCard
          id={card.id}
          className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary dashboard-card min-h-[320px]`}
          onClose={() => onCloseCard(card.id)}
          visualSettings={visualSettings}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Pull Requests</h2>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded-md bg-blue-500 text-white font-medium button-hover button-press">All</button>
              <button className="text-xs px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 button-hover button-press">Open</button>
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
        </SortableCard>); case 'repositories':
      return (
        <SortableCard
          id={card.id}
          className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary dashboard-card min-h-[320px]`}
          onClose={() => onCloseCard(card.id)}
          visualSettings={visualSettings}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Top Repositories</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setRepoFilter('stars')}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-md transition-colors",
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
                  "text-xs px-3 py-1.5 rounded-md transition-colors",
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
          )}        </SortableCard>
      );

    case 'languages': const languageData = [
      { name: 'TypeScript', value: 35, color: '#3178c6' },
      { name: 'JavaScript', value: 28, color: '#f7df1e' },
      { name: 'Python', value: 20, color: '#3776ab' },
      { name: 'CSS', value: 10, color: '#1572b6' },
      { name: 'HTML', value: 7, color: '#e34f26' }
    ]; return (
      <SortableCard
        id={card.id}
        className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary staggered-card-4 card dashboard-card min-h-[320px]`}
        onClose={() => onCloseCard(card.id)}
        visualSettings={visualSettings}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Languages Used</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3 pr-1">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        ) : (
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Usage']}
                  labelFormatter={(label: string) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  formatter={(value: string) => <span style={{ fontSize: '12px', color: 'var(--text-color)' }}>{value}</span>}
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </SortableCard>
    );

    case 'pomodoro':
      return (
        <SortableCard
          id={card.id}
          className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary dashboard-card min-h-[320px]`}
          onClose={() => onCloseCard(card.id)}
          visualSettings={visualSettings}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              Pomodoro Timer
            </h2>
            <Timer className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className={`text-6xl font-bold font-mono transition-colors duration-300 ${isBreak
                  ? 'text-green-500 dark:text-green-400'
                  : pomodoroActive
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`} style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                {formatTime(pomodoroTime)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isBreak ? 'Break Time' : 'Work Session'}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={pomodoroActive ? pausePomodoro : startPomodoro}
                className={`p-3 rounded-full transition-all duration-200 ${pomodoroActive
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                  } button-hover button-press`}
                title={pomodoroActive ? 'Pause timer' : 'Start timer'}
              >
                {pomodoroActive ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={resetPomodoro}
                className="p-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200 button-hover button-press"
                title="Reset timer"
              >
                <RotateCcw className="h-6 w-6" />
              </button>
            </div>

            {/* Session Counter */}
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-primary mb-1">
                {pomodoroSessions}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Completed Sessions
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isBreak ? 'bg-green-500' : 'bg-red-500'
                  }`}
                style={{
                  width: `${((isBreak ? 5 * 60 : 25 * 60) - pomodoroTime) / (isBreak ? 5 * 60 : 25 * 60) * 100}%`
                }}
              />
            </div>
          </div>
        </SortableCard>
      );

    case 'quick-links':
      return (
        <SortableCard
          id={card.id}
          className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary dashboard-card min-h-[320px]`}
          onClose={() => onCloseCard(card.id)}
          visualSettings={visualSettings}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Quick Links
              </h3>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {/* GitHub Profile */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">GitHub Profile</span>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </a>

              {/* Replit */}
              <a
                href="https://replit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <span className="font-medium">Replit</span>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </a>

              {/* Vercel */}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white dark:text-black" fill="currentColor" viewBox="0 0 76 65">
                      <path d="M37.5 0L75 65H0L37.5 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Vercel</span>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </a>
            </div>
          </div>
        </SortableCard>
      );
      
    case 'quick-notes':
      return (
        <SortableCard
          id={card.id}
          className={`${card.colSpan} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-theme-primary dashboard-card min-h-[320px]`}
          onClose={() => onCloseCard(card.id)}
          visualSettings={visualSettings}
        >
          <QuickNotesCard />
        </SortableCard>
      );

    default:
      return null;
  }
}

export default function Dashboard() {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Repository filter state
  const [repoFilter, setRepoFilter] = useState<'stars' | 'activity'>('stars');

  // Card order state for drag and drop
  const [cards, setCards] = useState<DashboardCard[]>(() => {
    // Load saved card order from localStorage or use default
    if (typeof window !== 'undefined') {
      const savedCards = localStorage.getItem('devdashboard-card-order');
      if (savedCards) {
        try {
          return JSON.parse(savedCards);
        } catch (e) {
          console.error('Failed to parse card order from localStorage:', e);
        }
      }
    }    return [
      { id: 'github-activity', title: 'Recent Activity Heatmap', type: 'github-activity', colSpan: 'col-span-1 lg:col-span-2', visible: true },
      { id: 'commit-line-chart', title: 'Commit Activity Over Time', type: 'commit-line-chart', colSpan: 'col-span-1 lg:col-span-2', visible: true },
      { id: 'goals', title: "Today's Goals", type: 'goals', colSpan: 'col-span-1', visible: true },
      { id: 'pomodoro', title: 'Pomodoro Timer', type: 'pomodoro', colSpan: 'col-span-1', visible: true },
      { id: 'quick-links', title: 'Quick Links', type: 'quick-links', colSpan: 'col-span-1', visible: true },
      { id: 'quick-notes', title: 'Quick Notes', type: 'quick-notes', colSpan: 'col-span-1 lg:col-span-2', visible: true },
      { id: 'languages', title: 'Languages Used', type: 'languages', colSpan: 'col-span-1', visible: true },
      { id: 'pull-requests', title: 'Pull Requests', type: 'pull-requests', colSpan: 'col-span-1 lg:col-span-2', visible: true },
      { id: 'repositories', title: 'Top Repositories', type: 'repositories', colSpan: 'col-span-1 lg:col-span-2', visible: true }
    ];
  });
  // State for tracking active drag card for overlay
  const [activeCard, setActiveCard] = useState<DashboardCard | null>(null);

  // Card management panel state
  const [showCardPanel, setShowCardPanel] = useState<boolean>(false);

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

  // Pomodoro Timer State
  const [pomodoroTime, setPomodoroTime] = useState<number>(25 * 60); // 25 minutes in seconds
  const [pomodoroActive, setPomodoroActive] = useState<boolean>(false);
  const [pomodoroSessions, setPomodoroSessions] = useState<number>(0);
  const [isBreak, setIsBreak] = useState<boolean>(false);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      // Timer finished
      setPomodoroActive(false);
      if (!isBreak) {
        // Work session completed
        setPomodoroSessions(sessions => sessions + 1);
        toast.success('Pomodoro session completed! Time for a break. 🍅', {
          duration: 5000
        });
        // Start break (5 minutes)
        setIsBreak(true);
        setPomodoroTime(5 * 60);
      } else {
        // Break completed
        toast.success('Break time is over! Ready for another session?', {
          duration: 3000
        });
        setIsBreak(false);
        setPomodoroTime(25 * 60); // Reset to 25 minutes
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroActive, pomodoroTime, isBreak]);

  // Pomodoro Timer Functions
  const startPomodoro = () => {
    setPomodoroActive(true);
    toast.success(isBreak ? 'Break timer started!' : 'Pomodoro session started! Focus time! 🍅');
  };

  const pausePomodoro = () => {
    setPomodoroActive(false);
    toast('Timer paused');
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setIsBreak(false);
    setPomodoroTime(25 * 60);
    toast('Timer reset');
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  // Save card order to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devdashboard-card-order', JSON.stringify(cards));
    }
  }, [cards]);

  // Derived state for visible and hidden cards
  const visibleCards = useMemo(() => cards.filter(card => card.visible), [cards]);
  const hiddenCards = useMemo(() => cards.filter(card => !card.visible), [cards]);

  // Function to toggle card visibility (close card)
  const onCloseCard = (cardId: string) => {
    setCards(currentCards =>
      currentCards.map(card =>
        card.id === cardId ? { ...card, visible: false } : card
      )
    );
    const cardToClose = cards.find(c => c.id === cardId);
    if (cardToClose) {
      toast(`Card "${cardToClose.title}" hidden. You can re-enable it from 'Manage Cards'.`);
    }
  };

  // Function to add a card back (make visible)
  const addCard = (cardId: string) => {
    setCards(currentCards =>
      currentCards.map(card =>
        card.id === cardId ? { ...card, visible: true } : card
      )
    );
    const cardToAdd = cards.find(c => c.id === cardId);
    if (cardToAdd) {
      toast.success(`Card "${cardToAdd.title}" re-added to dashboard.`);
    }
  };

  // Layout presets functionality
  // const [savedLayouts, setSavedLayouts] = useState<{ [key: string]: DashboardCard[] }>(() => {
  //   if (typeof window !== 'undefined') {
  //     const saved = localStorage.getItem('devdashboard-saved-layouts');
  //     if (saved) {
  //       try {
  //         const parsed = JSON.parse(saved);
  //         if (typeof parsed === 'object' && parsed !== null) {
  //           return parsed;
  //         }
  //         console.warn('Parsed saved layouts from localStorage is not a valid object:', parsed);
  //       } catch (e) {
  //         console.error('Failed to parse saved layouts from localStorage:', e);
  //       }
  //     }
  //   }
  //   return {}; // Default to an empty object
  // });

  // Handle task reordering (drag and drop)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setChecklist((currentItems: ChecklistItem[]) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id.toString());
        const newIndex = currentItems.findIndex((item) => item.id === over.id.toString());

        if (oldIndex === -1 || newIndex === -1) {
          return currentItems;
        }
        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  };

  // Card Drag and Drop Handlers
  const handleCardDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedCard = cards.find(card => card.id === active.id.toString());
    if (draggedCard) {
      setActiveCard(draggedCard);
    } else {
      setActiveCard(null);
    }
  };

  const handleCardDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((currentCards: DashboardCard[]) => {
        const oldIndex = currentCards.findIndex(card => card.id === active.id.toString());
        const newIndex = currentCards.findIndex(card => card.id === over.id.toString());

        if (oldIndex === -1 || newIndex === -1) {
          return currentCards;
        }
        return arrayMove(currentCards, oldIndex, newIndex);
      });
    }
    setActiveCard(null);
  };

  const handleCardDragCancel = () => {
    setActiveCard(null);
  };

  // Toggle checklist item completion
  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => {
      if (item.id === id) {
        const newState = !item.completed;
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

    if (updatedList.length > 0 && updatedList.every(item => item.completed)) {
      if (visualSettings?.enableMicrointeractions) {
        toast.success('All tasks completed! 🎉', {
          style: { background: '#7c3aed', color: 'white' },
          duration: 3000,
        });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [
            themeColors.primary,
            themeColors.secondary,
            '#00bcd4',
            '#ff9800',
            '#4caf50'
          ]
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff0000', '#00ff00', '#0000ff']
          });

          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff0000', '#00ff00', '#0000ff']
          });
        }, 300);
      }
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

  // GitHub connection status
  const [isGitHubConnected] = useState<boolean>(true);
  const THEME_COLORS = {
    violet: { primary: '#8b5cf6', secondary: '#6d28d9' },
    blue: { primary: '#3b82f6', secondary: '#2563eb' },
    green: { primary: '#10b981', secondary: '#059669' },
    amber: { primary: '#f59e0b', secondary: '#d97706' },
    rose: { primary: '#f43f5e', secondary: '#e11d48' },
    cyan: { primary: '#06b6d4', secondary: '#0891b2' },
    orange: { primary: '#f97316', secondary: '#ea580c' },
    emerald: { primary: '#10b981', secondary: '#059669' }
  };

  // Define animation speeds as constants
  const ANIMATION_SPEEDS = {
    slow: 0.1,
    normal: 0.2,
    fast: 0.4
  };

  // Initial visual settings state - Memoize to prevent re-creation
  const initialVisualSettings: VisualSettingsState = useMemo(() => ({
    enableAnimations: true,
    backgroundStyle: 'code',
    enableMicrointeractions: true,
    colorTheme: 'violet',
    animationSpeed: 'normal',
    layoutDensity: 'comfortable',
    contrastMode: 'standard',
    borderRadius: 'medium',
    cardShadow: 'medium',
    fontFamily: 'system',
    cardStyle: 'elevated',
    spacing: 'normal',
  }), []);

  // Load saved visual settings on component mount
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const savedSettings = localStorage.getItem('devdashboard-visual-settings');
      if (savedSettings) {
        setVisualSettings(JSON.parse(savedSettings));
      } else {
        setVisualSettings(initialVisualSettings);
      }
    } catch (error) {
      console.error('Error loading saved visual settings', error);
      setVisualSettings(initialVisualSettings);
    }
  }, [initialVisualSettings]);

  // Visual settings state
  const [visualSettings, setVisualSettings] = useState<VisualSettingsState>(initialVisualSettings);

  // Save visual settings to localStorage
  const saveVisualSettings = useCallback((settings: VisualSettingsState) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('devdashboard-visual-settings', JSON.stringify(settings));
    }
  }, []);

  // Update visual settings when they change
  useEffect(() => {
    saveVisualSettings(visualSettings);
  }, [visualSettings, saveVisualSettings]);

  // Helper function to get color theme CSS variables
  const getThemeColor = useCallback(() => {
    const colorTheme = visualSettings?.colorTheme || 'violet';
    return THEME_COLORS[colorTheme] || THEME_COLORS.violet;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualSettings?.colorTheme]);

  // Get animation speed value in seconds
  const getAnimationSpeed = () => {
    const speed = visualSettings?.animationSpeed || 'normal';
    return ANIMATION_SPEEDS[speed] || ANIMATION_SPEEDS.normal;
  };

  // Get layout spacing class based on density setting
  const getLayoutClasses = () => {
    const baseClasses = "flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 relative";

    const contrastMode = visualSettings?.contrastMode || 'standard';
    const layoutDensity = visualSettings?.layoutDensity || 'comfortable';

    const contrastClass = contrastMode === 'high' ? 'high-contrast' : '';

    let densityClass = '';
    switch (layoutDensity) {
      case 'compact': densityClass = 'layout-compact'; break;
      case 'comfortable': densityClass = 'layout-comfortable'; break;
      case 'spacious': densityClass = 'layout-spacious'; break;
      default: densityClass = 'layout-comfortable';
    }

    return `${baseClasses} ${densityClass} ${contrastClass}`;
  };

  // Get main grid spacing classes based on visual settings
  const getMainGridClasses = () => {
    const baseClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    const spacing = visualSettings?.spacing || 'normal';

    let gapClass = '';
    switch (spacing) {
      case 'tight': gapClass = 'gap-2 md:gap-3'; break;
      case 'normal': gapClass = 'gap-4 md:gap-6'; break;
      case 'relaxed': gapClass = 'gap-6 md:gap-8'; break;
      default: gapClass = 'gap-4 md:gap-6';
    }

    return `${baseClasses} ${gapClass}`;
  };

  // Get the current theme colors - Memoize to avoid recalculation
  const themeColors = useMemo(() => getThemeColor(), [getThemeColor]);

  // Apply data-theme attribute to document element for theme colors
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const colorTheme = visualSettings?.colorTheme || 'violet';
      document.documentElement.setAttribute('data-theme', colorTheme);
    }
  }, [visualSettings?.colorTheme]);

  return (
    <div
      className={getLayoutClasses()}
      style={{
        fontFamily: 'var(--font-space-grotesk)',
        '--theme-primary': themeColors.primary,
        '--theme-secondary': themeColors.secondary,
      } as React.CSSProperties}
    >
      {visualSettings && visualSettings.backgroundStyle !== 'none' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <AnimatedBackground
            variant={visualSettings.backgroundStyle}
            color={themeColors.primary}
            speed={getAnimationSpeed()}
          />
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-all duration-300">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.svg" alt="DevDashboard Logo" width={28} height={28} className="group-hover:rotate-[15deg] transition-transform duration-300" />
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-theme-primary transition-colors duration-300" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              DevDashboard
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <GitHubStatusBadge isConnected={isGitHubConnected} className="hidden sm:flex" />

          <button
            onClick={() => setShowCardPanel(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary transition-all duration-200 relative"
            aria-label="Manage cards"
            title="Manage Dashboard Cards"
          >
            <LayoutGrid className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            {hiddenCards.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {hiddenCards.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
              toast.success('Dashboard refreshed', { duration: 1500 });
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary transition-all duration-200"
            aria-label="Refresh dashboard"
          >
            <RefreshCcw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              localStorage.setItem('devdashboard-theme', newMode ? 'dark' : 'light');
              toast.success(`Theme changed to ${newMode ? 'Dark' : 'Light'} Mode`, { duration: 1500 });
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary transition-all duration-200"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4 text-gray-600" />
            )}
          </button>

          <VisualSettings
            onSettingsChange={setVisualSettings}
            className="relative z-[9999]" // Ensure it's above other elements
          />

          <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-theme-primary transition-all duration-200 cursor-pointer" title="User Profile (Coming Soon)">
            U
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 relative z-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleCardDragStart}
          onDragEnd={handleCardDragEnd}
          onDragCancel={handleCardDragCancel}
        >
          <SortableContext items={visibleCards.map((card: DashboardCard) => card.id)} strategy={rectSortingStrategy}>
            <div className={getMainGridClasses()}>
              {visibleCards.map((card: DashboardCard) => (
                <React.Fragment key={card.id}>
                  {renderCard(card, {
                    commitActivity,
                    visualSettings,
                    isLoading,
                    newTask,
                    setNewTask,
                    addTask,
                    checklist,
                    sensors,
                    handleDragEnd,
                    toggleChecklistItem,
                    deleteTask,
                    clearCompleted,
                    pullRequests,
                    getStatusColor,
                    repoFilter,
                    setRepoFilter,
                    filteredRepositories,
                    onCloseCard,
                    // Pomodoro timer props
                    pomodoroTime,
                    pomodoroActive,
                    pomodoroSessions,
                    isBreak,
                    startPomodoro,
                    pausePomodoro,
                    resetPomodoro,
                    formatTime
                  })}
                </React.Fragment>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeCard ? (
              <div className={`${activeCard.colSpan} bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl border border-blue-500 opacity-90 scale-105 transform transition-all duration-200`}>
                {renderCard(activeCard, {
                  commitActivity,
                  visualSettings,
                  isLoading,
                  newTask,
                  setNewTask,
                  addTask,
                  checklist,
                  sensors,
                  handleDragEnd,
                  toggleChecklistItem,
                  deleteTask,
                  clearCompleted,
                  pullRequests,
                  getStatusColor,
                  repoFilter,
                  setRepoFilter,
                  filteredRepositories,
                  onCloseCard,
                  // Pomodoro timer props
                  pomodoroTime,
                  pomodoroActive,
                  pomodoroSessions,
                  isBreak,
                  startPomodoro,
                  pausePomodoro,
                  resetPomodoro,
                  formatTime
                })}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {showCardPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Manage Dashboard Cards
              </h2>
              <button
                onClick={() => setShowCardPanel(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Close panel"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Visible Cards ({visibleCards.length})</h3>
                {visibleCards.length > 0 ? (
                  <ul className="space-y-2">
                    {visibleCards.map((card: DashboardCard) => (
                      <li key={card.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
                        <span className="text-sm text-gray-800 dark:text-gray-200">{card.title}</span>
                        <button
                          onClick={() => onCloseCard(card.id)}
                          className="text-xs px-2 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600 transition-colors"
                        >
                          Hide
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No cards are currently visible. Add some from the section below.</p>
                )}
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Hidden Cards ({hiddenCards.length})</h3>
                {hiddenCards.length > 0 ? (
                  <ul className="space-y-2">
                    {hiddenCards.map((card: DashboardCard) => (
                      <li key={card.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
                        <span className="text-sm text-gray-800 dark:text-gray-200">{card.title}</span>
                        <button
                          onClick={() => addCard(card.id)}
                          className="text-xs px-2 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-600 dark:text-green-100 dark:hover:bg-green-500 transition-colors"
                        >
                          Show
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">All available cards are currently visible on your dashboard.</p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCardPanel(false)}
                className="w-full p-2 text-sm bg-theme-primary text-white rounded-lg hover:bg-theme-secondary transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="p-4 md:p-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 relative z-10">
        &copy; {new Date().getFullYear()} DevDashboard. Built with Next.js, Tailwind CSS, and &hearts;.
      </footer>
    </div>
  );
}
