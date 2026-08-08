import React from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Square,
  Type,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Trash2,
  Layers,
  Plus
} from 'lucide-react';

export default function LayersPanel({
  canvas,
  layers,
  selectedId,
  onSelectObject,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
  onDeleteObject
}) {
  if (!canvas) return null;

  const getObjectIcon = (type) => {
    switch (type) {
      case 'i-text':
      case 'textbox':
      case 'text':
        return <Type className="w-3.5 h-3.5 text-amber-400" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />;
      case 'rect':
        return <Square className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Square className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="w-72 bg-[#262626] border-l border-[#3f3f46] flex flex-col h-full select-none text-xs text-zinc-200">
      {/* Header */}
      <div className="h-9 bg-[#2d2d2d] border-b border-[#3f3f46] px-3 flex items-center justify-between font-bold text-zinc-300">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Capas y Objetos</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">({layers.length})</span>
      </div>

      {/* Layers Tree List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {layers.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 italic text-[11px]">
            No hay objetos en el lienzo. Trama una lona, agrega texto o sube una imagen.
          </div>
        ) : (
          layers.map((layer, index) => {
            const isSelected = selectedId === layer.id;
            const isLocked = layer.locked;
            const isVisible = layer.visible;

            return (
              <div
                key={layer.id}
                onClick={() => onSelectObject(layer.id)}
                className={`group flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-500 text-white font-medium'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {/* Left: Visibility & Lock Toggles */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(layer.id);
                    }}
                    className="text-zinc-500 hover:text-sky-400"
                    title={isVisible ? 'Ocultar (Ctrl+3)' : 'Mostrar (Ctrl+Alt+3)'}
                  >
                    {isVisible ? (
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-zinc-600" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(layer.id);
                    }}
                    className="text-zinc-500 hover:text-amber-400"
                    title={isLocked ? 'Desbloquear (Ctrl+Alt+2)' : 'Bloquear (Ctrl+2)'}
                  >
                    {isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-zinc-600 opacity-40 group-hover:opacity-100" />
                    )}
                  </button>

                  {/* Icon & Label */}
                  <div className="flex items-center space-x-2">
                    {getObjectIcon(layer.type)}
                    <span className="truncate max-w-[110px] text-[11px]" title={layer.name}>
                      {layer.name}
                    </span>
                  </div>
                </div>

                {/* Right: Reorder & Delete */}
                <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayer(index, 'up');
                    }}
                    disabled={index === 0}
                    className="p-0.5 rounded hover:bg-zinc-700 disabled:opacity-20 text-zinc-400"
                    title="Mover capa hacia adelante"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayer(index, 'down');
                    }}
                    disabled={index === layers.length - 1}
                    className="p-0.5 rounded hover:bg-zinc-700 disabled:opacity-20 text-zinc-400"
                    title="Mover capa hacia atrás"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteObject(layer.id);
                    }}
                    className="p-0.5 rounded hover:bg-red-900/50 text-red-400"
                    title="Borrar objeto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="h-8 bg-[#2d2d2d] border-t border-[#3f3f46] px-3 flex items-center justify-between text-[10px] text-zinc-500">
        <span>Atajos: Ctrl+2 (Bloquear) | Ctrl+3 (Ocultar)</span>
      </div>
    </div>
  );
}
