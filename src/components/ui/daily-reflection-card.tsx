"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Save, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

type DailyReflection = {
    date: string;
    worked_on: string;
    learned: string;
    next_steps: string;
};

export function DailyReflectionCard() {
    const [reflections, setReflections] = useState<DailyReflection[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('devdashboard-daily-reflections');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Failed to parse daily reflections:', e);
                }
            }
        }
        return [];
    });

    const [currentReflection, setCurrentReflection] = useState<DailyReflection>(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayReflection = reflections.find(r => r.date === today);
        return todayReflection || {
            date: today,
            worked_on: '',
            learned: '',
            next_steps: ''
        };
    });

    const [isEditing, setIsEditing] = useState(false);

    // Save reflections to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('devdashboard-daily-reflections', JSON.stringify(reflections));
        }
    }, [reflections]);

    const saveReflection = () => {
        if (!currentReflection.worked_on.trim() && !currentReflection.learned.trim() && !currentReflection.next_steps.trim()) {
            toast.error('Please fill in at least one field before saving.');
            return;
        }

        const updatedReflections = reflections.filter(r => r.date !== currentReflection.date);
        updatedReflections.push(currentReflection);
        updatedReflections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setReflections(updatedReflections);
        setIsEditing(false);
        toast.success('Daily reflection saved!');
    };

    const handleInputChange = (field: keyof Omit<DailyReflection, 'date'>, value: string) => {
        setCurrentReflection(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const hasReflectionToday = currentReflection.worked_on || currentReflection.learned || currentReflection.next_steps;

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        Daily Reflection
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {today}
                    </span>
                </div>
            </div>

            <div className="flex-grow space-y-4">
                {/* Question 1: What did I work on? */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🔨 What did I work on today?
                    </label>
                    {isEditing ? (
                        <textarea
                            value={currentReflection.worked_on}
                            onChange={(e) => handleInputChange('worked_on', e.target.value)}
                            placeholder="Describe what you worked on today..."
                            className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            rows={3}
                        />
                    ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md min-h-[76px]">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {currentReflection.worked_on || <span className="text-gray-400 italic">No reflection yet...</span>}
                            </p>
                        </div>
                    )}
                </div>

                {/* Question 2: What did I learn? */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        💡 What did I learn today?
                    </label>
                    {isEditing ? (
                        <textarea
                            value={currentReflection.learned}
                            onChange={(e) => handleInputChange('learned', e.target.value)}
                            placeholder="Share what new things you learned..."
                            className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            rows={3}
                        />
                    ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md min-h-[76px]">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {currentReflection.learned || <span className="text-gray-400 italic">No reflection yet...</span>}
                            </p>
                        </div>
                    )}
                </div>

                {/* Question 3: What's next? */}        <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🎯 What&apos;s next?
                    </label>
                    {isEditing ? (
                        <textarea
                            value={currentReflection.next_steps}
                            onChange={(e) => handleInputChange('next_steps', e.target.value)}
                            placeholder="Plan your next steps and goals..."
                            className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            rows={3}
                        />
                    ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md min-h-[76px]">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {currentReflection.next_steps || <span className="text-gray-400 italic">No reflection yet...</span>}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${hasReflectionToday ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {hasReflectionToday ? 'Reflection completed' : 'No reflection yet'}
                    </span>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveReflection}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center gap-1"
                            >
                                <Save className="h-3 w-3" />
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center gap-1"
                        >
                            <Edit3 className="h-3 w-3" />
                            {hasReflectionToday ? 'Edit' : 'Start Reflection'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
