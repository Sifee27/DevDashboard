'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';

interface TaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ id, text, completed, onToggle, onDelete }: TaskItemProps) {
  const [showDelete, setShowDelete] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 py-2 px-1 rounded-md",
        isDragging ? "bg-gray-100 dark:bg-gray-800" : "",
        showDelete ? "bg-gray-50 dark:bg-gray-900" : ""
      )}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div 
        {...listeners} 
        {...attributes}
        className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical size={16} />
      </div>
      
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0"
      />
      
      <span className={cn(
        "text-xs flex-1",
        completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'
      )}>
        {text}
      </span>
      
      {showDelete && (
        <button 
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
