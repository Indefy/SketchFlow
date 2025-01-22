import { create } from 'zustand';

export const useStore = create((set) => ({
  elements: [],
  currentTool: 'pen',
  strokeOptions: {
    size: 2,
    color: '#000000',
    opacity: 1,
  },
  isDrawing: false,
  scale: 1,
  offset: { x: 0, y: 0 },
  undoStack: [],
  redoStack: [],
  selectedElement: null,

  setCurrentTool: (tool) => set({ currentTool: tool }),
  
  setStrokeOptions: (options) =>
    set((state) => ({
      strokeOptions: { ...state.strokeOptions, ...options },
    })),
  
  addElement: (element) =>
    set((state) => {
      const newElements = [...state.elements, element];
      return {
        elements: newElements,
        undoStack: [...state.undoStack, state.elements],
        redoStack: [],
      };
    }),
  
  updateElement: (elementId, points) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === elementId ? { ...el, points } : el
      ),
    })),
  
  setScale: (scale) => set({ scale }),
  
  setOffset: (offset) => set({ offset }),
  
  setSelectedElement: (id) => set({ selectedElement: id }),
  
  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return state;
      const newElements = state.undoStack[state.undoStack.length - 1];
      return {
        elements: newElements,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [state.elements, ...state.redoStack],
      };
    }),
  
  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return state;
      const newElements = state.redoStack[0];
      return {
        elements: newElements,
        redoStack: state.redoStack.slice(1),
        undoStack: [...state.undoStack, state.elements],
      };
    }),
}));