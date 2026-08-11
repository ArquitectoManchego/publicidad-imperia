import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { ZoomIn, ZoomOut, Maximize, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { createLonaPolygon, applyPolygonCornerControls } from '../utils/polygonControls';

export default function CanvasWorkspace({
  activeTool,
  setActiveTool,
  onCanvasInit,
  pxPerMeter,
  onFinishScaleLine,
  bgPhotoUrl,
  onOpenNanoBananaPanel
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Drawing state
  const isDrawingRef = useRef(false);
  const startPointRef = useRef({ x: 0, y: 0 });
  const activeDrawObjRef = useRef(null);

  // 2-Point Scale Tool State
  const scalePointARef = useRef(null);
  const scalePointBRef = useRef(null);
  const scaleMarkerARef = useRef(null);
  const scaleMarkerBRef = useRef(null);
  const scaleLineRef = useRef(null);

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1200,
      height: 700,
      backgroundColor: '#18181b',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = fabricCanvas;
    if (onCanvasInit) onCanvasInit(fabricCanvas);

    if (!bgPhotoUrl) {
      loadDefaultStorePlaceholder(fabricCanvas);
    }

    const handleResize = () => {
      if (containerRef.current && fabricCanvas) {
        const w = containerRef.current.clientWidth - 40;
        const h = containerRef.current.clientHeight - 60;
        if (w > 200 && h > 200) {
          fabricCanvas.setDimensions({ width: Math.max(w, 800), height: Math.max(h, 500) });
          fabricCanvas.renderAll();
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      fabricCanvas.dispose();
    };
  }, []);

  // Handle Photo Background updates
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !bgPhotoUrl) return;

    fabric.Image.fromURL(bgPhotoUrl).then((img) => {
      const scale = Math.min((canvas.width * 0.9) / img.width, (canvas.height * 0.9) / img.height);
      img.scale(scale);
      img.set({
        left: (canvas.width - img.width * scale) / 2,
        top: (canvas.height - img.height * scale) / 2,
        selectable: true,
        name: 'Foto del Local (Fondo)',
        isBackground: true,
      });

      const existingBg = canvas.getObjects().find((o) => o.isBackground);
      if (existingBg) canvas.remove(existingBg);

      canvas.add(img);
      canvas.sendObjectToBack(img);
      canvas.renderAll();
    });
  }, [bgPhotoUrl]);

  // Load sample store facade placeholder
  const loadDefaultStorePlaceholder = (canvas) => {
    const storeBg = new fabric.Rect({
      left: 150,
      top: 80,
      width: 900,
      height: 520,
      fill: '#27272a',
      stroke: '#3f3f46',
      strokeWidth: 4,
      rx: 8,
      ry: 8,
      selectable: false,
      isBackground: true,
      name: 'Fachada Comercial de Ejemplo',
    });

    const storeDoor = new fabric.Rect({
      left: 500,
      top: 360,
      width: 200,
      height: 240,
      fill: '#09090b',
      stroke: '#52525b',
      strokeWidth: 2,
      selectable: false,
      isBackground: true,
      name: 'Puerta Principal (Referencia)',
    });

    const windowLeft = new fabric.Rect({
      left: 200,
      top: 360,
      width: 250,
      height: 180,
      fill: '#18181b',
      stroke: '#0284c7',
      strokeWidth: 2,
      selectable: false,
      isBackground: true,
      name: 'Ventanal Izquierdo',
    });

    const windowRight = new fabric.Rect({
      left: 750,
      top: 360,
      width: 250,
      height: 180,
      fill: '#18181b',
      stroke: '#0284c7',
      strokeWidth: 2,
      selectable: false,
      isBackground: true,
      name: 'Ventanal Derecho',
    });

    // Add a default perspective lona polygon as demo!
    const demoLona = createLonaPolygon({
      left: 200,
      top: 130,
      width: 800,
      height: 180,
      name: 'Área Sugerida para Lona Principal (Deformable)',
    });

    canvas.add(storeBg, storeDoor, windowLeft, windowRight, demoLona);
    canvas.renderAll();
  };

  // Drawing tool handler (Rectangle & 2-Point Scale)
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (activeTool === 'select') {
      canvas.defaultCursor = 'default';
      canvas.selection = true;
    } else {
      canvas.defaultCursor = 'crosshair';
      canvas.selection = false;
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    const clearScaleMarkers = () => {
      if (scaleMarkerARef.current) canvas.remove(scaleMarkerARef.current);
      if (scaleMarkerBRef.current) canvas.remove(scaleMarkerBRef.current);
      if (scaleLineRef.current) canvas.remove(scaleLineRef.current);
      scalePointARef.current = null;
      scalePointBRef.current = null;
      scaleMarkerARef.current = null;
      scaleMarkerBRef.current = null;
      scaleLineRef.current = null;
      canvas.renderAll();
    };

    const handleMouseDown = (opt) => {
      if (activeTool === 'select' || activeTool === 'pan') return;
      const pointer = canvas.getScenePoint(opt.e);

      // Tool 1: Scale Calibration by 2 Clicks (Point A & Point B)
      if (activeTool === 'scale') {
        if (!scalePointARef.current) {
          // 1st Click -> Place Point A Marker
          scalePointARef.current = pointer;
          const circleA = new fabric.Circle({
            left: pointer.x - 6,
            top: pointer.y - 6,
            radius: 6,
            fill: '#10b981',
            stroke: '#ffffff',
            strokeWidth: 2,
            selectable: false,
          });
          scaleMarkerARef.current = circleA;
          canvas.add(circleA);
          canvas.renderAll();
        } else {
          // 2nd Click -> Place Point B Marker & Line, compute distance
          scalePointBRef.current = pointer;
          const circleB = new fabric.Circle({
            left: pointer.x - 6,
            top: pointer.y - 6,
            radius: 6,
            fill: '#10b981',
            stroke: '#ffffff',
            strokeWidth: 2,
            selectable: false,
          });
          scaleMarkerBRef.current = circleB;

          const line = new fabric.Line(
            [
              scalePointARef.current.x,
              scalePointARef.current.y,
              pointer.x,
              pointer.y,
            ],
            {
              stroke: '#10b981',
              strokeWidth: 3,
              strokeDashArray: [4, 4],
              selectable: false,
            }
          );
          scaleLineRef.current = line;
          canvas.add(circleB, line);
          canvas.renderAll();

          const dx = scalePointBRef.current.x - scalePointARef.current.x;
          const dy = scalePointBRef.current.y - scalePointARef.current.y;
          const pxLength = Math.hypot(dx, dy);

          if (pxLength > 5) {
            onFinishScaleLine(pxLength);
          }

          // Reset scale tool after modal confirmation
          setTimeout(() => {
            clearScaleMarkers();
            setActiveTool('select');
          }, 300);
        }
        return;
      }

      // Tool 2: Rectangle / Lona Tool
      isDrawingRef.current = true;
      startPointRef.current = { x: pointer.x, y: pointer.y };

      if (activeTool === 'rectangle') {
        const rect = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: '#0284c7',
          opacity: 0.85,
          stroke: '#38bdf8',
          strokeWidth: 3,
          rx: 4,
          ry: 4,
          name: `Lona ${canvas.getObjects().filter((o) => o.isLona || (o.type === 'rect' && !o.isBackground)).length + 1}`,
        });
        activeDrawObjRef.current = rect;
        canvas.add(rect);
      } else if (activeTool === 'text') {
        const text = new fabric.Textbox('TU TEXTO PUBLICITARIO AQUÍ', {
          left: pointer.x,
          top: pointer.y,
          width: 300,
          fontSize: 28,
          fontFamily: 'Inter',
          fill: '#ffffff',
          fontWeight: 'bold',
          name: 'Texto Publicitario',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        setActiveTool('select');
        isDrawingRef.current = false;
      }
    };

    const handleMouseMove = (opt) => {
      if (!isDrawingRef.current || !activeDrawObjRef.current) return;
      const pointer = canvas.getScenePoint(opt.e);
      const startX = startPointRef.current.x;
      const startY = startPointRef.current.y;

      if (activeTool === 'rectangle') {
        const width = Math.abs(pointer.x - startX);
        const height = Math.abs(pointer.y - startY);
        activeDrawObjRef.current.set({
          left: Math.min(startX, pointer.x),
          top: Math.min(startY, pointer.y),
          width: width,
          height: height,
        });
      }
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;

      if (activeTool === 'rectangle' && activeDrawObjRef.current) {
        const rect = activeDrawObjRef.current;
        if (rect.width < 10 || rect.height < 10) {
          canvas.remove(rect);
        } else {
          // Convert drawn rectangle into a 4-point perspective Polygon!
          const lonaCount = canvas.getObjects().filter((o) => o.isLona).length + 1;
          const lonaPolygon = createLonaPolygon({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            name: `Lona Publicitaria ${lonaCount}`,
          });

          canvas.remove(rect);
          canvas.add(lonaPolygon);
          canvas.setActiveObject(lonaPolygon);
        }
      }

      activeDrawObjRef.current = null;
      setActiveTool('select');
      canvas.renderAll();
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [activeTool]);

  // Zoom handlers
  const handleZoom = (factor) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    let newZoom = canvas.getZoom() * factor;
    newZoom = Math.max(0.2, Math.min(4, newZoom));
    canvas.setZoom(newZoom);
    setZoomLevel(newZoom);
    canvas.renderAll();
  };

  const resetZoom = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.absolutePan({ x: 0, y: 0 });
    setZoomLevel(1);
    canvas.renderAll();
  };

  return (
    <div ref={containerRef} className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex items-center justify-center p-4">
      {/* Canvas element */}
      <canvas ref={canvasRef} />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-4 left-6 bg-[#262626]/90 backdrop-blur border border-[#3f3f46] rounded-lg p-1.5 flex items-center space-x-2 text-xs text-zinc-300 shadow-xl z-10">
        <button
          onClick={() => handleZoom(1.2)}
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300"
          title="Acercar (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="font-mono text-[11px] w-12 text-center text-sky-400 font-bold">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => handleZoom(0.8)}
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300"
          title="Alejar (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-zinc-700 mx-1" />
        <button
          onClick={resetZoom}
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300"
          title="Restablecer vista 100%"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Tool Instructions / Status */}
      <div className="absolute top-4 left-6 flex items-center space-x-2 z-10">
        <div className="bg-[#262626]/90 backdrop-blur border border-[#3f3f46] rounded-lg px-3 py-1.5 flex items-center space-x-2 text-xs shadow-xl">
          <Ruler className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-300 font-medium">Escala:</span>
          {pxPerMeter ? (
            <span className="font-mono text-emerald-400 font-bold">
              1m = {Math.round(pxPerMeter)}px
            </span>
          ) : (
            <span className="text-amber-400 font-medium italic text-[11px]">
              No calibrada (Selecciona 'S' e indica 2 puntos)
            </span>
          )}
        </div>

        {activeTool === 'scale' && (
          <div className="bg-emerald-950/90 border border-emerald-700 text-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold animate-pulse flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Haz clic en Punto A y luego en Punto B sobre la imagen para medir.</span>
          </div>
        )}

        <button
          onClick={onOpenNanoBananaPanel}
          className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white rounded-lg px-3 py-1.5 flex items-center space-x-1.5 text-xs font-bold shadow-xl transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generar Lona con Nano Banana</span>
        </button>
      </div>
    </div>
  );
}
