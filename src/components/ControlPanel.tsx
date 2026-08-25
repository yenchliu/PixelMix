import React, { useState } from 'react';
import {
  CollageConfig,
  GridTemplate,
  TextOverlay,
  AspectRatio,
  CellImage,
} from '../types';
import { TemplateSelector } from './TemplateSelector';
import { RatioSelector } from './RatioSelector';
import { StyleControls } from './StyleControls';
import { TextOverlayEditor } from './TextOverlayEditor';
import {
  LayoutGrid,
  Palette,
  Type,
  ImagePlus,
  Sparkles,
  Layers,
  Upload,
  Shuffle,
  Trash2,
} from 'lucide-react';
import { SAMPLE_PHOTOS } from '../data/samplePhotos';

type ControlTab = 'layout' | 'style' | 'text' | 'photos';

interface ControlPanelProps {
  template: GridTemplate;
  config: CollageConfig;
  textOverlays: TextOverlay[];
  selectedTextId: string | null;
  cellImages: Record<string, CellImage | undefined>;
  onSelectTemplate: (template: GridTemplate) => void;
  onSelectRatio: (ratio: AspectRatio) => void;
  onChangeConfig: (updates: Partial<CollageConfig>) => void;
  onSelectText: (id: string | null) => void;
  onAddText: () => void;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
  onDeleteText: (id: string) => void;
  onOpenSampleModal: () => void;
  onFillWithSamples: () => void;
  onBatchUpload: (files: FileList) => void;
  onClearAllPhotos: () => void;
  onRandomizeTemplate: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  template,
  config,
  textOverlays,
  selectedTextId,
  cellImages,
  onSelectTemplate,
  onSelectRatio,
  onChangeConfig,
  onSelectText,
  onAddText,
  onUpdateText,
  onDeleteText,
  onOpenSampleModal,
  onFillWithSamples,
  onBatchUpload,
  onClearAllPhotos,
  onRandomizeTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<ControlTab>('layout');

  const filledCount = Object.keys(cellImages).filter(
    (key) => Boolean(cellImages[key]?.src)
  ).length;
  const totalSlots = template.cells.length;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onBatchUpload(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      id="main-control-panel"
      className="flex flex-col h-full bg-white border-l border-slate-200 w-full lg:w-96 shrink-0 text-slate-800"
    >
      {/* Hidden batch file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 p-1.5 bg-slate-100/80 shrink-0 gap-1 overflow-x-auto no-scrollbar">
        <button
          id="tab-btn-layout"
          onClick={() => setActiveTab('layout')}
          className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer touch-manipulation min-w-[65px] ${
            activeTab === 'layout'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0" />
          <span>Layout</span>
        </button>

        <button
          id="tab-btn-style"
          onClick={() => setActiveTab('style')}
          className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer touch-manipulation min-w-[65px] ${
            activeTab === 'style'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <Palette className="w-4 h-4 shrink-0" />
          <span>Styles</span>
        </button>

        <button
          id="tab-btn-text"
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer touch-manipulation min-w-[65px] ${
            activeTab === 'text'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <Type className="w-4 h-4 shrink-0" />
          <span>Text</span>
          {textOverlays.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 -mt-1 hidden sm:block" />
          )}
        </button>

        <button
          id="tab-btn-photos"
          onClick={() => setActiveTab('photos')}
          className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer touch-manipulation min-w-[65px] ${
            activeTab === 'photos'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <ImagePlus className="w-4 h-4 shrink-0" />
          <span>Photos</span>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-200/80 px-1 py-0.2 rounded font-semibold hidden xs:inline">
            {filledCount}/{totalSlots}
          </span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {activeTab === 'layout' && (
          <div className="space-y-6 animate-in fade-in">
            <RatioSelector
              currentRatio={config.ratio}
              onSelectRatio={onSelectRatio}
            />

            <div className="pt-4 border-t border-slate-200">
              <TemplateSelector
                selectedTemplateId={template.id}
                onSelectTemplate={onSelectTemplate}
                currentPhotoCount={filledCount}
              />
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="animate-in fade-in">
            <StyleControls config={config} onChangeConfig={onChangeConfig} />
          </div>
        )}

        {activeTab === 'text' && (
          <div className="animate-in fade-in">
            <TextOverlayEditor
              textOverlays={textOverlays}
              selectedTextId={selectedTextId}
              onSelectText={onSelectText}
              onAddText={onAddText}
              onUpdateText={onUpdateText}
              onDeleteText={onDeleteText}
            />
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Quick Actions Card */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Manage Photos ({filledCount}/{totalSlots} Slots)
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                <button
                  id="btn-sidebar-upload-multiple"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Upload Multiple Photos
                </button>

                <button
                  id="btn-sidebar-sample-library"
                  onClick={onOpenSampleModal}
                  className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Browse Sample Photos
                </button>
              </div>
            </div>

            {/* Quick Utilities */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                id="btn-sidebar-autofill-samples"
                onClick={onFillWithSamples}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Auto-fill All Slots with Samples</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">1-click</span>
              </button>

              <button
                id="btn-sidebar-randomize-template"
                onClick={onRandomizeTemplate}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Shuffle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Randomize Grid Layout</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Surprise</span>
              </button>

              {filledCount > 0 && (
                <button
                  id="btn-sidebar-clear-all"
                  onClick={onClearAllPhotos}
                  className="w-full flex items-center justify-between p-2.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-lg text-xs text-rose-700 font-medium transition-colors cursor-pointer mt-2"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Clear All Photos</span>
                  </div>
                  <span className="text-[10px] text-rose-600/80 font-semibold">Reset</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
