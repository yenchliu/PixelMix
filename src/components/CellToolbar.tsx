import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Trash2,
  ImagePlus,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { CellImage } from '../types';

interface CellToolbarProps {
  image?: CellImage;
  cellId: string;
  onUpdateImage: (cellId: string, updates: Partial<CellImage>) => void;
  onDeleteImage: (cellId: string) => void;
  onTriggerUpload: (cellId: string) => void;
  onOpenFilters: (cellId: string) => void;
}

export const CellToolbar: React.FC<CellToolbarProps> = ({
  image,
  cellId,
  onUpdateImage,
  onDeleteImage,
  onTriggerUpload,
  onOpenFilters,
}) => {
  const handleStopEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (!image) {
    return (
      <div
        id="cell-toolbar-empty"
        onPointerDown={handleStopEvent}
        onTouchStart={handleStopEvent}
        onClick={handleStopEvent}
        className="flex items-center gap-2 bg-white/95 border border-slate-200 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl animate-in fade-in zoom-in duration-150"
      >
        <button
          id="btn-cell-add-photo"
          onClick={(e) => {
            e.stopPropagation();
            onTriggerUpload(cellId);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer touch-manipulation"
        >
          <ImagePlus className="w-4 h-4" />
          Add Photo
        </button>
      </div>
    );
  }

  const handleZoom = (delta: number, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    const newZoom = Math.min(4, Math.max(1, (image.zoom || 1) + delta));
    onUpdateImage(cellId, { zoom: Number(newZoom.toFixed(2)) });
  };

  const handleRotate = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    const nextRotation = ((image.rotation || 0) + 90) % 360;
    onUpdateImage(cellId, { rotation: nextRotation });
  };

  const handleFlipH = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    onUpdateImage(cellId, { flipH: !image.flipH });
  };

  const handleFlipV = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    onUpdateImage(cellId, { flipV: !image.flipV });
  };

  const handleResetCrop = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    onUpdateImage(cellId, {
      zoom: 1,
      panX: 0,
      panY: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
    });
  };

  return (
    <div
      id="cell-toolbar-active"
      onPointerDown={handleStopEvent}
      onTouchStart={handleStopEvent}
      onClick={handleStopEvent}
      className="flex items-center gap-1 sm:gap-1.5 bg-white/95 border border-slate-200 backdrop-blur-md px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl shadow-xl text-slate-700 text-xs select-none max-w-[94vw] overflow-x-auto no-scrollbar touch-manipulation animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* Zoom Controls */}
      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/60 shrink-0">
        <button
          id="btn-zoom-out"
          title="Zoom Out"
          onClick={(e) => handleZoom(-0.15, e)}
          disabled={image.zoom <= 1}
          className="p-1.5 hover:bg-slate-200 active:scale-95 disabled:opacity-30 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer touch-manipulation"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="px-1 text-[11px] font-mono text-slate-700 font-bold min-w-[32px] text-center">
          {Math.round((image.zoom || 1) * 100)}%
        </span>
        <button
          id="btn-zoom-in"
          title="Zoom In"
          onClick={(e) => handleZoom(0.15, e)}
          disabled={image.zoom >= 4}
          className="p-1.5 hover:bg-slate-200 active:scale-95 disabled:opacity-30 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer touch-manipulation"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-px h-4 bg-slate-200 shrink-0" />

      {/* Transform buttons */}
      <button
        id="btn-rotate"
        title="Rotate 90°"
        onClick={(e) => handleRotate(e)}
        className="p-1.5 sm:p-2 hover:bg-slate-100 active:scale-95 rounded-lg text-slate-600 hover:text-slate-900 transition-all cursor-pointer touch-manipulation shrink-0"
      >
        <RotateCw className="w-3.5 h-3.5" />
      </button>

      <button
        id="btn-flip-h"
        title="Flip Horizontal"
        onClick={(e) => handleFlipH(e)}
        className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer touch-manipulation shrink-0 ${
          image.flipH
            ? 'bg-blue-100 text-blue-700 font-semibold'
            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
        }`}
      >
        <FlipHorizontal className="w-3.5 h-3.5" />
      </button>

      <button
        id="btn-flip-v"
        title="Flip Vertical"
        onClick={(e) => handleFlipV(e)}
        className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer touch-manipulation shrink-0 ${
          image.flipV
            ? 'bg-blue-100 text-blue-700 font-semibold'
            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
        }`}
      >
        <FlipVertical className="w-3.5 h-3.5" />
      </button>

      <button
        id="btn-filters"
        title="Adjust Filters & Colors"
        onClick={(e) => {
          e.stopPropagation();
          onOpenFilters(cellId);
        }}
        className="p-1.5 sm:p-2 hover:bg-slate-100 active:scale-95 rounded-lg text-slate-600 hover:text-slate-900 transition-all cursor-pointer touch-manipulation shrink-0"
      >
        <Sliders className="w-3.5 h-3.5 text-blue-600" />
      </button>

      <button
        id="btn-reset-crop"
        title="Reset Zoom & Pan"
        onClick={(e) => handleResetCrop(e)}
        className="p-1.5 sm:p-2 hover:bg-slate-100 active:scale-95 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer touch-manipulation shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-slate-200 shrink-0" />

      {/* Replace & Delete */}
      <button
        id="btn-replace-photo"
        title="Replace Photo"
        onClick={(e) => {
          e.stopPropagation();
          onTriggerUpload(cellId);
        }}
        className="p-1.5 sm:p-2 hover:bg-blue-50 active:scale-95 rounded-lg text-blue-600 hover:text-blue-700 transition-all cursor-pointer touch-manipulation shrink-0"
      >
        <ImagePlus className="w-3.5 h-3.5" />
      </button>

      <button
        id="btn-delete-photo"
        title="Remove Photo"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteImage(cellId);
        }}
        className="p-1.5 sm:p-2 hover:bg-rose-50 active:scale-95 rounded-lg text-rose-500 hover:text-rose-700 transition-all cursor-pointer touch-manipulation shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
