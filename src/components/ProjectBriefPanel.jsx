import React from 'react';
import { X, FileText, Lightbulb, Tag, Store, Plus, Trash2 } from 'lucide-react';

export default function ProjectBriefPanel({
  isOpen,
  onClose,
  briefData,
  setBriefData,
  storePhotos,
  onAddStorePhoto,
  onRemoveStorePhoto,
  onSelectPhotoAsBackground
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#262626] border border-[#3f3f46] w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-xs text-zinc-200">
        {/* Header */}
        <div className="h-12 bg-[#2d2d2d] border-b border-[#3f3f46] px-4 flex items-center justify-between font-bold text-sky-400">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-white">Necesidades de Publicidad y Galería de Fotos del Local</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Store Photos Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center space-x-2 font-bold text-sm text-zinc-200">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Fotografías del Local (Fachada Exterior e Interior)</span>
              </div>
              <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer transition-all">
                <Plus className="w-4 h-4" />
                <span>Agregar Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onAddStorePhoto}
                />
              </label>
            </div>

            {storePhotos.length === 0 ? (
              <div className="bg-zinc-900/60 border border-dashed border-zinc-700 rounded-lg p-6 text-center text-zinc-500 italic">
                No has agregado fotografías de tu local. Haz clic en "Agregar Foto" para subir fotos del exterior o interior.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {storePhotos.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    className="relative group bg-zinc-900 rounded border border-zinc-800 overflow-hidden shadow-md"
                  >
                    <img src={photo.url} alt={`Local ${idx + 1}`} className="w-full h-32 object-cover" />
                    <div className="p-2 flex items-center justify-between bg-zinc-950">
                      <span className="truncate text-[10px] text-zinc-400">{photo.name || `Foto ${idx + 1}`}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            onSelectPhotoAsBackground(photo.url);
                            onClose();
                          }}
                          className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold"
                          title="Cargar esta foto como lienzo de trabajo"
                        >
                          Usar en Lienzo
                        </button>
                        <button
                          onClick={() => onRemoveStorePhoto(idx)}
                          className="p-1 rounded hover:bg-red-900/60 text-red-400"
                          title="Borrar foto de la galería"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Advertising Brief Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Needs */}
            <div className="space-y-1.5">
              <label className="flex items-center space-x-1.5 font-bold text-zinc-300">
                <Tag className="w-4 h-4 text-sky-400" />
                <span>Necesidades de Publicidad del Local:</span>
              </label>
              <textarea
                rows="4"
                value={briefData.needs || ''}
                onChange={(e) => setBriefData({ ...briefData, needs: e.target.value })}
                placeholder="Ejemplo: Captar clientes desde la avenida principal, destacar horarios, promocionar servicios de imprenta..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-zinc-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Contents */}
            <div className="space-y-1.5">
              <label className="flex items-center space-x-1.5 font-bold text-zinc-300">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Contenido Principal que debe llevar la Lona:</span>
              </label>
              <textarea
                rows="4"
                value={briefData.content || ''}
                onChange={(e) => setBriefData({ ...briefData, content: e.target.value })}
                placeholder="Ejemplo: Logo de la empresa, teléfono de contacto, redes sociales, texto: 'GRAN APERTURA 20% DESCUENTO'..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-zinc-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Image Ideas */}
            <div className="col-span-2 space-y-1.5">
              <label className="flex items-center space-x-1.5 font-bold text-zinc-300">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                <span>Ideas Visuales y Estilo de Imagen:</span>
              </label>
              <textarea
                rows="3"
                value={briefData.ideas || ''}
                onChange={(e) => setBriefData({ ...briefData, ideas: e.target.value })}
                placeholder="Ejemplo: Fondo oscuro elegante con letras luminosas en amarillo neón, imágenes 3D de productos impresos..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-zinc-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 bg-[#2d2d2d] border-t border-[#3f3f46] px-4 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold"
          >
            Guardar Briefing y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
