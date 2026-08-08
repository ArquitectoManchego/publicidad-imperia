import React, { useState } from 'react';
import { Sparkles, Key, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateImagenDesign } from '../utils/googleImagenApi';
import * as fabric from 'fabric';

export default function NanoBananaPanel({ canvas, activeObject, pxPerMeter, apiKey, setApiKey }) {
  const [prompt, setPrompt] = useState('Diseño moderno con colores de marca, texto de oferta llamativo y fondo limpio');
  const [style, setStyle] = useState('fotorrealista');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [generatedImgUrl, setGeneratedImgUrl] = useState(null);

  // Check if active object is a rectangle or image lona
  const isLonaSelected = activeObject && (activeObject.type === 'rect' || activeObject.type === 'image');

  const widthPx = activeObject ? Math.round(activeObject.width * activeObject.scaleX) : 800;
  const heightPx = activeObject ? Math.round(activeObject.height * activeObject.scaleY) : 450;

  const widthMeters = pxPerMeter ? (widthPx / pxPerMeter).toFixed(2) : '3.0';
  const heightMeters = pxPerMeter ? (heightPx / pxPerMeter).toFixed(2) : '1.5';

  const handleGenerate = async () => {
    if (!apiKey) {
      setErrorMsg('Por favor ingresa tu Google API Key en el campo superior.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsGenerating(true);

    try {
      const imgUrl = await generateImagenDesign({
        apiKey,
        prompt,
        widthRatio: widthPx,
        heightRatio: heightPx,
        style,
        lonaRealWidthMeters: widthMeters,
        lonaRealHeightMeters: heightMeters,
      });

      setGeneratedImgUrl(imgUrl);
      setSuccessMsg('¡Imagen generada exitosamente con Nano Banana (Google Imagen API)!');

      // If a rectangle/lona is selected, automatically place the image inside it!
      if (canvas && isLonaSelected) {
        const imgObj = await fabric.Image.fromURL(imgUrl);
        imgObj.scaleToWidth(widthPx);
        imgObj.scaleToHeight(heightPx);
        imgObj.set({
          left: activeObject.left,
          top: activeObject.top,
          angle: activeObject.angle,
          name: `Lona Generada (${widthMeters}m x ${heightMeters}m)`,
        });

        // Replace or add
        canvas.remove(activeObject);
        canvas.add(imgObj);
        canvas.setActiveObject(imgObj);
        canvas.renderAll();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al comunicarse con la API de Google Imagen.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-80 bg-[#262626] border-l border-[#3f3f46] flex flex-col h-full select-none text-xs text-zinc-200">
      {/* Header */}
      <div className="h-9 bg-[#2d2d2d] border-b border-[#3f3f46] px-3 flex items-center justify-between font-bold text-sky-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Generador Nano Banana (Google Imagen API)</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* API Key Configuration */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded p-2.5 space-y-1.5">
          <label className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
            <span className="flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Google API Key:</span>
            </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-sky-400 hover:underline"
            >
              Obtener Clave
            </a>
          </label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem('google_imagen_api_key', e.target.value);
            }}
            className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
          />
        </div>

        {/* Selected Lona Info */}
        <div className="bg-sky-950/40 border border-sky-800/60 rounded p-2.5 space-y-1">
          <span className="text-[11px] font-bold text-sky-300 block">Dimensiones para IA:</span>
          <div className="flex justify-between text-[11px] text-zinc-300 font-mono">
            <span>Escala Real: {widthMeters}m x {heightMeters}m</span>
            <span>Ratio: {(widthPx / heightPx).toFixed(2)}</span>
          </div>
          {!isLonaSelected && (
            <span className="text-[10px] text-amber-300 block pt-0.5">
              * Selecciona un rectángulo en el canvas para insertar automáticamente la imagen generada.
            </span>
          )}
        </div>

        {/* Style Preset */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-400 block">Estilo Visual:</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-zinc-200"
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
            Ideas / Requerimiento del Diseño:
          </label>
          <textarea
            rows="4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe los elementos, oferta, colores y mensaje que debe incluir el diseño..."
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
          disabled={isGenerating}
          className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generando con Nano Banana...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generar Diseño con Google Imagen</span>
            </>
          )}
        </button>

        {/* Image Preview if generated */}
        {generatedImgUrl && (
          <div className="bg-zinc-900 border border-zinc-800 rounded p-2 space-y-2">
            <span className="text-[10px] text-zinc-400 font-bold block">Vista Previa Generada:</span>
            <img src={generatedImgUrl} alt="Diseño Nano Banana" className="w-full rounded border border-zinc-700" />
          </div>
        )}
      </div>
    </div>
  );
}
