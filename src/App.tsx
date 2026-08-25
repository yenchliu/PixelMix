import React, { useState, useEffect, useRef } from 'react';
import {
  CollageConfig,
  GridTemplate,
  CellImage,
  TextOverlay,
  AspectRatio,
  ImageAdjustments,
} from './types';
import { TEMPLATES } from './data/templates';
import { SAMPLE_PHOTOS, SamplePhoto } from './data/samplePhotos';
import {
  processAndDownscaleImage,
  createCellImage,
  DEFAULT_ADJUSTMENTS,
} from './utils/imageUtils';
import { Navbar } from './components/Navbar';
import { CollageCanvas } from './components/CollageCanvas';
import { ControlPanel } from './components/ControlPanel';
import { ExportModal } from './components/ExportModal';
import { SamplePhotosModal } from './components/SamplePhotosModal';
import { FilterModal } from './components/FilterModal';

export default function App() {
  // Initial Template (Classic 2x2 4-photo grid)
  const [template, setTemplate] = useState<GridTemplate>(() => {
    return TEMPLATES.find((t) => t.id === '4-grid-2x2') || TEMPLATES[0];
  });

  // Collage Config (Ratio, Spacing, Background)
  const [config, setConfig] = useState<CollageConfig>({
    ratio: '1:1',
    templateId: '4-grid-2x2',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    shadow: 6,
    background: {
      type: 'solid',
      color: '#18181b',
    },
  });

  // Cell Images Record
  const [cellImages, setCellImages] = useState<Record<string, CellImage | undefined>>({});

  // Text Overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([
    {
      id: 'text-default-title',
      text: 'Summer Memories',
      x: 0.5,
      y: 0.5,
      fontSize: 28,
      fontFamily: '"Playfair Display", serif',
      color: '#ffffff',
      bgColor: 'rgba(0, 0, 0, 0.7)',
      hasBackground: true,
      isBold: true,
      isItalic: false,
      shadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      align: 'center',
      rotation: 0,
    },
  ]);

  // Selected State
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [activeFilterCellId, setActiveFilterCellId] = useState<string | null>(null);

  // Specific cell targeted for photo upload/selection
  const targetUploadCellId = useRef<string | null>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  // Load initial sample photos on mount
  useEffect(() => {
    const initialImages: Record<string, CellImage | undefined> = {};
    const samplePool = [...SAMPLE_PHOTOS];

    template.cells.forEach((cell, idx) => {
      const sample = samplePool[idx % samplePool.length];
      initialImages[cell.id] = createCellImage(
        cell.id,
        sample.url,
        1200,
        800,
        sample.title
      );
    });

    setCellImages(initialImages);
  }, []);

  // Handlers for Template and Ratio Changes
  const handleSelectTemplate = (newTemplate: GridTemplate) => {
    setTemplate(newTemplate);
    setConfig((prev) => ({ ...prev, templateId: newTemplate.id }));

    // Re-map existing images to new cell slots without losing user images
    setCellImages((prev) => {
      const existingImages = Object.values(prev).filter(Boolean) as CellImage[];
      const nextMap: Record<string, CellImage | undefined> = {};

      newTemplate.cells.forEach((cell, idx) => {
        if (existingImages[idx]) {
          nextMap[cell.id] = {
            ...existingImages[idx],
            id: cell.id,
          };
        }
      });
      return nextMap;
    });

    setSelectedCellId(null);
  };

  const handleSelectRatio = (ratio: AspectRatio) => {
    setConfig((prev) => ({ ...prev, ratio }));
  };

  const handleChangeConfig = (updates: Partial<CollageConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Image Manipulation Handlers
  const handleUpdateImage = (cellId: string, updates: Partial<CellImage>) => {
    setCellImages((prev) => {
      const current = prev[cellId];
      if (!current) return prev;
      return {
        ...prev,
        [cellId]: {
          ...current,
          ...updates,
        },
      };
    });
  };

  const handleDeleteImage = (cellId: string) => {
    setCellImages((prev) => {
      const next = { ...prev };
      delete next[cellId];
      return next;
    });
    setSelectedCellId(null);
  };

  const handleClearAllPhotos = () => {
    setCellImages({});
    setSelectedCellId(null);
  };

  // Image Upload Processing
  const handleSingleCellUploadTrigger = (cellId: string) => {
    targetUploadCellId.current = cellId;
    if (singleFileInputRef.current) {
      singleFileInputRef.current.value = '';
      singleFileInputRef.current.click();
    }
  };

  const handleSingleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const cellId = targetUploadCellId.current || template.cells[0]?.id;
    if (!cellId) return;

    try {
      const { dataUrl, width, height, name } = await processAndDownscaleImage(file);
      const newImg = createCellImage(cellId, dataUrl, width, height, name);
      setCellImages((prev) => ({
        ...prev,
        [cellId]: newImg,
      }));
      setSelectedCellId(cellId);
    } catch (err) {
      console.error('Error processing single file:', err);
    }
  };

  const handleBatchUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Find available slots or override from first cell
    const emptyCells = template.cells.filter((c) => !cellImages[c.id]);
    const targetCells = emptyCells.length > 0 ? emptyCells : template.cells;

    const newEntries: Record<string, CellImage> = {};

    for (let i = 0; i < Math.min(fileArray.length, template.cells.length); i++) {
      const file = fileArray[i];
      const targetCell = targetCells[i] || template.cells[i];
      if (!targetCell) break;

      try {
        const { dataUrl, width, height, name } = await processAndDownscaleImage(file);
        newEntries[targetCell.id] = createCellImage(
          targetCell.id,
          dataUrl,
          width,
          height,
          name
        );
      } catch (err) {
        console.error('Failed to load image:', err);
      }
    }

    setCellImages((prev) => ({
      ...prev,
      ...newEntries,
    }));
  };

  const handleDropFilesOnCell = async (cellId: string, files: FileList) => {
    if (files.length === 1) {
      try {
        const { dataUrl, width, height, name } = await processAndDownscaleImage(files[0]);
        setCellImages((prev) => ({
          ...prev,
          [cellId]: createCellImage(cellId, dataUrl, width, height, name),
        }));
        setSelectedCellId(cellId);
      } catch (err) {
        console.error('Drop file error:', err);
      }
    } else {
      handleBatchUpload(files);
    }
  };

  // Sample Photos Auto-Fill
  const handleFillWithSamples = () => {
    const updatedMap: Record<string, CellImage | undefined> = {};
    const shuffled = [...SAMPLE_PHOTOS].sort(() => 0.5 - Math.random());

    template.cells.forEach((cell, idx) => {
      const sample = shuffled[idx % shuffled.length];
      updatedMap[cell.id] = createCellImage(
        cell.id,
        sample.url,
        1200,
        800,
        sample.title
      );
    });

    setCellImages(updatedMap);
  };

  const handleSelectSamplePhoto = (photo: SamplePhoto) => {
    const targetCellId =
      selectedCellId ||
      template.cells.find((c) => !cellImages[c.id])?.id ||
      template.cells[0]?.id;

    if (!targetCellId) return;

    const newImg = createCellImage(
      targetCellId,
      photo.url,
      1200,
      800,
      photo.title
    );

    setCellImages((prev) => ({
      ...prev,
      [targetCellId]: newImg,
    }));
    setSelectedCellId(targetCellId);
  };

  // Randomize Template
  const handleRandomizeTemplate = () => {
    const randomTemplate = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    handleSelectTemplate(randomTemplate);
  };

  // Text Overlay Handlers
  const handleAddText = () => {
    const newId = `text-${Date.now()}`;
    const newLayer: TextOverlay = {
      id: newId,
      text: 'Double click to edit',
      x: 0.5,
      y: 0.5,
      fontSize: 32,
      fontFamily: 'Inter, sans-serif',
      color: '#ffffff',
      bgColor: 'rgba(0, 0, 0, 0.65)',
      hasBackground: false,
      isBold: true,
      isItalic: false,
      shadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      align: 'center',
      rotation: 0,
    };
    setTextOverlays((prev) => [...prev, newLayer]);
    setSelectedTextId(newId);
    setSelectedCellId(null);
  };

  const handleUpdateText = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleDeleteText = (id: string) => {
    setTextOverlays((prev) => prev.filter((t) => t.id !== id));
    setSelectedTextId(null);
  };

  const hasPhotos = Object.keys(cellImages).some(
    (key) => Boolean(cellImages[key]?.src)
  );
  const activeFilterImage = activeFilterCellId ? cellImages[activeFilterCellId] : null;

  return (
    <div
      id="app-root-container"
      className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden"
    >
      {/* Hidden File Inputs */}
      <input
        ref={singleFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleSingleFileSelected}
        className="hidden"
      />
      <input
        ref={batchFileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) handleBatchUpload(e.target.files);
        }}
        className="hidden"
      />

      {/* Top Navbar */}
      <Navbar
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onTriggerBatchUpload={() => batchFileInputRef.current?.click()}
        onClearAll={handleClearAllPhotos}
        hasPhotos={hasPhotos}
      />

      {/* Workspace Area: Interactive Canvas + Control Panel */}
      <main
        id="collage-workspace-layout"
        className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative"
      >
        {/* Main Canvas Stage */}
        <CollageCanvas
          template={template}
          cellImages={cellImages}
          config={config}
          textOverlays={textOverlays}
          selectedCellId={selectedCellId}
          selectedTextId={selectedTextId}
          onSelectCell={(id) => {
            setSelectedCellId(id);
            if (id) setSelectedTextId(null);
          }}
          onSelectText={(id) => {
            setSelectedTextId(id);
            if (id) setSelectedCellId(null);
          }}
          onUpdateImage={handleUpdateImage}
          onDeleteImage={handleDeleteImage}
          onUpdateTextOverlay={handleUpdateText}
          onTriggerUpload={handleSingleCellUploadTrigger}
          onOpenFilters={(cellId) => setActiveFilterCellId(cellId)}
          onDropFilesOnCell={handleDropFilesOnCell}
        />

        {/* Right Sidebar / Bottom Controls */}
        <ControlPanel
          template={template}
          config={config}
          textOverlays={textOverlays}
          selectedTextId={selectedTextId}
          cellImages={cellImages}
          onSelectTemplate={handleSelectTemplate}
          onSelectRatio={handleSelectRatio}
          onChangeConfig={handleChangeConfig}
          onSelectText={setSelectedTextId}
          onAddText={handleAddText}
          onUpdateText={handleUpdateText}
          onDeleteText={handleDeleteText}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
          onFillWithSamples={handleFillWithSamples}
          onBatchUpload={handleBatchUpload}
          onClearAllPhotos={handleClearAllPhotos}
          onRandomizeTemplate={handleRandomizeTemplate}
        />
      </main>

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        template={template}
        cellImages={cellImages}
        config={config}
        textOverlays={textOverlays}
      />

      {/* Sample Photos Gallery Modal */}
      <SamplePhotosModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectPhoto={handleSelectSamplePhoto}
        onFillAllWithSamples={handleFillWithSamples}
        cellCount={template.cells.length}
      />

      {/* Image Filters & Adjustments Modal */}
      {activeFilterCellId && activeFilterImage && (
        <FilterModal
          isOpen={!!activeFilterCellId}
          onClose={() => setActiveFilterCellId(null)}
          adjustments={activeFilterImage.adjustments || DEFAULT_ADJUSTMENTS}
          onChange={(adj) =>
            handleUpdateImage(activeFilterCellId, { adjustments: adj })
          }
        />
      )}
    </div>
  );
}
