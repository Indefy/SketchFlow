import { render, screen, fireEvent } from '@testing-library/react';

import Canvas from '../Canvas';

jest.mock('../../store/useStore', () => ({
  useStore: () => ({
    elements: [],
    currentTool: 'pen',
    strokeOptions: {
      size: 2,
      color: '#000000',
      opacity: 1,
    },
    scale: 1,
    offset: { x: 0, y: 0 },
    addElement: jest.fn(),
    updateElement: jest.fn(),
    setOffset: jest.fn(),
    selectedElement: null,
    setSelectedElement: jest.fn(),
  }),
}));

describe('Canvas', () => {
  it('renders canvas element', () => {
    render(<Canvas />);
    const canvas = screen.getByRole('presentation');
    expect(canvas).toBeInTheDocument();
  });

  // Add more tests as needed
});