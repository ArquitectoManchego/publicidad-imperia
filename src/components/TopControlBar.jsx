import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignStartVertical,
  AlignEndVertical,
  Maximize2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  Type,
  Baseline,
  ArrowUpDown,
  MoveHorizontal,
  MoveVertical
} from 'lucide-react';
import { alignObjects, distributeObjects } from '../utils/alignment';

const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Impact',
  'Georgia',
  'Montserrat',
  'Roboto',
  'Open Sans',
  'Poppins',
  'Playfair Display',
  'Bebas Neue',
  'Outfit',
  'Pacifico',
  'Caveat'
];

export default function TopControlBar({
  canvas,
  activeObject,
  activeTool,
  setActiveTool,
  lockSelection,
  unlockAll,
  hideSelection,
  showAll,
  deleteSelection,
  hasSelection,
  hasHiddenObjects,
  hasLockedObjects
}) {
  // Update properties on active object
  const updateActiveProperty = (prop, value) => {
    if (!canvas || !activeObject) return;
    if (activeObject.type === 'activeSelection') {
      activeObject.getObjects().forEach((obj) => obj.set(prop, value));
    } else {
      activeObject.set(prop, value);
    }
    canvas.renderAll();
  };

  const isText = activeObject && (activeObject.type === 'i-text' || activeObject.type === 'textbox' || activeObject.type === 'text');

  return (
    <header className="h-12 bg-[#2d2d2d] border-b border-[#3f3f46] flex items-center justify-between px-3 text-xs text-zinc-200 select-none z-30 shadow-md">
      {/* Left: Branding & Current Tool Status */}
      <div className="flex items-center space-x-3 pr-4 border-r border-[#3f3f46]">
        <div className="flex items-center space-x-2 font-semibold text-sky-400">
          <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
            Ai
          </div>
          <span className="text-sm tracking-tight text-white font-bold">PUBLICIDAD IMPERIA</span>
        </div>
        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
          {activeTool}
        </span>
      </div>

      {/* Center: Contextual Properties (Character, Paragraph, Fill, Stroke, Alignments) */}
      <div className="flex items-center space-x-4 overflow-x-auto py-1">
        {/* Fill & Stroke */}
        {activeObject && (
          <div className="flex items-center space-x-2 pr-3 border-r border-[#3f3f46]">
            <label className="flex items-center space-x-1 cursor-pointer" title="Color de Relleno">
              <span className="text-[11px] text-zinc-400">Relleno:</span>
              <input
                type="color"
                value={activeObject.fill || '#38bdf8'}
                onChange={(e) => updateActiveProperty('fill', e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border border-zinc-600 bg-transparent p-0"
              />
            </label>

            <label className="flex items-center space-x-1 cursor-pointer" title="Color de Borde">
              <span className="text-[11px] text-zinc-400">Trazo:</span>
              <input
                type="color"
                value={activeObject.stroke || '#0284c7'}
                onChange={(e) => updateActiveProperty('stroke', e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border border-zinc-600 bg-transparent p-0"
              />
            </label>

            <label className="flex items-center space-x-1" title="Grosor de Borde">
              <span className="text-[11px] text-zinc-400">Grosor:</span>
              <input
                type="number"
                min="0"
                max="50"
                value={activeObject.strokeWidth || 1}
                onChange={(e) => updateActiveProperty('strokeWidth', parseFloat(e.target.value) || 0)}
                className="w-12 bg-zinc-900 border border-zinc-700 rounded px-1 text-center text-zinc-200"
              />
            </label>
          </div>
        )}

        {/* Character & Paragraph Options (if text is selected) */}
        {isText && (
          <div className="flex items-center space-x-2 pr-3 border-r border-[#3f3f46]">
            {/* Font Family */}
            <div className="flex items-center space-x-1">
              <Type className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={activeObject.fontFamily || 'Inter'}
                onChange={(e) => updateActiveProperty('fontFamily', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-200 focus:outline-none focus:border-sky-500"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div className="flex items-center space-x-1" title="Tamaño de letra (pt)">
              <Baseline className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="number"
                min="8"
                max="300"
                value={Math.round(activeObject.fontSize || 24)}
                onChange={(e) => updateActiveProperty('fontSize', parseInt(e.target.value) || 12)}
                className="w-14 bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-center text-zinc-200"
              />
            </div>

            {/* Tracking / Letter Spacing (Kerning manual) */}
            <div className="flex items-center space-x-1" title="Kerning / Tracking (Espaciado entre letras)">
              <MoveHorizontal className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px] text-zinc-400">Kerning:</span>
              <input
                type="number"
                min="-200"
                max="1000"
                step="10"
                value={activeObject.charSpacing || 0}
                onChange={(e) => updateActiveProperty('charSpacing', parseInt(e.target.value) || 0)}
                className="w-14 bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-center text-zinc-200"
              />
            </div>

            {/* Line Height / Leading */}
            <div className="flex items-center space-x-1" title="Interlineado (Leading)">
              <MoveVertical className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="number"
                min="0.5"
                max="3"
                step="0.1"
                value={activeObject.lineHeight || 1.16}
                onChange={(e) => updateActiveProperty('lineHeight', parseFloat(e.target.value) || 1)}
                className="w-14 bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-center text-zinc-200"
              />
            </div>

            {/* Paragraph Alignments */}
            <div className="flex items-center space-x-0.5 bg-zinc-900 p-0.5 rounded border border-zinc-800">
              <button
                onClick={() => updateActiveProperty('textAlign', 'left')}
                className={`p-1 rounded hover:bg-zinc-800 ${activeObject.textAlign === 'left' ? 'bg-sky-600 text-white' : 'text-zinc-400'}`}
                title="Alinear texto a la izquierda"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateActiveProperty('textAlign', 'center')}
                className={`p-1 rounded hover:bg-zinc-800 ${activeObject.textAlign === 'center' ? 'bg-sky-600 text-white' : 'text-zinc-400'}`}
                title="Centrar texto"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateActiveProperty('textAlign', 'right')}
                className={`p-1 rounded hover:bg-zinc-800 ${activeObject.textAlign === 'right' ? 'bg-sky-600 text-white' : 'text-zinc-400'}`}
                title="Alinear texto a la derecha"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Alignment Buttons (Adobe Illustrator toolbar) */}
        <div className="flex items-center space-x-1 pr-3 border-r border-[#3f3f46]">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase mr-1">Alinear:</span>
          <button
            onClick={() => alignObjects(canvas, 'left')}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
            title="Alinear a la izquierda"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => alignObjects(canvas, 'centerH')}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
            title="Alinear al centro horizontal"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => alignObjects(canvas, 'right')}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
            title="Alinear a la derecha"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-zinc-700 mx-1" />
          <button
            onClick={() => alignObjects(canvas, 'top')}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
            title="Alinear arriba"
          >
            <AlignStartVertical className="w-4 h-4 rotate-90" />
          </button>
          <button
            onClick={() => alignObjects(canvas, 'middleV')}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
            title="Alinear al centro vertical"
          >
            <AlignJustify className="w-4 h-4 rotate-90" />
          </button>
          <button
            onClick={() => alignObjects(canvas, 'bottom')}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
            title="Alinear a la base (abajo)"
          >
            <AlignEndVertical className="w-4 h-4 rotate-90" />
          </button>

          {/* Distribute Space */}
          <div className="h-4 w-px bg-zinc-700 mx-1" />
          <button
            onClick={() => distributeObjects(canvas, 'horizontal')}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
            title="Distribuir espacio horizontalmente"
          >
            <ArrowUpDown className="w-4 h-4 rotate-90" />
          </button>
          <button
            onClick={() => distributeObjects(canvas, 'vertical')}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
            title="Distribuir espacio verticalmente"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Lock / Hide / Delete Shortcuts Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={lockSelection}
            disabled={!hasSelection}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-amber-400 font-mono text-[11px]"
            title="Bloquear selección (Ctrl+2)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Ctrl+2</span>
          </button>
          <button
            onClick={unlockAll}
            disabled={!hasLockedObjects}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-amber-300 font-mono text-[11px]"
            title="Desbloquear todo (Ctrl+Alt+2)"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Ctrl+Alt+2</span>
          </button>

          <button
            onClick={hideSelection}
            disabled={!hasSelection}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-sky-400 font-mono text-[11px]"
            title="Ocultar selección (Ctrl+3)"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Ctrl+3</span>
          </button>
          <button
            onClick={showAll}
            disabled={!hasHiddenObjects}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-sky-300 font-mono text-[11px]"
            title="Mostrar todo (Ctrl+Alt+3)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ctrl+Alt+3</span>
          </button>

          <button
            onClick={deleteSelection}
            disabled={!hasSelection}
            className="p-1.5 rounded hover:bg-red-900/50 text-red-400 disabled:opacity-30 ml-2"
            title="Eliminar (Supr / Delete)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
