export function drawShape(ctx, element) {
  const { points, strokeOptions, type } = element;
  
  if (points.length < 2) return;
  
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  
  ctx.beginPath();
  ctx.strokeStyle = strokeOptions.color;
  ctx.fillStyle = strokeOptions.color;
  ctx.lineWidth = strokeOptions.size;
  ctx.globalAlpha = strokeOptions.opacity;
  
  switch (type) {
    case 'rectangle': {
      const width = endPoint.x - startPoint.x;
      const height = endPoint.y - startPoint.y;
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      break;
    }
    
    case 'circle': {
      const radius = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    
    case 'arrow': {
      const angle = Math.atan2(
        endPoint.y - startPoint.y,
        endPoint.x - startPoint.x
      );
      const headLength = strokeOptions.size * 5;
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
      
      // Draw arrow head
      ctx.beginPath();
      ctx.moveTo(endPoint.x, endPoint.y);
      ctx.lineTo(
        endPoint.x - headLength * Math.cos(angle - Math.PI / 6),
        endPoint.y - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endPoint.x - headLength * Math.cos(angle + Math.PI / 6),
        endPoint.y - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
}