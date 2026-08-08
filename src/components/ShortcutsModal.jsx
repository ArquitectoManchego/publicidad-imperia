import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + 2', desc: 'Bloquear objeto(s) seleccionado(s)' },
    { key: 'Ctrl + Alt + 2', desc: 'Desbloquear todos los objetos' },
    { key: 'Ctrl + 3', desc: 'Ocultar objeto(s) seleccionado(s)' },
    { key: 'Ctrl + Alt + 3', desc: 'Mostrar todos los objetos ocultos' },
    { key: 'V', desc: 'Herramienta de Selección' },
    { key: 'R', desc: 'Herramienta de Área de Lona (Rectángulo)' },
    { key: 'S', desc: 'Herramienta de Regla / Escala Real' },
    { key: 'T', desc: 'Herramienta de Texto' },
    { key: 'H', desc: 'Herramienta Mano / Mover lienzo' },
    { key: 'G', desc: 'Abrir Generador Nano Banana IA' },
    { key: 'Supr / Delete', desc: 'Eliminar objetos seleccionados' },
    { key: 'Flechas', desc: 'Desplazar objeto 1px (o 10px con Shift)' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#262626] border border-[#3f3f46] w-full max-w-lg rounded-lg shadow-2xl overflow-hidden text-xs text-zinc-200">
        <div className="h-10 bg-[#2d2d2d] border-b border-[#3f3f46] px-4 flex items-center justify-between font-bold text-sky-400">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="text-white">Atajos de Teclado (Estilo Adobe Illustrator)</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800 text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800"
            >
              <span className="text-zinc-300 text-[11px]">{item.desc}</span>
              <kbd className="bg-zinc-950 text-sky-400 px-2 py-1 rounded border border-zinc-700 font-mono text-[11px] font-bold">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="h-10 bg-[#2d2d2d] border-t border-[#3f3f46] px-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
