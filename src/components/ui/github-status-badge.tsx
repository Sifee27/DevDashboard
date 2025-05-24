"use client";

import { FC } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type GitHubStatusBadgeProps = {
    isConnected: boolean;
    className?: string;
};

export const GitHubStatusBadge: FC<GitHubStatusBadgeProps> = ({ isConnected, className = '' }) => {
    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${className} ${isConnected
                ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
            }`}>
            {isConnected ? (
                <>
                    <CheckCircle2 size={14} className="text-green-500 dark:text-green-400" />
                    <span>GitHub Connected</span>
                </>
            ) : (
                <>
                    <XCircle size={14} className="text-red-500 dark:text-red-400" />
                    <span>GitHub Disconnected</span>
                </>
            )}
        </div>
    );
};
