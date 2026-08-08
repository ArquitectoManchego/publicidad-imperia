import React, { useState } from 'react';
import { Ruler, Check, X } from 'lucide-react';

export default function ScaleModal({ isOpen, onClose, onConfirmScale, linePxLength }) {
  const [realMeters, setRealMeters] = useState('2.0');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(realMeters);
    if (val > 0 && linePxLength > 0) {
      const pxPerMeter = linePxLength / val;
      onConfirmScale(pxPerMeter, val);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#262626] border border-[#3f3f46] w-full max-w-md rounded-lg shadow-2xl overflow-hidden text-xs text-zinc-200">
        <div className="h-10 bg-[#2d2d2d] border-b border-[#3f3f46] px-4 flex items-center justify-between font-bold text-sky-400">
          <div className="flex items-center space-x-2">
            <Ruler className="w-4 h-4 text-emerald-400" />
            <span className="text-white">Calibrar Medida Real (Escala)</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800 text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-zinc-300">
            Has trazado una línea de referencia de <b>{Math.round(linePxLength)} píxeles</b>. Ingresa la medida real en metros que representa esa línea en la fotografía:
          </p>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400 block font-semibold">
              Longitud Real (Metros):
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="100"
                value={realMeters}
                onChange={(e) => setRealMeters(e.target.value)}
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-sky-300 font-mono font-bold focus:outline-none focus:border-sky-500"
              />
              <span className="absolute right-3 top-2.5 text-zinc-500 font-bold">metros</span>
            </div>
          </div>

          <div className="bg-sky-950/50 border border-sky-800/60 p-2.5 rounded text-[11px] text-sky-200">
            Escala calculada: <b>{linePxLength && realMeters ? (linePxLength / parseFloat(realMeters)).toFixed(1) : 0} px/metro</b>. Todas las lonas que dibujes a continuación mostrarán su tamaño real exacto.
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar Escala</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
