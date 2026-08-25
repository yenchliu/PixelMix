import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  CollageConfig,
  GridTemplate,
  CellImage,
  TextOverlay,
} from '../types';
import {
  renderCollage,
  calculateCellDimensions,
  RenderCellCalculated,
} from '../utils/canvasRenderer';
import { ASPECT_RATIOS } from '../data/templates';
import { CellToolbar } from './CellToolbar';

interface CollageCanvasProps {
  template: GridTemplate;
  cellImages: Record<string, CellImage | undefined>;
  config: CollageConfig;
  textOverlays: TextOverlay[];
  selectedCellId: string | null;
  selectedTextId: string | null;
  onSelectCell: (cellId: string | null) => void;
  onSelectText: (textId: string | null) => void;
  onUpdateImage: (cellId: string, updates: Partial<CellImage>) => void;
  onDeleteImage: (cellId: string) => void;
  onUpdateTextOverlay: (textId: string, updates: Partial<TextOverlay>) => void;
  onTriggerUpload: (cellId: string) => void;
  onOpenFilters: (cellId: string) => void;
  onDropFilesOnCell?: (cellId: string, files: FileList) => void;
}

export const CollageCanvas: React.FC<CollageCanvasProps> = ({
  template,
  cellImages,
  config,
  textOverlays,
  selectedCellId,
  selectedTextId,
  onSelectCell,
  onSelectText,
  onUpdateImage,
  onDeleteImage,
  onUpdateTextOverlay,
  onTriggerUpload,
  onOpenFilters,
  onDropFilesOnCell,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction States
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'cell' | 'text' | null>(null);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);

  const startPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startPanPos = useRef<{ panX: number; panY: number }>({ panX: 0, panY: 0 });
  const startTextPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Touch Pinch References
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchZoom = useRef<number>(1);
  const pinchTargetCellId = useRef<string | null>(null);

  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 600,
  });

  // Calculate target aspect ratio multiplier
  const currentRatioObj = ASPECT_RATIOS.find((r) => r.id === config.ratio) || ASPECT_RATIOS[0];
  const aspectMultiplier = currentRatioObj.ratio;

  // Responsive Canvas Sizing with ResizeObserver
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth <= 0 || clientHeight <= 0) return;

      const maxW = clientWidth - 24;
      const maxH = clientHeight - 90; // leave room for floating toolbar and bottom status pills

      let targetW = maxW;
      let targetH = targetW / aspectMultiplier;

      if (targetH > maxH) {
        targetH = maxH;
        targetW = targetH * aspectMultiplier;
      }

      // Minimum and maximum bounds for sharp display
      targetW = Math.max(240, Math.floor(targetW));
      targetH = Math.max(240, Math.floor(targetH));

      setCanvasDimensions({ width: targetW, height: targetH });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [aspectMultiplier, config.ratio]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvasDimensions.width * dpr);
    canvas.height = Math.round(canvasDimensions.height * dpr);

    canvas.style.width = `${canvasDimensions.width}px`;
    canvas.style.height = `${canvasDimensions.height}px`;

    renderCollage(
      canvas,
      template,
      cellImages,
      config,
      textOverlays,
      {
        selectedCellId,
        selectedTextId,
        isExport: false,
        scaleMultiplier: canvasDimensions.width / 600,
        logicalWidth: canvasDimensions.width,
        logicalHeight: canvasDimensions.height,
      }
    );
  }, [
    template,
    cellImages,
    config,
    textOverlays,
    selectedCellId,
    selectedTextId,
    canvasDimensions,
  ]);

  // Find which cell was clicked based on canvas coordinates
  const getCellAtPoint = useCallback(
    (clientX: number, clientY: number): RenderCellCalculated | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const displayW = canvasDimensions.width;
      const displayH = canvasDimensions.height;

      const scale = displayW / 600;
      const gap = config.gap * scale;
      const padding = config.padding * scale;

      const calculatedCells = calculateCellDimensions(
        template,
        displayW,
        displayH,
        gap,
        padding
      );

      for (let i = calculatedCells.length - 1; i >= 0; i--) {
        const item = calculatedCells[i];
        if (
          x >= item.x &&
          x <= item.x + item.w &&
          y >= item.y &&
          y <= item.y + item.h
        ) {
          return item;
        }
      }
      return null;
    },
    [template, config, canvasDimensions]
  );

  // Find which text was clicked based on canvas coordinates
  const getTextAtPoint = useCallback(
    (clientX: number, clientY: number): TextOverlay | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      const displayW = canvasDimensions.width;
      const displayH = canvasDimensions.height;
      const scale = displayW / 600;

      for (let i = textOverlays.length - 1; i >= 0; i--) {
        const item = textOverlays[i];
        const tx = item.x * displayW;
        const ty = item.y * displayH;
        const fontSize = item.fontSize * scale;

        const hitWidth = Math.max(80 * scale, item.text.length * (fontSize * 0.65));
        const hitHeight = Math.max(36 * scale, fontSize * 1.4);

        if (
          clickX >= tx - hitWidth / 2 &&
          clickX <= tx + hitWidth / 2 &&
          clickY >= ty - hitHeight / 2 &&
          clickY <= ty + hitHeight / 2
        ) {
          return item;
        }
      }
      return null;
    },
    [textOverlays, canvasDimensions]
  );

  // Non-passive Touch & Wheel Listeners for Smooth Pinch and Wheel Zooming
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Two-finger pinch to zoom on mobile
    const onTouchStartNative = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        initialPinchDistance.current = dist;

        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;
        const hitCell = getCellAtPoint(midX, midY);

        let targetId = hitCell?.cell.id || selectedCellId;
        if (!targetId || !cellImages[targetId]?.src) {
          // Fallback to first cell with image
          const firstWithImg = template.cells.find((c) => Boolean(cellImages[c.id]?.src));
          targetId = firstWithImg ? firstWithImg.id : null;
        }

        if (targetId) {
          pinchTargetCellId.current = targetId;
          setActiveCellId(targetId);
          onSelectCell(targetId);
          initialPinchZoom.current = cellImages[targetId]?.zoom || 1;
        }
      }
    };

    const onTouchMoveNative = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance.current !== null && pinchTargetCellId.current) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const ratio = dist / Math.max(10, initialPinchDistance.current);

        const newZoom = Math.min(4, Math.max(1, initialPinchZoom.current * ratio));
        onUpdateImage(pinchTargetCellId.current, { zoom: Number(newZoom.toFixed(2)) });
      }
    };

    const onTouchEndNative = () => {
      initialPinchDistance.current = null;
      pinchTargetCellId.current = null;
    };

    // 2. Desktop Mouse Wheel Zoom
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const hitCell = getCellAtPoint(e.clientX, e.clientY);
      let targetId = hitCell?.cell.id || selectedCellId;

      if (!targetId || !cellImages[targetId]?.src) {
        // Fallback to first cell with image
        const firstWithImg = template.cells.find((c) => Boolean(cellImages[c.id]?.src));
        targetId = firstWithImg ? firstWithImg.id : null;
      }

      if (targetId && cellImages[targetId]?.src) {
        const currentZoom = cellImages[targetId]?.zoom || 1;
        const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
        const newZoom = Math.min(4, Math.max(1, currentZoom + zoomDelta));
        onUpdateImage(targetId, { zoom: Number(newZoom.toFixed(2)) });
        if (targetId !== selectedCellId) {
          onSelectCell(targetId);
        }
      }
    };

    canvas.addEventListener('touchstart', onTouchStartNative, { passive: false });
    canvas.addEventListener('touchmove', onTouchMoveNative, { passive: false });
    canvas.addEventListener('touchend', onTouchEndNative, { passive: true });
    canvas.addEventListener('touchcancel', onTouchEndNative, { passive: true });
    canvas.addEventListener('wheel', onWheelNative, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStartNative);
      canvas.removeEventListener('touchmove', onTouchMoveNative);
      canvas.removeEventListener('touchend', onTouchEndNative);
      canvas.removeEventListener('touchcancel', onTouchEndNative);
      canvas.removeEventListener('wheel', onWheelNative);
    };
  }, [getCellAtPoint, cellImages, selectedCellId, template, onSelectCell, onUpdateImage]);

  // Pointer Down (Mouse & Single Touch Drag/Pan)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const hitText = getTextAtPoint(e.clientX, e.clientY);
    if (hitText) {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      onSelectText(hitText.id);
      onSelectCell(null);
      setIsDragging(true);
      setDragTarget('text');
      setActiveTextId(hitText.id);
      startPointerPos.current = { x: e.clientX, y: e.clientY };
      startTextPos.current = { x: hitText.x, y: hitText.y };
      return;
    }

    const hitCell = getCellAtPoint(e.clientX, e.clientY);
    if (hitCell) {
      const cellId = hitCell.cell.id;
      onSelectCell(cellId);
      onSelectText(null);
      setActiveCellId(cellId);

      const cellImage = cellImages[cellId];
      if (cellImage && cellImage.src) {
        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);
        setIsDragging(true);
        setDragTarget('cell');
        startPointerPos.current = { x: e.clientX, y: e.clientY };
        startPanPos.current = { panX: cellImage.panX || 0, panY: cellImage.panY || 0 };
      } else {
        // Empty cell clicked: trigger upload cleanly
        onTriggerUpload(cellId);
      }
    } else {
      onSelectCell(null);
      onSelectText(null);
    }
  };

  // Pointer Move (Panning image or dragging text)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const displayW = canvasDimensions.width;
    const displayH = canvasDimensions.height;

    const deltaX = e.clientX - startPointerPos.current.x;
    const deltaY = e.clientY - startPointerPos.current.y;

    if (dragTarget === 'text' && activeTextId) {
      const newNormX = Math.max(0.05, Math.min(0.95, startTextPos.current.x + deltaX / displayW));
      const newNormY = Math.max(0.05, Math.min(0.95, startTextPos.current.y + deltaY / displayH));
      onUpdateTextOverlay(activeTextId, { x: newNormX, y: newNormY });
    } else if (dragTarget === 'cell' && activeCellId) {
      const cellImage = cellImages[activeCellId];
      if (cellImage) {
        // Smooth direct panning response
        const sensitivity = 0.008;
        const newPanX = Math.max(-1, Math.min(1, startPanPos.current.panX + deltaX * sensitivity));
        const newPanY = Math.max(-1, Math.min(1, startPanPos.current.panY + deltaY * sensitivity));
        onUpdateImage(activeCellId, { panX: newPanX, panY: newPanY });
      }
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
    setDragTarget(null);
  };

  // Double click / tap handler to replace image
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const hitCell = getCellAtPoint(e.clientX, e.clientY);
    if (hitCell) {
      onTriggerUpload(hitCell.cell.id);
    }
  };

  // Drag & Drop onto canvas/cell
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const hitCell = getCellAtPoint(e.clientX, e.clientY);
    if (hitCell && onDropFilesOnCell) {
      onDropFilesOnCell(hitCell.cell.id, e.dataTransfer.files);
    } else if (onDropFilesOnCell) {
      const targetCell = template.cells.find((c) => !cellImages[c.id]) || template.cells[0];
      if (targetCell) {
        onDropFilesOnCell(targetCell.id, e.dataTransfer.files);
      }
    }
  };

  // Quick zoom controls from status bar
  const activeSelectedImage = selectedCellId ? cellImages[selectedCellId] : null;
  const activeZoomCellId = selectedCellId || template.cells.find((c) => Boolean(cellImages[c.id]?.src))?.id;
  const zoomTargetImg = activeZoomCellId ? cellImages[activeZoomCellId] : null;

  const handleQuickZoom = (delta: number) => {
    if (!activeZoomCellId || !zoomTargetImg) return;
    const current = zoomTargetImg.zoom || 1;
    const nextZoom = Math.min(4, Math.max(1, current + delta));
    onUpdateImage(activeZoomCellId, { zoom: Number(nextZoom.toFixed(2)) });
    if (selectedCellId !== activeZoomCellId) {
      onSelectCell(activeZoomCellId);
    }
  };

  const handleQuickRotate = () => {
    if (!activeZoomCellId || !zoomTargetImg) return;
    const nextRot = ((zoomTargetImg.rotation || 0) + 90) % 360;
    onUpdateImage(activeZoomCellId, { rotation: nextRot });
    if (selectedCellId !== activeZoomCellId) {
      onSelectCell(activeZoomCellId);
    }
  };

  const filledCount = Object.keys(cellImages).filter((k) => Boolean(cellImages[k]?.src)).length;

  return (
    <div
      ref={containerRef}
      id="collage-canvas-container"
      className="relative flex-1 flex flex-col items-center justify-center p-2 sm:p-6 w-full h-full min-h-[320px] overflow-hidden select-none bg-slate-100/90"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Floating Active Cell Quick Toolbar */}
      {selectedCellId && (
        <div className="absolute top-2 sm:top-4 z-30 transition-all max-w-[96vw] px-2 flex justify-center">
          <CellToolbar
            cellId={selectedCellId}
            image={cellImages[selectedCellId]}
            onUpdateImage={onUpdateImage}
            onDeleteImage={onDeleteImage}
            onTriggerUpload={onTriggerUpload}
            onOpenFilters={onOpenFilters}
          />
        </div>
      )}

      {/* Canvas Wrapper */}
      <div
        className="relative flex items-center justify-center rounded-2xl shadow-2xl transition-transform duration-150 group ring-1 ring-slate-300/70 shrink-0"
        style={{
          width: canvasDimensions.width,
          height: canvasDimensions.height,
        }}
      >
        <canvas
          ref={canvasRef}
          id="main-photo-canvas"
          className="rounded-2xl cursor-grab active:cursor-grabbing touch-none block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={handleDoubleClick}
        />
      </div>

      {/* Bottom Single-line Status Pills & Helper Hint */}
      <div className="mt-3 flex flex-col items-center gap-1.5 max-w-full px-2">
        <div className="flex items-center justify-center gap-1 sm:gap-2 max-w-full overflow-x-auto no-scrollbar py-0.5">
          {/* Ratio Pill */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[11px] sm:text-xs border border-slate-200 shadow-xs shrink-0">
            <span className="text-slate-500 font-medium">Ratio:</span>
            <span className="font-bold text-slate-800">{config.ratio}</span>
          </div>

          {/* Interactive Zoom Pill with Quick +/- Buttons */}
          <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[11px] sm:text-xs border border-slate-200 shadow-xs shrink-0">
            <button
              id="btn-quick-zoom-out"
              title="Zoom Out"
              onClick={() => handleQuickZoom(-0.15)}
              disabled={!zoomTargetImg || (zoomTargetImg.zoom || 1) <= 1}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 text-slate-600 font-bold cursor-pointer touch-manipulation"
            >
              -
            </button>
            <span className="px-0.5 font-bold text-blue-600 min-w-[34px] text-center font-mono">
              {zoomTargetImg ? `${Math.round((zoomTargetImg.zoom || 1) * 100)}%` : '100%'}
            </span>
            <button
              id="btn-quick-zoom-in"
              title="Zoom In"
              onClick={() => handleQuickZoom(0.15)}
              disabled={!zoomTargetImg || (zoomTargetImg.zoom || 1) >= 4}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 text-slate-600 font-bold cursor-pointer touch-manipulation"
            >
              +
            </button>
          </div>

          {/* Rotation Pill */}
          <button
            id="btn-quick-rotate"
            title="Click to Rotate 90°"
            onClick={handleQuickRotate}
            disabled={!zoomTargetImg}
            className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[11px] sm:text-xs border border-slate-200 shadow-xs hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-40 cursor-pointer touch-manipulation shrink-0"
          >
            <span className="text-slate-500 font-medium">Rot:</span>
            <span className="font-bold text-slate-800">
              {zoomTargetImg?.rotation || 0}°
            </span>
          </button>

          {/* Photos Slots Pill */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[11px] sm:text-xs border border-slate-200 shadow-xs shrink-0">
            <span className="text-slate-500 font-medium">Photos:</span>
            <span className="font-bold text-slate-800">
              {filledCount}/{template.cells.length}
            </span>
          </div>
        </div>

        {/* Responsive Hint */}
        <div className="text-center text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
          <span className="hidden sm:inline">Scroll wheel or pinch to zoom • Drag to crop/pan • Click slot to edit</span>
          <span className="sm:hidden">雙指捏合/滾輪縮放 • 拖曳裁剪 • 點選照片編輯</span>
        </div>
      </div>
    </div>
  );
};
