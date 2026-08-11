import * as fabric from 'fabric';

/**
 * Creates custom corner controls for a 4-point Polygon in Fabric.js
 * allowing each corner (p0, p1, p2, p3) to be moved independently for perspective distortion.
 */

// Helper to action vertex movement
function polygonPositionHandler(dim, finalMatrix, fabricObject, currentControl) {
  const x = fabricObject.points[currentControl.pointIndex].x - fabricObject.pathOffset.x;
  const y = fabricObject.points[currentControl.pointIndex].y - fabricObject.pathOffset.y;
  return fabric.util.transformPoint(
    { x, y },
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix()
    )
  );
}

function anchorWrapper(targetIndex, actionHandler) {
  return function (eventData, transform, x, y) {
    const fabricObject = transform.target;
    const absolutePoint = fabric.util.transformPoint(
      { x, y },
      fabric.util.invertTransformMatrix(fabricObject.calcTransformMatrix())
    );

    const pt = {
      x: absolutePoint.x + fabricObject.pathOffset.x,
      y: absolutePoint.y + fabricObject.pathOffset.y,
    };

    fabricObject.points[targetIndex] = pt;

    // Recalculate dimensions & offsets
    const minX = Math.min(...fabricObject.points.map((p) => p.x));
    const maxX = Math.max(...fabricObject.points.map((p) => p.x));
    const minY = Math.min(...fabricObject.points.map((p) => p.y));
    const maxY = Math.max(...fabricObject.points.map((p) => p.y));

    fabricObject.width = maxX - minX;
    fabricObject.height = maxY - minY;
    fabricObject.pathOffset = {
      x: minX + fabricObject.width / 2,
      y: minY + fabricObject.height / 2,
    };

    fabricObject.setCoords();
    return true;
  };
}

export function applyPolygonCornerControls(polygon) {
  if (!polygon || !polygon.points || polygon.points.length !== 4) return;

  const controls = {};
  for (let i = 0; i < 4; i++) {
    controls[`p${i}`] = new fabric.Control({
      x: 0,
      y: 0,
      pointIndex: i,
      positionHandler: polygonPositionHandler,
      actionHandler: anchorWrapper(i),
      actionName: 'modifyPolygon',
      cursorStyle: 'crosshair',
    });
  }

  polygon.controls = controls;
  polygon.hasBorders = false;
  polygon.objectCaching = false;
}

export function createLonaPolygon({ left, top, width, height, name }) {
  const points = [
    { x: 0, y: 0 },          // Top-Left (p0)
    { x: width, y: 0 },      // Top-Right (p1)
    { x: width, y: height }, // Bottom-Right (p2)
    { x: 0, y: height },     // Bottom-Left (p3)
  ];

  const polygon = new fabric.Polygon(points, {
    left,
    top,
    fill: '#0284c7',
    opacity: 0.85,
    stroke: '#38bdf8',
    strokeWidth: 3,
    strokeDashArray: [4, 4],
    name: name || 'Área de Lona Perspectiva',
    isLona: true,
    prompt: 'Diseño moderno para lona de fachada comercial',
    style: 'fotorrealista',
    history: [], // Image generation history array
    currentImage: null,
  });

  applyPolygonCornerControls(polygon);
  return polygon;
}
