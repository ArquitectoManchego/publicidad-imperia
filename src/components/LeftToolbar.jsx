import React from 'react';
import {
  MousePointer,
  Square,
  Ruler,
  Type,
  Hand,
  Sparkles,
  Upload,
  Save,
  FolderOpen,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function LeftToolbar({
  activeTool,
  setActiveTool,
  onUploadPhoto,
  onSaveProject,
  onOpenProject,
  onOpenBriefModal,
  onOpenShortcutsModal
}) {
  const tools = [
    { id: 'select', name: 'Selección', icon: MousePointer, shortcut: 'V' },
    { id: 'rectangle', name: 'Área de Lona / Rectángulo', icon: Square, shortcut: 'R' },
    { id: 'scale', name: 'Regla de Escala (Calibrar Medida Real)', icon: Ruler, shortcut: 'S' },
    { id: 'text', name: 'Texto', icon: Type, shortcut: 'T' },
    { id: 'pan', name: 'Mano / Panorámica', icon: Hand, shortcut: 'H' },
    { id: 'nanobanana', name: 'Generador Nano Banana IA', icon: Sparkles, shortcut: 'G' }
  ];

  return (
    <aside className="w-14 bg-[#262626] border-r border-[#3f3f46] flex flex-col items-center justify-between py-3 select-none z-20 shadow-md">
      {/* Top Tools List */}
      <div className="flex flex-col space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`relative group w-10 h-10 rounded flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-inner font-bold'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
              title={`${tool.name} (${tool.shortcut})`}
            >
              <Icon className="w-5 h-5" />
              {/* Shortcut badge */}
              <span className="absolute bottom-0.5 right-1 text-[9px] font-mono opacity-60">
                {tool.shortcut}
              </span>
            </button>
          );
        })}

        <div className="w-8 h-px bg-zinc-700 my-2 self-center" />

        {/* Upload Store Photo Button */}
        <label
          className="w-10 h-10 rounded flex items-center justify-center text-emerald-400 hover:bg-zinc-800 cursor-pointer transition-all"
          title="Cargar Foto del Local (Exterior / Interior)"
        >
          <Upload className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUploadPhoto}
          />
        </label>

        {/* Project Brief Button */}
        <button
          onClick={onOpenBriefModal}
          className="w-10 h-10 rounded flex items-center justify-center text-amber-400 hover:bg-zinc-800 transition-all"
          title="Necesidades de Publicidad y Briefing"
        >
          <FileText className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Save / Load / Help */}
      <div className="flex flex-col space-y-2 pt-2 border-t border-zinc-800">
        <button
          onClick={onSaveProject}
          className="w-10 h-10 rounded flex items-center justify-center text-sky-400 hover:bg-zinc-800 transition-all"
          title="Guardar Proyecto Localmente (.json)"
        >
          <Save className="w-5 h-5" />
        </button>

        <label
          className="w-10 h-10 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-800 cursor-pointer transition-all"
          title="Abrir Proyecto Guardado"
        >
          <FolderOpen className="w-5 h-5" />
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={onOpenProject}
          />
        </label>

        <button
          onClick={onOpenShortcutsModal}
          className="w-10 h-10 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
          title="Atajos de Teclado"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
