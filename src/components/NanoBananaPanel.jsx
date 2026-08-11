import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, History, RotateCcw } from 'lucide-react';
import { generateImagenDesign } from '../utils/googleImagenApi';
import * as fabric from 'fabric';

export default function NanoBananaPanel({ canvas, activeObject, pxPerMeter }) {
  const [prompt, setPrompt] = useState('Diseño moderno con colores de marca, texto de oferta llamativo y fondo limpio');
  const [style, setStyle] = useState('fotorrealista');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Check if active object is a lona rectangle or polygon
  const isLonaSelected = activeObject && (activeObject.isLona || activeObject.type === 'rect' || activeObject.type === 'polygon');

  // Synchronize prompt and style when active object changes
  useEffect(() => {
    if (activeObject) {
      setPrompt(activeObject.prompt || 'Diseño moderno para lona de fachada comercial');
      setStyle(activeObject.style || 'fotorrealista');
    }
  }, [activeObject]);

  const widthPx = activeObject ? Math.round(activeObject.width * (activeObject.scaleX || 1)) : 800;
  const heightPx = activeObject ? Math.round(activeObject.height * (activeObject.scaleY || 1)) : 450;

  const widthMeters = pxPerMeter ? (widthPx / pxPerMeter).toFixed(2) : '3.0';
  const heightMeters = pxPerMeter ? (heightPx / pxPerMeter).toFixed(2) : '1.5';

  const history = activeObject && activeObject.history ? activeObject.history : [];

  const handleGenerate = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsGenerating(true);

    try {
      const imgUrl = await generateImagenDesign({
        prompt,
        widthRatio: widthPx,
        heightRatio: heightPx,
        style,
        lonaRealWidthMeters: widthMeters,
        lonaRealHeightMeters: heightMeters,
      });

      setSuccessMsg('¡Imagen generada exitosamente con Nano Banana (Google Imagen API)!');

      // Update active lona with new image and save to history
      if (activeObject) {
        activeObject.prompt = prompt;
        activeObject.style = style;
        activeObject.currentImage = imgUrl;

        if (!activeObject.history) activeObject.history = [];
        activeObject.history.unshift({
          id: Date.now(),
          url: imgUrl,
          prompt,
          style,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        await applyImageToLona(imgUrl);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al comunicarse con la API de Google Imagen.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyImageToLona = async (imgUrl) => {
    if (!canvas || !activeObject) return;

    try {
      const imgElement = await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imgUrl;
      });

      // Scale pattern image to fit lona object width and height
      const scaleX = (activeObject.width * (activeObject.scaleX || 1)) / imgElement.width;
      const scaleY = (activeObject.height * (activeObject.scaleY || 1)) / imgElement.height;

      const pattern = new fabric.Pattern({
        source: imgElement,
        repeat: 'no-repeat',
        patternTransform: [scaleX, 0, 0, scaleY, 0, 0],
      });

      activeObject.set({
        fill: pattern,
        opacity: 1,
        stroke: '#38bdf8',
        strokeWidth: 2,
      });

      canvas.renderAll();
    } catch (e) {
      console.error('Failed to apply pattern to lona:', e);
    }
  };

  const handleRestoreHistoryImage = async (item) => {
    if (!activeObject) return;
    activeObject.currentImage = item.url;
    setPrompt(item.prompt);
    setStyle(item.style);
    await applyImageToLona(item.url);
    setSuccessMsg('Imagen anterior restaurada.');
  };

  return (
    <div className="w-80 bg-[#262626] border-l border-[#3f3f46] flex flex-col h-full select-none text-xs text-zinc-200">
      {/* Header */}
      <div className="h-9 bg-[#2d2d2d] border-b border-[#3f3f46] px-3 flex items-center justify-between font-bold text-sky-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Generador Nano Banana</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Selected Lona Info */}
        <div className="bg-sky-950/40 border border-sky-800/60 rounded p-2.5 space-y-1">
          <span className="text-[11px] font-bold text-sky-300 block">Lona Seleccionada:</span>
          <div className="flex justify-between text-[11px] text-zinc-300 font-mono">
            <span>Escala Real: {widthMeters}m x {heightMeters}m</span>
            <span>Px: {widthPx}x{heightPx}</span>
          </div>
          {!isLonaSelected && (
            <span className="text-[10px] text-amber-300 block pt-0.5">
              * Selecciona una lona en el lienzo para asociarle prompt e imagen.
            </span>
          )}
        </div>

        {/* Style Preset */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-400 block">Estilo Visual:</label>
          <select
            value={style}
            onChange={(e) => {
              setStyle(e.target.value);
              if (activeObject) activeObject.style = e.target.value;
            }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-zinc-200 focus:outline-none focus:border-sky-500"
          >
            <option value="fotorrealista">Fotorrealista Comercial Exterior</option>
            <option value="render 3d de alto impacto">Render 3D de Alto Impacto</option>
            <option value="minimalista vectorial elegante">Minimalista Vectorial Elegante</option>
            <option value="publicidad neon iluminada nocturna">Publicidad Neón Nocturna</option>
            <option value="diseño tipografico limpio de marca">Diseño Tipográfico Limpio</option>
          </select>
        </div>

        {/* Prompt Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-400 block">
            Indicaciones del Prompt para esta Lona:
          </label>
          <textarea
            rows="4"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (activeObject) activeObject.prompt = e.target.value;
            }}
            placeholder="Describe los elementos, contenido publicitario, oferta y colores de la lona..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-zinc-200 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 text-[11px] p-2 rounded flex items-start space-x-1.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-[11px] p-2 rounded flex items-start space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !isLonaSelected}
          className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg disabled:opacity-40"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generando con Nano Banana...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generar e Insertar en Lona</span>
            </>
          )}
        </button>

        {/* Image History section for this specific lona */}
        {isLonaSelected && (
          <div className="bg-zinc-900 border border-zinc-800 rounded p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-300 flex items-center space-x-1">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Historial de esta Lona ({history.length})</span>
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-[10px] text-zinc-500 italic text-center py-2">
                No hay imágenes anteriores generadas para esta lona.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => handleRestoreHistoryImage(item)}
                    className={`relative group rounded border overflow-hidden cursor-pointer transition-all ${
                      activeObject.currentImage === item.url
                        ? 'border-sky-500 ring-1 ring-sky-500'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <img src={item.url} alt={`Versión ${idx + 1}`} className="w-full h-16 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <span className="text-[9px] text-white font-bold flex items-center space-x-1 bg-sky-600 px-1.5 py-0.5 rounded">
                        <RotateCcw className="w-3 h-3" />
                        <span>Usar</span>
                      </span>
                    </div>
                    <span className="absolute bottom-0 left-0 right-0 bg-zinc-950/80 text-[8px] text-zinc-400 px-1 text-center truncate">
                      {item.timestamp || `v${history.length - idx}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
