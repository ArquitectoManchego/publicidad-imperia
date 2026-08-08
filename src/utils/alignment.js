// Illustrator-style alignment and distribution helper functions for Fabric.js

export function alignObjects(canvas, alignmentType) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  // Handle active selection (multiple objects)
  if (activeObject.type === 'activeSelection') {
    const objects = activeObject.getObjects();
    const groupBounds = activeObject.getBoundingRect();

    objects.forEach((obj) => {
      const bound = obj.getBoundingRect();

      switch (alignmentType) {
        case 'left':
          obj.set('left', -groupBounds.width / 2 + bound.width / 2);
          break;
        case 'centerH':
          obj.set('left', 0);
          break;
        case 'right':
          obj.set('left', groupBounds.width / 2 - bound.width / 2);
          break;
        case 'top':
          obj.set('top', -groupBounds.height / 2 + bound.height / 2);
          break;
        case 'middleV':
          obj.set('top', 0);
          break;
        case 'bottom':
          obj.set('top', groupBounds.height / 2 - bound.height / 2);
          break;
        default:
          break;
      }
      obj.setCoords();
    });
  } else {
    // Single object aligned to canvas center/edges
    const bound = activeObject.getBoundingRect();

    switch (alignmentType) {
      case 'left':
        activeObject.set('left', bound.width / 2);
        break;
      case 'centerH':
        canvas.centerObjectH(activeObject);
        break;
      case 'right':
        activeObject.set('left', canvas.width - bound.width / 2);
        break;
      case 'top':
        activeObject.set('top', bound.height / 2);
        break;
      case 'middleV':
        canvas.centerObjectV(activeObject);
        break;
      case 'bottom':
        activeObject.set('top', canvas.height - bound.height / 2);
        break;
      default:
        break;
    }
    activeObject.setCoords();
  }

  canvas.renderAll();
}

export function distributeObjects(canvas, direction) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject || activeObject.type !== 'activeSelection') return;

  const objects = [...activeObject.getObjects()];
  if (objects.length < 3) return; // Need at least 3 objects to distribute space

  if (direction === 'horizontal') {
    objects.sort((a, b) => a.left - b.left);
    const minLeft = objects[0].left;
    const maxLeft = objects[objects.length - 1].left;
    const totalDistance = maxLeft - minLeft;
    const step = totalDistance / (objects.length - 1);

    objects.forEach((obj, idx) => {
      obj.set('left', minLeft + idx * step);
      obj.setCoords();
    });
  } else if (direction === 'vertical') {
    objects.sort((a, b) => a.top - b.top);
    const minTop = objects[0].top;
    const maxTop = objects[objects.length - 1].top;
    const totalDistance = maxTop - minTop;
    const step = totalDistance / (objects.length - 1);

    objects.forEach((obj, idx) => {
      obj.set('top', minTop + idx * step);
      obj.setCoords();
    });
  }

  canvas.renderAll();
}
