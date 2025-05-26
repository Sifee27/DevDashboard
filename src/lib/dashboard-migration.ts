// Dashboard migration utilities
import { toast } from 'sonner';

export type DashboardCard = {
    id: string;
    title: string;
    type?: 'github-activity' | 'pull-requests' | 'repositories' | 'languages' | 'commit-line-chart' | 'pomodoro' | 'quick-links' | 'quick-notes' | 'daily-reflection' | 'streak-tracker' | 'goal-progress' | 'color-palette' | 'api-tester' | 'code-snippets' | 'network-monitor' | 'system-info';
    colSpan?: string;
    visible?: boolean;
    enabled?: boolean;
    size?: string;
    description?: string;
};

// Current dashboard version - increment when adding new cards
export const DASHBOARD_VERSION = '1.1.0';

// Default cards configuration
export const getDefaultCards = (): DashboardCard[] => [
    { id: 'github-activity', title: 'Recent Activity Heatmap', type: 'github-activity', colSpan: 'col-span-1 lg:col-span-2', visible: true, enabled: true, size: 'large', description: 'Shows your recent commits and contribution activity.' },
    { id: 'commit-line-chart', title: 'Commit Activity Over Time', type: 'commit-line-chart', colSpan: 'col-span-1 lg:col-span-2', visible: true, enabled: true, size: 'large', description: 'Visualizes commit frequency over time.' },
    { id: 'pomodoro', title: 'Pomodoro Timer', type: 'pomodoro', colSpan: 'col-span-1', visible: true, enabled: true, size: 'medium', description: 'Focus timer with 25-minute work sessions and breaks.' },
    { id: 'quick-links', title: 'Quick Links', type: 'quick-links', colSpan: 'col-span-1', visible: true, enabled: true, size: 'small', description: 'Fast access buttons to common developer sites.' },
    { id: 'quick-notes', title: 'Quick Notes', type: 'quick-notes', colSpan: 'col-span-1 lg:col-span-2', visible: true, enabled: true, size: 'medium', description: 'Markdown-enabled scratchpad for notes and ideas.' },
    { id: 'daily-reflection', title: 'Daily Reflection', type: 'daily-reflection', colSpan: 'col-span-1 lg:col-span-2', visible: true, enabled: true, size: 'large', description: 'Daily journal with reflection questions for personal growth.' },
    { id: 'streak-tracker', title: 'Coding Streak Tracker', type: 'streak-tracker', colSpan: 'col-span-1', visible: true, enabled: true, size: 'medium', description: 'Track your daily coding streak with GitHub integration.' },
    { id: 'goal-progress', title: 'Goal Progress Tracker', type: 'goal-progress', colSpan: 'col-span-1', visible: true, enabled: true, size: 'medium', description: 'Set and track daily goals with progress visualization.' },
    { id: 'languages', title: 'Languages Used', type: 'languages', colSpan: 'col-span-1', visible: true, enabled: true, size: 'medium', description: 'Breakdown of programming languages used.' },
    { id: 'pull-requests', title: 'Pull Requests', type: 'pull-requests', colSpan: 'col-span-1 lg:col-span-2', visible: true, enabled: true, size: 'medium', description: 'Monitor open PRs that need attention.' },
    { id: 'repositories', title: 'Top Repositories', type: 'repositories', colSpan: 'col-span-1 lg:col-span-2', visible: true, enabled: true, size: 'medium', description: 'Browse and filter your repositories.' }
];

// Auto-migration function to add new cards to existing configurations
export const migrateCardsConfig = (savedCards: DashboardCard[], currentVersion: string, showToast: boolean = true): DashboardCard[] => {
    const defaultCards = getDefaultCards();
    const savedCardIds = new Set(savedCards.map(card => card.id));

    // Find new cards that don't exist in saved config
    const newCards = defaultCards.filter(defaultCard => !savedCardIds.has(defaultCard.id));

    if (newCards.length > 0) {
        console.log(`Dashboard migration: Adding ${newCards.length} new cards:`, newCards.map(c => c.title));

        if (showToast && typeof window !== 'undefined') {
            toast.success(`${newCards.length} new dashboard cards added! Check the card manager to customize.`, {
                duration: 5000
            });
        }
    }

    // Merge saved cards with new cards, preserving user customizations
    const mergedCards = [...savedCards];

    // Add new cards at the end
    newCards.forEach(newCard => {
        mergedCards.push(newCard);
    });

    return mergedCards;
};

// Check if migration is needed and perform it
export const checkAndMigrateDashboard = (storageKey: string = 'devdashboard-card-order', showToast: boolean = true): DashboardCard[] => {
    if (typeof window === 'undefined') {
        return getDefaultCards();
    }

    const savedCards = localStorage.getItem(storageKey);
    const savedVersion = localStorage.getItem('devdashboard-version');

    if (savedCards) {
        try {
            const parsedCards = JSON.parse(savedCards);

            // Check if we need to migrate (version mismatch or no version stored)
            if (!savedVersion || savedVersion !== DASHBOARD_VERSION) {
                const migratedCards = migrateCardsConfig(parsedCards, DASHBOARD_VERSION, showToast);

                // Save migrated config and update version
                localStorage.setItem(storageKey, JSON.stringify(migratedCards));
                localStorage.setItem('devdashboard-version', DASHBOARD_VERSION);

                return migratedCards;
            }

            return parsedCards;
        } catch (e) {
            console.error('Failed to parse card order from localStorage:', e);
        }
    } else {
        // First time user - save version
        localStorage.setItem('devdashboard-version', DASHBOARD_VERSION);
    }

    return getDefaultCards();
};
