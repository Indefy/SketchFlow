import React from 'react';
import {
  Pencil,
  Square,
  Circle,
  ArrowRight,
  Type,
  MousePointer,
  Undo2,
  Redo2,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
  Move,
  Settings,
  Share2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

import { useStore } from '../store/useStore';


const tools = [
  { id: 'select', icon: MousePointer, label: 'Select (V)', shortcut: 'V' },
  { id: 'pen', icon: Pencil, label: 'Pen (P)', shortcut: 'P' },
  { id: 'rectangle', icon: Square, label: 'Rectangle (R)', shortcut: 'R' },
  { id: 'circle', icon: Circle, label: 'Circle (C)', shortcut: 'C' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)', shortcut: 'A' },
  { id: 'text', icon: Type, label: 'Text (T)', shortcut: 'T' },
];

const Toolbar = () => {
  const {
    currentTool,
    setCurrentTool,
    strokeOptions,
    setStrokeOptions,
    undo,
    redo,
    scale,
    setScale,
    selectedElement,
  } = useStore();

  const handleZoomIn = () => setScale(Math.min(scale + 0.1, 5));
  const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.1));

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const tool = tools.find(t => t.shortcut.toLowerCase() === e.key.toLowerCase());
      if (tool) {
        e.preventDefault();
        setCurrentTool(tool.id);
      }

      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentTool, undo, redo]);

  return (
    <>
      {/* Main Toolbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex items-center space-x-2 z-10">
        <div className="flex items-center space-x-1">
          {tools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors group relative ${
                currentTool === id ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => setCurrentTool(id)}
              title={label}
            >
              <Icon className="w-5 h-5" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {label}
              </div>
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={strokeOptions.color}
            onChange={(e) => setStrokeOptions({ color: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer"
            title="Color"
          />
          <div className="flex flex-col space-y-1">
            <input
              type="range"
              min="1"
              max="40"
              value={strokeOptions.size}
              onChange={(e) => setStrokeOptions({ size: parseInt(e.target.value) })}
              className="w-24"
              title="Brush Size"
            />
            <div className="text-xs text-gray-500 text-center">
              Size: {strokeOptions.size}px
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={strokeOptions.opacity * 100}
            onChange={(e) => setStrokeOptions({ opacity: parseInt(e.target.value) / 100 })}
            className="w-24"
            title="Opacity"
          />
        </div>

        {currentTool === 'text' && (
          <>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center space-x-1">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-200" />
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        <div className="w-px h-6 bg-gray-200" />

        <div className="flex items-center space-x-1">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={undo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={redo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2 z-10">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors group relative"
          onClick={handleZoomIn}
          title="Zoom In (Ctrl++)"
        >
          <ZoomIn className="w-5 h-5" />
          <div className="tooltip">Zoom In (Ctrl++)</div>
        </button>
        <div className="text-xs text-center font-medium">
          {Math.round(scale * 100)}%
        </div>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors group relative"
          onClick={handleZoomOut}
          title="Zoom Out (Ctrl+-)"
        >
          <ZoomOut className="w-5 h-5" />
          <div className="tooltip">Zoom Out (Ctrl+-)</div>
        </button>
        <div className="w-full h-px bg-gray-200" />
        <button
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors group relative ${
            currentTool === 'move' ? 'bg-blue-50 text-blue-600' : ''
          }`}
          onClick={() => setCurrentTool('move')}
          title="Pan (Space)"
        >
          <Move className="w-5 h-5" />
          <div className="tooltip">Pan (Space)</div>
        </button>
      </div>

      {/* Right Sidebar */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2 z-10">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors group relative"
          title="Save (Ctrl+S)"
        >
          <Save className="w-5 h-5" />
          <div className="tooltip">Save (Ctrl+S)</div>
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors group relative"
          title="Export"
        >
          <Download className="w-5 h-5" />
          <div className="tooltip">Export</div>
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors group relative"
          title="Share"
        >
          <Share2 className="w-5 h-5" />
          <div className="tooltip">Share</div>
        </button>
        <div className="w-full h-px bg-gray-200" />
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors group relative"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
          <div className="tooltip">Settings</div>
        </button>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-gray-600 z-10">
        {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)} Tool
        {selectedElement && ' | Element Selected'}
        {' | '}{Math.round(scale * 100)}% Zoom
      </div>
    </>
  );
};

export default Toolbar;