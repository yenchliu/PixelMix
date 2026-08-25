import React from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import { ImageAdjustments } from '../types';
import { DEFAULT_ADJUSTMENTS } from '../utils/imageUtils';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  adjustments: ImageAdjustments;
  onChange: (adjustments: ImageAdjustments) => void;
}

const PRESET_FILTERS = [
  { name: 'Original', adj: { ...DEFAULT_ADJUSTMENTS } },
  {
    name: 'Vibrant',
    adj: { ...DEFAULT_ADJUSTMENTS, brightness: 5, contrast: 15, saturation: 25 },
  },
  {
    name: 'B&W Classic',
    adj: { ...DEFAULT_ADJUSTMENTS, grayscale: 100, contrast: 20 },
  },
  {
    name: 'Warm Vintage',
    adj: { ...DEFAULT_ADJUSTMENTS, sepia: 40, brightness: -5, saturation: 10 },
  },
  {
    name: 'Moody Dark',
    adj: { ...DEFAULT_ADJUSTMENTS, brightness: -15, contrast: 25, saturation: -10 },
  },
  {
    name: 'Soft Dream',
    adj: { ...DEFAULT_ADJUSTMENTS, brightness: 10, contrast: -10, blur: 1 },
  },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  adjustments,
  onChange,
}) => {
  if (!isOpen) return null;

  const handleSliderChange = (key: keyof ImageAdjustments, val: number) => {
    onChange({
      ...adjustments,
      [key]: val,
    });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_ADJUSTMENTS });
  };

  return (
    <div
      id="filter-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="filter-modal-card"
        className="bg-white border border-slate-200 w-full max-w-md rounded-xl shadow-2xl overflow-hidden p-6 text-slate-800"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Adjust Photo & Filters</h3>
              <p className="text-[11px] text-slate-400">Fine-tune exposure, tones, and artistic styling</p>
            </div>
          </div>
          <button
            id="btn-close-filter-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="my-4">
          <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">
            Quick Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_FILTERS.map((preset) => (
              <button
                key={preset.name}
                id={`btn-preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onChange(preset.adj)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-all text-slate-700 font-semibold cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 my-4">
          {/* Brightness */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium">Brightness</span>
              <span className="font-mono text-slate-500 font-semibold">{adjustments.brightness}%</span>
            </div>
            <input
              id="slider-brightness"
              type="range"
              min="-100"
              max="100"
              value={adjustments.brightness}
              onChange={(e) => handleSliderChange('brightness', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium">Contrast</span>
              <span className="font-mono text-slate-500 font-semibold">{adjustments.contrast}%</span>
            </div>
            <input
              id="slider-contrast"
              type="range"
              min="-100"
              max="100"
              value={adjustments.contrast}
              onChange={(e) => handleSliderChange('contrast', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium">Saturation</span>
              <span className="font-mono text-slate-500 font-semibold">{adjustments.saturation}%</span>
            </div>
            <input
              id="slider-saturation"
              type="range"
              min="-100"
              max="100"
              value={adjustments.saturation}
              onChange={(e) => handleSliderChange('saturation', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Grayscale */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium">Black & White (Grayscale)</span>
              <span className="font-mono text-slate-500 font-semibold">{adjustments.grayscale}%</span>
            </div>
            <input
              id="slider-grayscale"
              type="range"
              min="0"
              max="100"
              value={adjustments.grayscale}
              onChange={(e) => handleSliderChange('grayscale', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Sepia */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium">Sepia / Vintage</span>
              <span className="font-mono text-slate-500 font-semibold">{adjustments.sepia}%</span>
            </div>
            <input
              id="slider-sepia"
              type="range"
              min="0"
              max="100"
              value={adjustments.sepia}
              onChange={(e) => handleSliderChange('sepia', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-6">
          <button
            id="btn-reset-filters"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            id="btn-apply-filters"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
