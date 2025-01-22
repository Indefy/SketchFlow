import { useRef, useEffect, useState } from 'react';
import { getStroke } from 'perfect-freehand';

import { useStore } from '../store/useStore';
import { drawShape } from '../utils/shapes';

const Canvas = () => {
  const canvasRef = useRef(null);
  const textInputRef = useRef(null);
  const {
    elements,
    currentTool,
    strokeOptions,
    scale,
    offset,
    addElement,
    updateElement,
    setOffset,
    selectedElement,
    setSelectedElement,
  } = useStore();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [lastPoint, setLastPoint] = useState(null);
  const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, value: '' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Clear and redraw all elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(offset.x, offset.y);

    elements.forEach(element => {
      if (element.type === 'pen') {
        const stroke = getStroke(element.points, {
          size: element.strokeOptions.size,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        });

        ctx.beginPath();
        ctx.fillStyle = element.strokeOptions.color;
        ctx.globalAlpha = element.strokeOptions.opacity;

        if (stroke.length > 0) {
          ctx.moveTo(stroke[0][0], stroke[0][1]);
          for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i][0], stroke[i][1]);
          }
        }
        
        ctx.fill();
      } else if (['rectangle', 'circle', 'arrow'].includes(element.type)) {
        drawShape(ctx, element);
      } else if (element.type === 'text') {
        ctx.font = `${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
        ctx.fillStyle = element.strokeOptions.color;
        ctx.textAlign = element.textAlign || 'left';
        ctx.fillText(element.text || '', element.points[0].x, element.points[0].y);
      }

      // Draw selection outline
      if (element.id === selectedElement) {
        const bounds = getElementBounds(element);
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 1 / scale;
        ctx.setLineDash([5 / scale, 5 / scale]);
        ctx.strokeRect(
          bounds.x - 5 / scale,
          bounds.y - 5 / scale,
          bounds.width + 10 / scale,
          bounds.height + 10 / scale
        );
        ctx.setLineDash([]);
      }
    });

    ctx.restore();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [elements, scale, offset, selectedElement]);

  const getCanvasPoint = e => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale - offset.x,
      y: (e.clientY - rect.top) / scale - offset.y,
      pressure: e.pressure,
    };
  };

  const startDrawing = e => {
    if (e.button === 2) return; // Ignore right click

    if (currentTool === 'move') {
      setLastPoint(getCanvasPoint(e));
      return;
    }

    if (currentTool === 'select') {
      const point = getCanvasPoint(e);
      const clickedElement = getElementAtPoint(point);
      setSelectedElement(clickedElement?.id || null);
      return;
    }

    if (currentTool === 'text') {
      const point = getCanvasPoint(e);
      setTextInput({
        visible: true,
        x: point.x,
        y: point.y,
        value: '',
      });
      return;
    }

    const point = getCanvasPoint(e);
    const element = {
      id: Date.now().toString(),
      type: currentTool,
      points: [point],
      strokeOptions: { ...strokeOptions },
      timestamp: Date.now(),
    };

    setCurrentElement(element.id);
    addElement(element);
    setIsDrawing(true);
  };

  const draw = e => {
    if (currentTool === 'move' && lastPoint) {
      const currentPoint = getCanvasPoint(e);
      const dx = currentPoint.x - lastPoint.x;
      const dy = currentPoint.y - lastPoint.y;
      setOffset({ x: offset.x + dx * scale, y: offset.y + dy * scale });
      setLastPoint(currentPoint);
      return;
    }

    if (!isDrawing || !currentElement) return;

    const point = getCanvasPoint(e);
    updateElement(currentElement, [
      ...elements.find(el => el.id === currentElement)?.points || [],
      point,
    ]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setCurrentElement(null);
    setLastPoint(null);
  };

  const handleContextMenu = e => {
    e.preventDefault();
    // Implement context menu
  };

  const handleTextInput = e => {
    setTextInput(prev => ({ ...prev, value: e.target.value }));
  };

  const handleTextBlur = () => {
    if (textInput.value.trim()) {
      const element = {
        id: Date.now().toString(),
        type: 'text',
        points: [{ x: textInput.x, y: textInput.y }],
        text: textInput.value,
        strokeOptions: { ...strokeOptions },
        fontSize: 16,
        fontFamily: 'Arial',
        textAlign: 'left',
        timestamp: Date.now(),
      };
      addElement(element);
    }
    setTextInput({ visible: false, x: 0, y: 0, value: '' });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          cursor: currentTool === 'pen' ? 'crosshair' : 
                 currentTool === 'move' ? 'grab' : 
                 currentTool === 'text' ? 'text' :
                 currentTool === 'select' ? 'default' :
                 'crosshair'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onContextMenu={handleContextMenu}
      />
      {textInput.visible && (
        <input
          ref={textInputRef}
          type="text"
          className="absolute bg-transparent border-none outline-none z-20"
          style={{
            left: `${(textInput.x + offset.x) * scale}px`,
            top: `${(textInput.y + offset.y) * scale}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            color: strokeOptions.color,
            opacity: strokeOptions.opacity,
            fontSize: '16px',
          }}
          value={textInput.value}
          onChange={handleTextInput}
          onBlur={handleTextBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.target.blur();
            } else if (e.key === 'Escape') {
              setTextInput({ visible: false, x: 0, y: 0, value: '' });
            }
          }}
          autoFocus
        />
      )}
    </>
  );
};

export default Canvas;