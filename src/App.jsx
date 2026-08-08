import React, { useState, useEffect, useCallback } from 'react';
import TopControlBar from './components/TopControlBar';
import LeftToolbar from './components/LeftToolbar';
import CanvasWorkspace from './components/CanvasWorkspace';
import LayersPanel from './components/LayersPanel';
import PropertiesPanel from './components/PropertiesPanel';
import NanoBananaPanel from './components/NanoBananaPanel';
import ProjectBriefPanel from './components/ProjectBriefPanel';
import ScaleModal from './components/ScaleModal';
import ShortcutsModal from './components/ShortcutsModal';

export default function App() {
  const [canvas, setCanvas] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [activeObject, setActiveObject] = useState(null);
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);

  // Calibration & Scale
  const [pxPerMeter, setPxPerMeter] = useState(null);
  const [scaleModalOpen, setScaleModalOpen] = useState(false);
  const [scaleLinePxLength, setScaleLinePxLength] = useState(0);

  // Right sidebar tab
  const [rightTab, setRightTab] = useState('properties'); // 'properties' | 'layers' | 'nanobanana'

  // Modals & Panels
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Background Photo & Store Gallery
  const [bgPhotoUrl, setBgPhotoUrl] = useState(null);
  const [storePhotos, setStorePhotos] = useState([]);

  // Briefing Data
  const [briefData, setBriefData] = useState({
    needs: '',
    content: '',
    ideas: '',
  });

  // Google Imagen API Key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('google_imagen_api_key') || '');

  // Refresh Layers list from Canvas
  const refreshLayers = useCallback(() => {
    if (!canvas) return;
    const objects = canvas.getObjects().filter((obj) => !obj.isBackground);

    const layerItems = objects.map((obj, idx) => ({
      id: obj.id || `layer_${idx}_${Date.now()}`,
      name: obj.name || `${obj.type === 'rect' ? 'Lona' : obj.type === 'textbox' ? 'Texto' : 'Objeto'} ${idx + 1}`,
      type: obj.type,
      visible: obj.visible !== false,
      locked: !!obj.lockMovementX,
      fabricObj: obj,
    }));

    // Ensure objects have IDs
    layerItems.forEach((item) => {
      if (!item.fabricObj.id) item.fabricObj.id = item.id;
    });

    setLayers(layerItems.reverse()); // Top object first
  }, [canvas]);

  // Handle Canvas Initialization
  const handleCanvasInit = (fabricCanvas) => {
    setCanvas(fabricCanvas);

    fabricCanvas.on('selection:created', (e) => {
      setActiveObject(e.selected[0] || fabricCanvas.getActiveObject());
    });
    fabricCanvas.on('selection:updated', (e) => {
      setActiveObject(e.selected[0] || fabricCanvas.getActiveObject());
    });
    fabricCanvas.on('selection:cleared', () => {
      setActiveObject(null);
    });

    fabricCanvas.on('object:added', refreshLayers);
    fabricCanvas.on('object:removed', refreshLayers);
    fabricCanvas.on('object:modified', () => {
      refreshLayers();
      setActiveObject(fabricCanvas.getActiveObject());
    });
  };

  // Keyboard Shortcuts (Illustrator hotkeys: Ctrl+2, Ctrl+Alt+2, Ctrl+3, Ctrl+Alt+3, Delete)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when typing inside input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const isAlt = e.altKey;

      // Lock Selection (Ctrl + 2)
      if (isCtrl && !isAlt && e.key === '2') {
        e.preventDefault();
        lockSelection();
      }
      // Unlock All (Ctrl + Alt + 2)
      else if (isCtrl && isAlt && e.key === '2') {
        e.preventDefault();
        unlockAll();
      }
      // Hide Selection (Ctrl + 3)
      else if (isCtrl && !isAlt && e.key === '3') {
        e.preventDefault();
        hideSelection();
      }
      // Show All (Ctrl + Alt + 3)
      else if (isCtrl && isAlt && e.key === '3') {
        e.preventDefault();
        showAll();
      }
      // Tool Shortcuts
      else if (!isCtrl && !isAlt) {
        switch (e.key.toLowerCase()) {
          case 'v':
            setActiveTool('select');
            break;
          case 'r':
            setActiveTool('rectangle');
            break;
          case 's':
            setActiveTool('scale');
            break;
          case 't':
            setActiveTool('text');
            break;
          case 'h':
            setActiveTool('pan');
            break;
          case 'g':
            setActiveTool('nanobanana');
            setRightTab('nanobanana');
            break;
          case 'delete':
          case 'backspace':
            deleteSelection();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, activeObject, layers]);

  // Lock selected object(s)
  const lockSelection = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    const lockObj = (obj) => {
      obj.set({
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        hasControls: false,
      });
    };

    if (active.type === 'activeSelection') {
      active.getObjects().forEach(lockObj);
    } else {
      lockObj(active);
    }

    canvas.discardActiveObject();
    canvas.renderAll();
    refreshLayers();
  };

  // Unlock all objects
  const unlockAll = () => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      obj.set({
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        hasControls: true,
      });
    });
    canvas.renderAll();
    refreshLayers();
  };

  // Hide selected object(s)
  const hideSelection = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    if (active.type === 'activeSelection') {
      active.getObjects().forEach((obj) => obj.set('visible', false));
    } else {
      active.set('visible', false);
    }

    canvas.discardActiveObject();
    canvas.renderAll();
    refreshLayers();
  };

  // Show all hidden objects
  const showAll = () => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => obj.set('visible', true));
    canvas.renderAll();
    refreshLayers();
  };

  // Delete selected object(s)
  const deleteSelection = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    if (active.type === 'activeSelection') {
      active.getObjects().forEach((obj) => canvas.remove(obj));
    } else {
      canvas.remove(active);
    }

    canvas.discardActiveObject();
    canvas.renderAll();
    refreshLayers();
  };

  // Layer Toggles
  const handleToggleVisibility = (id) => {
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      layer.fabricObj.set('visible', !layer.visible);
      canvas.renderAll();
      refreshLayers();
    }
  };

  const handleToggleLock = (id) => {
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      const isLocked = !layer.locked;
      layer.fabricObj.set({
        lockMovementX: isLocked,
        lockMovementY: isLocked,
        lockRotation: isLocked,
        lockScalingX: isLocked,
        lockScalingY: isLocked,
        hasControls: !isLocked,
      });
      canvas.renderAll();
      refreshLayers();
    }
  };

  const handleMoveLayer = (index, direction) => {
    if (!canvas) return;
    const layer = layers[index];
    if (!layer) return;

    if (direction === 'up') {
      layer.fabricObj.bringForward();
    } else {
      layer.fabricObj.sendBackwards();
    }
    canvas.renderAll();
    refreshLayers();
  };

  const handleDeleteObject = (id) => {
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      canvas.remove(layer.fabricObj);
      canvas.renderAll();
      refreshLayers();
    }
  };

  const handleSelectObjectFromLayers = (id) => {
    setSelectedLayerId(id);
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      canvas.setActiveObject(layer.fabricObj);
      canvas.renderAll();
    }
  };

  // Store photo upload handler
  const handleAddStorePhoto = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setStorePhotos((prev) => [...prev, { id: Date.now() + Math.random(), name: file.name, url }]);
        if (!bgPhotoUrl) setBgPhotoUrl(url);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveStorePhoto = (index) => {
    setStorePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Project JSON locally
  const handleSaveProject = () => {
    if (!canvas) return;
    const projectData = {
      version: '1.0',
      date: new Date().toISOString(),
      pxPerMeter,
      briefData,
      storePhotos,
      bgPhotoUrl,
      canvasJson: canvas.toJSON(['id', 'name', 'isBackground', 'lockMovementX', 'lockMovementY']),
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proyecto_Lona_Imperia_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Open Project JSON
  const handleOpenProject = (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const projectData = JSON.parse(event.target.result);
        if (projectData.pxPerMeter) setPxPerMeter(projectData.pxPerMeter);
        if (projectData.briefData) setBriefData(projectData.briefData);
        if (projectData.storePhotos) setStorePhotos(projectData.storePhotos);
        if (projectData.bgPhotoUrl) setBgPhotoUrl(projectData.bgPhotoUrl);

        if (projectData.canvasJson) {
          canvas.loadFromJSON(projectData.canvasJson).then(() => {
            canvas.renderAll();
            refreshLayers();
          });
        }
      } catch (err) {
        alert('El archivo de proyecto no es válido.');
      }
    };
    reader.readAsText(file);
  };

  const hasHiddenObjects = layers.some((l) => !l.visible);
  const hasLockedObjects = layers.some((l) => l.locked);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] overflow-hidden select-none">
      {/* Top Illustrator Control Bar */}
      <TopControlBar
        canvas={canvas}
        activeObject={activeObject}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        lockSelection={lockSelection}
        unlockAll={unlockAll}
        hideSelection={hideSelection}
        showAll={showAll}
        deleteSelection={deleteSelection}
        hasSelection={!!activeObject}
        hasHiddenObjects={hasHiddenObjects}
        hasLockedObjects={hasLockedObjects}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar */}
        <LeftToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onUploadPhoto={handleAddStorePhoto}
          onSaveProject={handleSaveProject}
          onOpenProject={handleOpenProject}
          onOpenBriefModal={() => setBriefModalOpen(true)}
          onOpenShortcutsModal={() => setShortcutsModalOpen(true)}
        />

        {/* Center Fabric.js Canvas */}
        <CanvasWorkspace
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onCanvasInit={handleCanvasInit}
          pxPerMeter={pxPerMeter}
          onFinishScaleLine={(linePx) => {
            setScaleLinePxLength(linePx);
            setScaleModalOpen(true);
          }}
          bgPhotoUrl={bgPhotoUrl}
          onOpenNanoBananaPanel={() => setRightTab('nanobanana')}
        />

        {/* Right Tabbed Panel (Properties / Layers / Nano Banana Generator) */}
        <div className="flex flex-col h-full z-20 shadow-xl border-l border-[#3f3f46]">
          {/* Right Panel Tabs */}
          <div className="h-8 bg-[#2d2d2d] border-b border-[#3f3f46] flex text-[11px] font-semibold text-zinc-400">
            <button
              onClick={() => setRightTab('properties')}
              className={`flex-1 px-2 py-1 flex items-center justify-center space-x-1 border-r border-[#3f3f46] ${
                rightTab === 'properties' ? 'bg-[#262626] text-sky-400 font-bold border-b-2 border-b-sky-500' : 'hover:bg-zinc-800'
              }`}
            >
              Propiedades
            </button>
            <button
              onClick={() => setRightTab('layers')}
              className={`flex-1 px-2 py-1 flex items-center justify-center space-x-1 border-r border-[#3f3f46] ${
                rightTab === 'layers' ? 'bg-[#262626] text-sky-400 font-bold border-b-2 border-b-sky-500' : 'hover:bg-zinc-800'
              }`}
            >
              Capas ({layers.length})
            </button>
            <button
              onClick={() => setRightTab('nanobanana')}
              className={`flex-1 px-2 py-1 flex items-center justify-center space-x-1 ${
                rightTab === 'nanobanana' ? 'bg-[#262626] text-amber-400 font-bold border-b-2 border-b-amber-500' : 'hover:bg-zinc-800'
              }`}
            >
              Nano Banana
            </button>
          </div>

          {/* Active Tab View */}
          <div className="flex-1 overflow-hidden">
            {rightTab === 'properties' && (
              <PropertiesPanel
                canvas={canvas}
                activeObject={activeObject}
                pxPerMeter={pxPerMeter}
              />
            )}
            {rightTab === 'layers' && (
              <LayersPanel
                canvas={canvas}
                layers={layers}
                selectedId={selectedLayerId}
                onSelectObject={handleSelectObjectFromLayers}
                onToggleVisibility={handleToggleVisibility}
                onToggleLock={handleToggleLock}
                onMoveLayer={handleMoveLayer}
                onDeleteObject={handleDeleteObject}
              />
            )}
            {rightTab === 'nanobanana' && (
              <NanoBananaPanel
                canvas={canvas}
                activeObject={activeObject}
                pxPerMeter={pxPerMeter}
                apiKey={apiKey}
                setApiKey={setApiKey}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectBriefPanel
        isOpen={briefModalOpen}
        onClose={() => setBriefModalOpen(false)}
        briefData={briefData}
        setBriefData={setBriefData}
        storePhotos={storePhotos}
        onAddStorePhoto={handleAddStorePhoto}
        onRemoveStorePhoto={handleRemoveStorePhoto}
        onSelectPhotoAsBackground={(url) => setBgPhotoUrl(url)}
      />

      <ScaleModal
        isOpen={scaleModalOpen}
        onClose={() => setScaleModalOpen(false)}
        linePxLength={scaleLinePxLength}
        onConfirmScale={(ratio) => setPxPerMeter(ratio)}
      />

      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
}
