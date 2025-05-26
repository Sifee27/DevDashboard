'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, UserCircle, Sun, Moon } from 'lucide-react';

interface UserProfileDropdownProps {
    className?: string;
    darkMode?: boolean;
    onToggleTheme?: () => void;
}

export function UserProfileDropdown({
    className = '',
    darkMode,
    onToggleTheme
}: UserProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when dropdown is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close dropdown on ESC key
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuItemClick = (action: string) => {
        setIsOpen(false);

        switch (action) {
            case 'profile':
                console.log('Profile clicked');
                // Add profile navigation logic here
                break;
            case 'settings':
                console.log('Settings clicked');
                // Add settings navigation logic here
                break;
            case 'theme':
                if (onToggleTheme) {
                    onToggleTheme();
                }
                break;
            case 'logout':
                console.log('Logout clicked');
                // Add logout logic here
                break;
            default:
                break;
        }
    };

    return (
        <>
            {/* Background overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`relative ${className}`}>
                {/* Profile button */}
                <button
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="User profile menu"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Dropdown menu */}
                <div
                    ref={dropdownRef}
                    className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Developer
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    developer@example.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                        <button
                            onClick={() => handleMenuItemClick('profile')}
                            className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        >
                            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Profile</span>
                        </button>

                        <button
                            onClick={() => handleMenuItemClick('settings')}
                            className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        >
                            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Settings</span>
                        </button>

                        {/* Theme toggle - only show if onToggleTheme is provided */}
                        {onToggleTheme && (
                            <button
                                onClick={() => handleMenuItemClick('theme')}
                                className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                )}
                                <span className="text-gray-700 dark:text-gray-300">
                                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                                </span>
                            </button>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                        <button
                            onClick={() => handleMenuItemClick('logout')}
                            className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 text-red-600 dark:text-red-400"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign out</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            DevDashboard v1.1.0
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
