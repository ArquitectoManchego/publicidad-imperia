import React from 'react';
import { Sliders, RotateCw, Ruler, Box, Layers as LayersIcon } from 'lucide-react';

export default function PropertiesPanel({ canvas, activeObject, pxPerMeter }) {
  if (!canvas || !activeObject) {
    return (
      <div className="w-72 bg-[#262626] border-l border-[#3f3f46] p-4 text-xs text-zinc-500 italic select-none">
        No hay ningún objeto seleccionado. Haz clic sobre un elemento o dibuja una lona para ver sus propiedades de transformación y escala real.
      </div>
    );
  }

  const bound = activeObject.getBoundingRect();
  const widthPx = Math.round(activeObject.width * activeObject.scaleX);
  const heightPx = Math.round(activeObject.height * activeObject.scaleY);
  const angle = Math.round(activeObject.angle || 0);

  // Real world dimensions calculation
  const widthMeters = pxPerMeter ? (widthPx / pxPerMeter).toFixed(2) : null;
  const heightMeters = pxPerMeter ? (heightPx / pxPerMeter).toFixed(2) : null;
  const areaMeters = widthMeters && heightMeters ? (parseFloat(widthMeters) * parseFloat(heightMeters)).toFixed(2) : null;

  const updateProp = (prop, val) => {
    activeObject.set(prop, val);
    activeObject.setCoords();
    canvas.renderAll();
  };

  return (
    <div className="w-72 bg-[#262626] border-l border-[#3f3f46] flex flex-col h-full select-none text-xs text-zinc-200">
      {/* Header */}
      <div className="h-9 bg-[#2d2d2d] border-b border-[#3f3f46] px-3 flex items-center justify-between font-bold text-zinc-300">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span>Propiedades y Transformación</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Real World Dimensions Box */}
        <div className="bg-sky-950/40 border border-sky-800/60 rounded p-3 space-y-2">
          <div className="flex items-center justify-between text-sky-400 font-bold">
            <div className="flex items-center space-x-1.5">
              <Ruler className="w-4 h-4" />
              <span>Medidas Reales de Lona</span>
            </div>
            {pxPerMeter ? (
              <span className="text-[10px] bg-sky-900 text-sky-200 px-1.5 py-0.5 rounded font-mono">
                Calibrado
              </span>
            ) : (
              <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                Sin calibrar
              </span>
            )}
          </div>

          {pxPerMeter ? (
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-zinc-200">
              <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">Ancho Real</span>
                <span className="text-sm font-bold text-sky-300">{widthMeters} m</span>
              </div>
              <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">Alto Real</span>
                <span className="text-sm font-bold text-sky-300">{heightMeters} m</span>
              </div>
              <div className="col-span-2 bg-zinc-900/80 p-2 rounded border border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Superficie Total:</span>
                <span className="text-xs font-bold text-emerald-400">{areaMeters} m²</span>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-amber-200/80 pt-1">
              Usa la herramienta <b>Regla (S)</b> en la barra izquierda para medir una ventana o puerta de referencia y activar la acotación en metros.
            </div>
          )}
        </div>

        {/* Transform (X, Y, W, H, Angle) */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded p-3 space-y-3">
          <div className="flex items-center space-x-2 text-zinc-400 font-semibold border-b border-zinc-800 pb-1.5">
            <Box className="w-4 h-4 text-amber-400" />
            <span>Transformación Geométricas (Px)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <span className="text-[10px] text-zinc-500 block">Posición X</span>
              <input
                type="number"
                value={Math.round(activeObject.left)}
                onChange={(e) => updateProp('left', parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-zinc-200"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">Posición Y</span>
              <input
                type="number"
                value={Math.round(activeObject.top)}
                onChange={(e) => updateProp('top', parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-zinc-200"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">Ancho (W)</span>
              <input
                type="number"
                value={widthPx}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 10;
                  activeObject.scaleToWidth(val);
                  activeObject.setCoords();
                  canvas.renderAll();
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-zinc-200"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">Alto (H)</span>
              <input
                type="number"
                value={heightPx}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 10;
                  activeObject.scaleToHeight(val);
                  activeObject.setCoords();
                  canvas.renderAll();
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-zinc-200"
              />
            </div>
          </div>

          {/* Angle Rotation */}
          <div>
            <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
              <span className="flex items-center space-x-1">
                <RotateCw className="w-3 h-3 text-sky-400" />
                <span>Rotación (Grados)</span>
              </span>
              <span className="font-mono">{angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => updateProp('angle', parseInt(e.target.value) || 0)}
              className="w-full accent-sky-500 bg-zinc-800"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
              <span>Opacidad</span>
              <span className="font-mono">{Math.round((activeObject.opacity || 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={activeObject.opacity ?? 1}
              onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
              className="w-full accent-sky-500 bg-zinc-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
