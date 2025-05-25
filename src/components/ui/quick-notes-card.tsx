"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Terminal, X, Pencil, Save, Check } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

type TerminalCommand = {
  id: string;
  name: string;
  command: string;
};

// QuickNotesCard component with Markdown support
export function QuickNotesCard() {  // State for notes content with localStorage persistence
  const [notes, setNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('devdashboard-quick-notes');
      return savedNotes || '## Quick Notes\n\nUse this space to jot down ideas, commands, or anything you need to remember.\n\n- Supports **markdown** formatting\n- Auto-saves as you type\n- Persists between sessions\n\n```\n// Code blocks work too!\nconst hello = "world";\n```\n\n### Terminal Commands\n\nSwitch to the Commands tab to store frequently used terminal commands for quick access.';
    }
    return '';
  });
  
  // State for terminal commands with localStorage persistence
  const [commands, setCommands] = useState<TerminalCommand[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCommands = localStorage.getItem('devdashboard-terminal-commands');
      if (savedCommands) {
        try {
          return JSON.parse(savedCommands);
        } catch (e) {
          console.error('Failed to parse terminal commands:', e);
        }
      }
      // Default commands
      return [
        { id: '1', name: 'Git Status', command: 'git status' },
        { id: '2', name: 'Run Dev Server', command: 'npm run dev' },
        { id: '3', name: 'Build Project', command: 'npm run build' }
      ];
    }
    return [];
  });
  
  // State for view mode (edit or preview)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  // State for the active tab (notes or commands)
  const [activeTab, setActiveTab] = useState<'notes' | 'commands'>('notes');
  
  // State for command editing
  const [editingCommandId, setEditingCommandId] = useState<string | null>(null);
  const [newCommandName, setNewCommandName] = useState('');
  const [newCommandText, setNewCommandText] = useState('');
  const [showAddCommand, setShowAddCommand] = useState(false);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devdashboard-quick-notes', notes);
    }
  }, [notes]);
  
  // Save commands to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devdashboard-terminal-commands', JSON.stringify(commands));
    }
  }, [commands]);
  
  const copyCommand = (command: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(command);
      toast.success('Command copied to clipboard!');
    }
  };
  
  const addCommand = () => {
    if (newCommandName.trim() && newCommandText.trim()) {
      const newCommand = {
        id: Date.now().toString(),
        name: newCommandName.trim(),
        command: newCommandText.trim()
      };
      setCommands([...commands, newCommand]);
      setNewCommandName('');
      setNewCommandText('');
      setShowAddCommand(false);
      toast.success('Command saved!');
    }
  };
  
  const startEditCommand = (command: TerminalCommand) => {
    setEditingCommandId(command.id);
    setNewCommandName(command.name);
    setNewCommandText(command.command);
  };
  
  const saveEditCommand = () => {
    if (editingCommandId && newCommandName.trim() && newCommandText.trim()) {
      setCommands(commands.map(cmd => 
        cmd.id === editingCommandId 
          ? { ...cmd, name: newCommandName.trim(), command: newCommandText.trim() } 
          : cmd
      ));
      setEditingCommandId(null);
      setNewCommandName('');
      setNewCommandText('');
      toast.success('Command updated!');
    }
  };
  
  const deleteCommand = (id: string) => {
    setCommands(commands.filter(cmd => cmd.id !== id));
    toast('Command deleted', { icon: '🗑️' });
  };
  
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Quick Notes
        </h3>
        <div className="flex space-x-2">
          {/* Tab switcher */}
          <div className="mr-2 flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setActiveTab('notes')}
              className={`px-2 py-1 text-xs transition-all ${
                activeTab === 'notes' 
                  ? 'bg-theme-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Notes
            </button>
            <button 
              onClick={() => setActiveTab('commands')}
              className={`px-2 py-1 text-xs transition-all ${
                activeTab === 'commands' 
                  ? 'bg-theme-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Commands
            </button>
          </div>
          
          {activeTab === 'notes' && (
            <>
              <button 
                onClick={() => setViewMode('edit')}
                className={`px-2 py-1 text-xs rounded-md transition-all ${
                  viewMode === 'edit' 
                    ? 'bg-theme-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                Edit
              </button>
              <button 
                onClick={() => setViewMode('preview')}
                className={`px-2 py-1 text-xs rounded-md transition-all ${
                  viewMode === 'preview' 
                    ? 'bg-theme-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                Preview
              </button>
              <button 
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(notes);
                    toast.success('Notes copied to clipboard!');
                  }
                }}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                title="Copy to clipboard"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          
          {activeTab === 'commands' && (
            <button 
              onClick={() => setShowAddCommand(true)}
              className="px-2 py-1 text-xs bg-theme-primary text-white rounded-md hover:bg-theme-secondary transition-all"
              title="Add new command"
            >
              Add Command
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-grow relative">
        {activeTab === 'notes' && viewMode === 'edit' && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-full p-3 text-sm font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-theme-primary transition-all"
            placeholder="Type your notes here using Markdown..."
          />
        )}
        
        {activeTab === 'notes' && viewMode === 'preview' && (
          <div className="w-full h-full p-3 overflow-auto bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>
                {notes}
              </ReactMarkdown>
            </div>
          </div>
        )}
        
        {activeTab === 'commands' && (
          <div className="w-full h-full overflow-auto">
            {showAddCommand ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Add New Command</h4>
                  <button 
                    onClick={() => setShowAddCommand(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCommandName}
                    onChange={(e) => setNewCommandName(e.target.value)}
                    placeholder="Command name"
                    className="w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                  <input
                    type="text"
                    value={newCommandText}
                    onChange={(e) => setNewCommandText(e.target.value)}
                    placeholder="Command (e.g., git pull)"
                    className="w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-theme-primary font-mono"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowAddCommand(false)}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addCommand}
                      className="px-3 py-1 text-xs bg-theme-primary text-white rounded-md hover:bg-theme-secondary transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            
            {editingCommandId ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Command</h4>
                  <button 
                    onClick={() => setEditingCommandId(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCommandName}
                    onChange={(e) => setNewCommandName(e.target.value)}
                    placeholder="Command name"
                    className="w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                  <input
                    type="text"
                    value={newCommandText}
                    onChange={(e) => setNewCommandText(e.target.value)}
                    placeholder="Command (e.g., git pull)"
                    className="w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-theme-primary font-mono"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingCommandId(null)}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEditCommand}
                      className="px-3 py-1 text-xs bg-theme-primary text-white rounded-md hover:bg-theme-secondary transition-all"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            
            <div className="space-y-2">
              {commands.map(command => (
                <div 
                  key={command.id} 
                  className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{command.name}</h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEditCommand(command)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
                        title="Edit command"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCommand(command.id)}
                        className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-all"
                        title="Delete command"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-800 dark:text-gray-300 max-w-[80%] overflow-x-auto">
                      {command.command}
                    </code>
                    <button
                      onClick={() => copyCommand(command.command)}
                      className="p-1 text-gray-500 hover:text-theme-primary dark:text-gray-400 dark:hover:text-theme-primary transition-all"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {commands.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Terminal className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No commands saved yet. Add your first command!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
