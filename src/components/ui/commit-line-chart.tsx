"use client";

import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type CommitData = {
    date: string;
    count: number;
};

type CommitLineChartProps = {
    data: CommitData[];
    isDarkMode: boolean;
    className?: string;
    height?: number;
    themeColor: string;
};

export const CommitLineChart: FC<CommitLineChartProps> = ({
    data,
    isDarkMode,
    className = '',
    height = 300,
    themeColor = '#8b5cf6'
}) => {
    // Consolidate data by week for a better visualization
    type WeeklyDataItem = { name: string; commits: number };
    const weeklyData = data.reduce((acc: WeeklyDataItem[], item, index) => {
        const weekIndex = Math.floor(index / 7);

        if (!acc[weekIndex]) {
            // Extract date for the first day of the week
            const weekDate = new Date(item.date);
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

            acc[weekIndex] = {
                name: weekDate.toLocaleDateString('en-US', options),
                commits: 0
            };
        }

        acc[weekIndex].commits += item.count;
        return acc;
    }, []);

    return (
        <div className={`w-full ${className}`} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={weeklyData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? '#333' : '#eee'}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="name"
                        stroke={isDarkMode ? '#aaa' : '#666'}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke={isDarkMode ? '#aaa' : '#666'}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        allowDecimals={false}
                        tickCount={5}
                        domain={[0, 'auto']}
                        label={{
                            value: 'Commits',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: isDarkMode ? '#aaa' : '#666', fontSize: 12 }
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                            borderRadius: 8,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            color: isDarkMode ? '#f3f4f6' : '#1f2937',
                            fontSize: 12
                        }}
                        itemStyle={{ color: themeColor }}
                        formatter={(value: number) => [`${value} commits`, 'Total']}
                        labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="commits"
                        stroke={themeColor}
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            fill: isDarkMode ? '#1f2937' : '#fff',
                            stroke: themeColor,
                            strokeWidth: 2
                        }}
                        activeDot={{
                            r: 6,
                            stroke: themeColor,
                            strokeWidth: 2,
                            fill: themeColor
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
