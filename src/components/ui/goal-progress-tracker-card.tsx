"use client";

import React, { useState, useEffect } from 'react';
import { Target, Plus, X, CheckCircle, Circle, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

type Goal = {
    id: string;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category?: string;
};

type GoalProgress = {
    date: string;
    goals: Goal[];
    completedCount: number;
    totalCount: number;
    completionRate: number;
};

export function GoalProgressTrackerCard() {
    const [todayGoals, setTodayGoals] = useState<Goal[]>(() => {
        if (typeof window !== 'undefined') {
            const today = new Date().toISOString().split('T')[0];
            const saved = localStorage.getItem(`devdashboard-goals-${today}`);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Failed to parse today goals:', e);
                }
            }
        }
        // Default goals
        return [
            { id: '1', title: 'Review pull requests', completed: true, priority: 'high' },
            { id: '2', title: 'Fix authentication bug', completed: true, priority: 'high' },
            { id: '3', title: 'Update documentation', completed: false, priority: 'medium' },
            { id: '4', title: 'Plan next sprint', completed: false, priority: 'low' },
            { id: '5', title: 'Code review session', completed: false, priority: 'medium' }
        ];
    });

    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalPriority, setNewGoalPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [showAddGoal, setShowAddGoal] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // Calculate progress
    const completedCount = todayGoals.filter(goal => goal.completed).length;
    const totalCount = todayGoals.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Save goals to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`devdashboard-goals-${today}`, JSON.stringify(todayGoals));

            // Also save to progress history
            const progressHistory = getProgressHistory();
            const todayProgress: GoalProgress = {
                date: today,
                goals: todayGoals,
                completedCount,
                totalCount,
                completionRate
            };

            const updatedHistory = progressHistory.filter(p => p.date !== today);
            updatedHistory.push(todayProgress);
            updatedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Keep only last 30 days
            const last30Days = updatedHistory.slice(0, 30);
            localStorage.setItem('devdashboard-goal-progress-history', JSON.stringify(last30Days));
        }
    }, [todayGoals, completedCount, totalCount, completionRate, today]);

    const getProgressHistory = (): GoalProgress[] => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('devdashboard-goal-progress-history');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Failed to parse progress history:', e);
                }
            }
        }
        return [];
    };

    const toggleGoal = (goalId: string) => {
        setTodayGoals(goals =>
            goals.map(goal =>
                goal.id === goalId
                    ? { ...goal, completed: !goal.completed }
                    : goal
            )
        );
    };

    const deleteGoal = (goalId: string) => {
        setTodayGoals(goals => goals.filter(goal => goal.id !== goalId));
        toast('Goal removed', { icon: '🗑️' });
    };

    const addGoal = () => {
        if (newGoalTitle.trim()) {
            const newGoal: Goal = {
                id: Date.now().toString(),
                title: newGoalTitle.trim(),
                completed: false,
                priority: newGoalPriority
            };

            setTodayGoals(goals => [...goals, newGoal]);
            setNewGoalTitle('');
            setNewGoalPriority('medium');
            setShowAddGoal(false);
            toast.success('Goal added!');
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    const getProgressColor = () => {
        if (completionRate >= 80) return 'bg-green-500';
        if (completionRate >= 60) return 'bg-yellow-500';
        if (completionRate >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    // Get recent progress trend
    const progressHistory = getProgressHistory();
    const recentHistory = progressHistory.slice(0, 7); // Last 7 days
    const averageCompletion = recentHistory.length > 0
        ? Math.round(recentHistory.reduce((sum, day) => sum + day.completionRate, 0) / recentHistory.length)
        : 0;

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        Goal Progress
                    </h3>
                </div>
                <button
                    onClick={() => setShowAddGoal(true)}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Add new goal"
                >
                    <Plus className="h-4 w-4 text-gray-500" />
                </button>
            </div>

            {/* Progress Overview */}
            <div className="mb-4">        <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Today&apos;s Progress
                </span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {completedCount}/{totalCount}
                </span>
            </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                        style={{ width: `${completionRate}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{completionRate}% completed</span>
                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>7-day avg: {averageCompletion}%</span>
                    </div>
                </div>
            </div>

            {/* Add New Goal */}
            {showAddGoal && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add New Goal</span>
                        <button
                            onClick={() => setShowAddGoal(false)}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            value={newGoalTitle}
                            onChange={(e) => setNewGoalTitle(e.target.value)}
                            placeholder="Enter goal title..."
                            className="w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                        />

                        <div className="flex justify-between items-center">
                            <select
                                value={newGoalPriority}
                                onChange={(e) => setNewGoalPriority(e.target.value as 'low' | 'medium' | 'high')}
                                className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>

                            <button
                                onClick={addGoal}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                            >
                                Add Goal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Goals List */}
            <div className="flex-grow overflow-auto space-y-2">
                {todayGoals.map(goal => (
                    <div
                        key={goal.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${goal.completed
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-sm'
                            }`}
                    >
                        <button
                            onClick={() => toggleGoal(goal.id)}
                            className="flex-shrink-0"
                        >
                            {goal.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                            )}
                        </button>

                        <div className="flex-grow min-w-0">
                            <span className={`text-sm ${goal.completed
                                    ? 'text-gray-500 dark:text-gray-400 line-through'
                                    : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                {goal.title}
                            </span>
                        </div>

                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority}
                        </span>

                        <button
                            onClick={() => deleteGoal(goal.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete goal"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                {todayGoals.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Target className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No goals set for today.</p>
                        <p className="text-xs">Click the + button to add your first goal!</p>
                    </div>
                )}
            </div>

            {/* Daily Summary */}
            {todayGoals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Today</span>
                        </div>
                        <span>
                            {completionRate === 100 ? '🎉 All goals completed!' :
                                completionRate >= 80 ? '🚀 Almost there!' :
                                    completionRate >= 50 ? '💪 Good progress!' :
                                        '⏰ Keep going!'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
