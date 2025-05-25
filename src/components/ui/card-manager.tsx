"use client";

import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, arrayMove, useSortable } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckSquare, Square, X } from 'lucide-react';

export type DashboardCard = {
  id: string;
  title: string;
  enabled: boolean;
  size: 'small' | 'medium' | 'large';
  description: string;
};

export type CardLayoutSettings = {
  cards: DashboardCard[];
  layout: string[];
};

const defaultCards: DashboardCard[] = [
  {
    id: 'github-activity',
    title: 'Recent Activity Heatmap', // Updated title
    enabled: true,
    size: 'large',
    description: 'Shows your recent commits and contribution activity.'
  },
  {
    id: 'commit-line-chart', // New card
    title: 'Commit Activity Over Time',
    enabled: true,
    size: 'large',
    description: 'Visualizes commit frequency over time.'
  },
  {
    id: 'goals', // Changed ID from 'tasks'
    title: "Today's Goals",
    enabled: true,
    size: 'medium',
    description: 'Track your daily tasks and goals.'
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro Timer',
    enabled: true, // Defaulting to true, was false. localStorage will override.
    size: 'medium',
    description: 'Focus timer with 25-minute work sessions and breaks.'
  },
  {
    id: 'quick-links',
    title: 'Quick Links', // Updated title, was 'Quick Links Launcher'
    enabled: true, // Defaulting to true, was false. localStorage will override.
    size: 'small',
    description: 'Fast access buttons to common developer sites.' // Updated description
  },
  {
    id: 'quick-notes',
    title: 'Quick Notes',
    enabled: true,
    size: 'medium',
    description: 'Markdown-enabled scratchpad for notes and ideas.'
  },
  {
    id: 'languages', // New card
    title: 'Languages Used',
    enabled: true,
    size: 'medium',
    description: 'Breakdown of programming languages used.'
  },
  {
    id: 'pull-requests',
    title: 'Pull Requests',
    enabled: true,
    size: 'medium',
    description: 'Monitor open PRs that need attention.'
  },
  {
    id: 'repositories',
    title: 'Top Repositories',
    enabled: true,
    size: 'medium',
    description: 'Browse and filter your repositories.'
  }
  // 'streak' and 'notifications' have been removed to align with reset/page.tsx definitions.
];

type SortableCardItemProps = {
  card: DashboardCard;
  onToggle: (id: string) => void;
};

function SortableCardItem({ card, onToggle }: SortableCardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 
        mb-2 cursor-grab active:cursor-grabbing flex items-center justify-between 
        ${isDragging ? 'shadow-lg' : 'hover:shadow-md'} transition-all duration-200`}
    >
      <div className="flex items-center gap-2">
        <span {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-gray-400" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            {card.title}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {card.description}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
          {card.size === 'small' ? 'S' : card.size === 'medium' ? 'M' : 'L'}
        </div>
        <button
          onClick={() => onToggle(card.id)}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          aria-label={card.enabled ? 'Disable card' : 'Enable card'}
        >
          {card.enabled ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

type CardManagerProps = {
  onUpdateAction: (settings: CardLayoutSettings) => void;
  initialSettings?: CardLayoutSettings;
  onCloseAction: () => void;
  className?: string;
};

export function CardManager({ onUpdateAction, initialSettings, onCloseAction, className = '' }: CardManagerProps) {
  const [cards, setCards] = useState<DashboardCard[]>(() => {
    const baseCards = defaultCards.map(card => ({ ...card }));

    if (initialSettings?.cards) {
      const initialCardsMap = new Map(
        initialSettings.cards.map(c => [c.id, c])
      );
      const mergedAndOrderedCards: DashboardCard[] = [];

      initialSettings.cards.forEach(initialCardFromStorage => {
        const defaultCardDefinition = baseCards.find(bc => bc.id === initialCardFromStorage.id);
        if (defaultCardDefinition) {
          const mergedCard: DashboardCard = {
            id: defaultCardDefinition.id,
            title: initialCardFromStorage.title || defaultCardDefinition.title,
            // Correctly use 'enabled' from initialCardFromStorage if it exists (already transformed by DashboardSettings)
            // otherwise, use 'enabled' from defaultCardDefinition
            enabled: typeof (initialCardFromStorage as any).enabled === 'boolean' 
                       ? (initialCardFromStorage as any).enabled 
                       : defaultCardDefinition.enabled,
            size: defaultCardDefinition.size,
            description: defaultCardDefinition.description,
          };
          mergedAndOrderedCards.push(mergedCard);
        }
      });

      baseCards.forEach(defaultCardDefinition => {
        if (!initialCardsMap.has(defaultCardDefinition.id)) {
          mergedAndOrderedCards.push({ ...defaultCardDefinition });
        }
      });
      
      return mergedAndOrderedCards;
    }
    return baseCards;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleCard = (id: string) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, enabled: !card.enabled } : card
    ));
  };

  const handleSave = () => {
    const layout = cards.filter(card => card.enabled).map(card => card.id);
    onUpdateAction({ cards, layout });
    onCloseAction();
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base font-medium" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Manage Dashboard Cards</h2>
        <button
          onClick={onCloseAction}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Drag to reorder cards. Toggle visibility with the checkbox.
        </p>

        <div className="max-h-[300px] overflow-y-auto mb-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
          >
            <SortableContext items={cards.map(card => card.id)}>
              <div>
                {cards.map(card => (
                  <SortableCardItem
                    key={card.id}
                    card={card}
                    onToggle={toggleCard}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors text-xs font-medium"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            Save Layout
          </button>
        </div>
      </div>
    </div>
  );
}
