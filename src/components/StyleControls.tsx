import React from 'react';
import { CollageConfig, BackgroundType } from '../types';
import { COLOR_PALETTES, GRADIENT_PRESETS } from '../data/templates';
import { Sliders, Palette, Sparkles, Grid } from 'lucide-react';

interface StyleControlsProps {
  config: CollageConfig;
  onChangeConfig: (updates: Partial<CollageConfig>) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  config,
  onChangeConfig,
}) => {
  const handleBgTypeChange = (type: BackgroundType) => {
    if (type === 'solid') {
      onChangeConfig({
        background: {
          type: 'solid',
          color: config.background.color || '#ffffff',
        },
      });
    } else if (type === 'gradient') {
      onChangeConfig({
        background: {
          type: 'gradient',
          color: config.background.color,
          gradient: config.background.gradient || GRADIENT_PRESETS[0],
        },
      });
    } else if (type === 'pattern') {
      onChangeConfig({
        background: {
          type: 'pattern',
          color: '#18181b',
          pattern: 'grid',
        },
      });
    }
  };

  const handleSolidColorSelect = (color: string) => {
    onChangeConfig({
      background: {
        type: 'solid',
        color,
      },
    });
  };

  const handleGradientSelect = (gradient: (typeof GRADIENT_PRESETS)[0]) => {
    onChangeConfig({
      background: {
        type: 'gradient',
        color: gradient.from,
        gradient,
      },
    });
  };

  return (
    <div id="style-controls-container" className="space-y-5">
      {/* Spacing & Borders Section */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          Spacing & Corners
        </label>

        <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 space-y-4">
          {/* Inner Grid Gap */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">Inner Spacing (Gap)</span>
              <span className="font-mono text-slate-600 font-semibold">{config.gap}px</span>
            </div>
            <input
              id="slider-config-gap"
              type="range"
              min="0"
              max="36"
              value={config.gap}
              onChange={(e) => onChangeConfig({ gap: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Outer Border Padding */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">Outer Border (Padding)</span>
              <span className="font-mono text-slate-600 font-semibold">{config.padding}px</span>
            </div>
            <input
              id="slider-config-padding"
              type="range"
              min="0"
              max="48"
              value={config.padding}
              onChange={(e) => onChangeConfig({ padding: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Corner Roundness (Border Radius) */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">Corner Roundness (Radius)</span>
              <span className="font-mono text-slate-600 font-semibold">{config.borderRadius}px</span>
            </div>
            <input
              id="slider-config-radius"
              type="range"
              min="0"
              max="36"
              value={config.borderRadius}
              onChange={(e) => onChangeConfig({ borderRadius: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Cell Elevation / Drop Shadow */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">Cell Shadow</span>
              <span className="font-mono text-slate-600 font-semibold">{config.shadow}px</span>
            </div>
            <input
              id="slider-config-shadow"
              type="range"
              min="0"
              max="20"
              value={config.shadow}
              onChange={(e) => onChangeConfig({ shadow: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Background Styling Section */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          Background Canvas
        </label>

        {/* BG Type Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium gap-1">
          <button
            id="tab-bg-solid"
            onClick={() => handleBgTypeChange('solid')}
            className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
              config.background.type === 'solid'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Solid Color
          </button>
          <button
            id="tab-bg-gradient"
            onClick={() => handleBgTypeChange('gradient')}
            className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
              config.background.type === 'gradient'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Gradients
          </button>
          <button
            id="tab-bg-pattern"
            onClick={() => handleBgTypeChange('pattern')}
            className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
              config.background.type === 'pattern'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pattern
          </button>
        </div>

        {/* Solid Color Palettes */}
        {config.background.type === 'solid' && (
          <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Preset Palettes</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-700 font-semibold">
                  {config.background.color}
                </span>
                <input
                  id="color-picker-custom"
                  type="color"
                  value={config.background.color || '#ffffff'}
                  onChange={(e) => handleSolidColorSelect(e.target.value)}
                  className="w-6 h-6 rounded border border-slate-300 bg-transparent cursor-pointer"
                  title="Custom Color Picker"
                />
              </div>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {COLOR_PALETTES.map((color) => (
                <button
                  key={color}
                  id={`btn-color-${color.replace('#', '')}`}
                  onClick={() => handleSolidColorSelect(color)}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${
                    config.background.color?.toLowerCase() === color.toLowerCase()
                      ? 'border-blue-600 scale-110 shadow-sm ring-2 ring-blue-500/30'
                      : 'border-slate-300/80 hover:scale-105'
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Gradient Presets */}
        {config.background.type === 'gradient' && (
          <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {GRADIENT_PRESETS.map((grad) => {
                const isSelected =
                  config.background.gradient?.from === grad.from &&
                  config.background.gradient?.to === grad.to;

                return (
                  <button
                    key={grad.name}
                    id={`btn-gradient-${grad.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleGradientSelect(grad)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/90 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg shrink-0 shadow-inner border border-black/5"
                      style={{
                        background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                      }}
                    />
                    <div className="truncate">
                      <div className={`text-xs truncate ${isSelected ? 'font-bold text-blue-900' : 'font-semibold text-slate-800'}`}>
                        {grad.name}
                      </div>
                      <div className="text-[10px] text-slate-400">Gradient</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pattern Background */}
        {config.background.type === 'pattern' && (
          <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <Grid className="w-4 h-4" />
              <span>Subtle Blueprint Grid Pattern</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Applies a clean, fine geometric blueprint grid backdrop that gives photos a stylish studio aesthetic.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
