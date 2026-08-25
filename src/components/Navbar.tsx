import React from 'react';
import {
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  LayoutGrid,
} from 'lucide-react';

interface NavbarProps {
  onOpenExportModal: () => void;
  onOpenSampleModal: () => void;
  onTriggerBatchUpload: () => void;
  onClearAll: () => void;
  hasPhotos: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenExportModal,
  onOpenSampleModal,
  onTriggerBatchUpload,
  onClearAll,
  hasPhotos,
}) => {
  return (
    <header
      id="app-header-navbar"
      className="h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between z-20 shrink-0 sticky top-0 shadow-xs max-w-full"
    >
      {/* Brand & Logo */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs shrink-0">
          <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
            <span>PixelMix</span>
            <span className="text-blue-600 hidden xs:inline">Pro</span>
            <span className="hidden md:inline-block text-[10px] uppercase font-semibold tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md ml-1">
              Studio Pro
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 hidden lg:block">
            Professional photo collage editor and layout engine
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Sample Photos Button */}
        <button
          id="btn-nav-samples"
          onClick={onOpenSampleModal}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer touch-manipulation"
          title="Browse Sample Photos"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="hidden sm:inline">Samples</span>
        </button>

        {/* Upload Button */}
        <button
          id="btn-nav-upload"
          onClick={onTriggerBatchUpload}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer touch-manipulation"
          title="Upload Images"
        >
          <Upload className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Clear Button */}
        {hasPhotos && (
          <button
            id="btn-nav-clear"
            onClick={onClearAll}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-xs font-medium transition-colors cursor-pointer touch-manipulation"
            title="Reset All Slots"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Reset</span>
          </button>
        )}

        {/* Export CTA Button */}
        <button
          id="btn-nav-export-cta"
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap touch-manipulation shrink-0"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="inline sm:hidden">Export</span>
          <span className="hidden sm:inline">Export Collage</span>
        </button>
      </div>
    </header>
  );
};
