"use client";

import React, { useState, useEffect } from 'react';
import { Flame, Calendar, Github, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

type StreakData = {
    currentStreak: number;
    longestStreak: number;
    lastCommitDate: string;
    totalCommits: number;
    streakHistory: Array<{ date: string; hasActivity: boolean }>;
};

export function StreakTrackerCard() {
    const [streakData, setStreakData] = useState<StreakData>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('devdashboard-streak-data');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Failed to parse streak data:', e);
                }
            }
        }
        // Default/demo data
        return {
            currentStreak: 7,
            longestStreak: 23,
            lastCommitDate: new Date().toISOString().split('T')[0],
            totalCommits: 156,
            streakHistory: generateStreakHistory()
        };
    });

    const [isLoading, setIsLoading] = useState(false);

    // Generate demo streak history for the last 30 days
    function generateStreakHistory() {
        const history = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Simulate activity (higher chance for recent days)
            const hasActivity = Math.random() > (i > 7 ? 0.3 : 0.2);

            history.push({
                date: dateStr,
                hasActivity
            });
        }

        return history;
    }

    // Save streak data to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('devdashboard-streak-data', JSON.stringify(streakData));
        }
    }, [streakData]);

    const refreshStreakData = async () => {
        setIsLoading(true);
        try {
            // Simulate API call - in real implementation, this would call GitHub API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update with mock data
            const newData = {
                ...streakData,
                currentStreak: Math.floor(Math.random() * 15) + 1,
                totalCommits: streakData.totalCommits + Math.floor(Math.random() * 5),
                lastCommitDate: new Date().toISOString().split('T')[0],
                streakHistory: generateStreakHistory()
            };

            setStreakData(newData);
            toast.success('Streak data refreshed!');
        } catch {
            toast.error('Failed to refresh streak data');
        } finally {
            setIsLoading(false);
        }
    };
    const getStreakStatus = () => {
        const lastCommit = new Date(streakData.lastCommitDate);
        const daysSinceLastCommit = Math.floor((new Date().getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceLastCommit === 0) {
            return { status: 'active', message: 'Streak active! 🔥', color: 'text-orange-500' };
        } else if (daysSinceLastCommit === 1) {
            return { status: 'warning', message: 'Keep it going! ⚡', color: 'text-yellow-500' };
        } else {
            return { status: 'broken', message: 'Streak broken 💔', color: 'text-red-500' };
        }
    };

    const streakStatus = getStreakStatus();

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        Coding Streak
                    </h3>
                </div>
                <button
                    onClick={refreshStreakData}
                    disabled={isLoading}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    title="Refresh streak data"
                >
                    <TrendingUp className={`h-4 w-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex-grow space-y-4">
                {/* Current Streak */}
                <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Flame className="h-6 w-6 text-orange-500" />
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                            {streakData.currentStreak}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Current Streak (days)
                    </p>
                    <p className={`text-sm font-medium ${streakStatus.color}`}>
                        {streakStatus.message}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            {streakData.longestStreak}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Longest Streak
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            {streakData.totalCommits}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Total Commits
                        </div>
                    </div>
                </div>

                {/* Activity Heatmap */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Last 30 Days
                    </h4>          <div className="grid grid-cols-10 gap-1">
                        {streakData.streakHistory.map((day) => (
                            <div
                                key={day.date}
                                className={`aspect-square rounded-sm ${day.hasActivity
                                        ? 'bg-green-400 dark:bg-green-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    } hover:scale-110 transition-transform cursor-pointer`}
                                title={`${day.date}: ${day.hasActivity ? 'Active' : 'No activity'}`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-sm" />
                            <div className="w-2 h-2 bg-green-200 dark:bg-green-800 rounded-sm" />
                            <div className="w-2 h-2 bg-green-300 dark:bg-green-700 rounded-sm" />
                            <div className="w-2 h-2 bg-green-400 dark:bg-green-600 rounded-sm" />
                            <div className="w-2 h-2 bg-green-500 dark:bg-green-500 rounded-sm" />
                        </div>
                        <span>More</span>
                    </div>
                </div>

                {/* Last Activity */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Last commit:</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {new Date(streakData.lastCommitDate).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* GitHub Integration Status */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Github className="h-3 w-3" />
                        <span>GitHub Integration</span>
                    </div>
                    <span className="text-green-500 font-medium">
                        Connected
                    </span>
                </div>
            </div>
        </div>
    );
}
