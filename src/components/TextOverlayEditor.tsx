import React from 'react';
import { TextOverlay } from '../types';
import { FONT_FAMILIES, COLOR_PALETTES } from '../data/templates';
import {
  Type,
  Plus,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Layers,
  Move,
} from 'lucide-react';

interface TextOverlayEditorProps {
  textOverlays: TextOverlay[];
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onAddText: () => void;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
  onDeleteText: (id: string) => void;
}

export const TextOverlayEditor: React.FC<TextOverlayEditorProps> = ({
  textOverlays,
  selectedTextId,
  onSelectText,
  onAddText,
  onUpdateText,
  onDeleteText,
}) => {
  const activeText = textOverlays.find((t) => t.id === selectedTextId) || textOverlays[0];

  return (
    <div id="text-overlay-editor-container" className="space-y-4">
      {/* Header & Add Text Button */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-blue-600" />
          Text Overlays ({textOverlays.length})
        </label>
        <button
          id="btn-add-new-text"
          onClick={onAddText}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Text
        </button>
      </div>

      {textOverlays.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-6 text-center text-xs text-slate-500">
          <Type className="w-6 h-6 mx-auto mb-2 text-slate-400" />
          <p className="font-semibold text-slate-800">No Text Added</p>
          <p className="text-[11px] text-slate-400 mt-1 mb-3">
            Add titles, dates, locations, or quotes directly onto your collage canvas.
          </p>
          <button
            id="btn-add-first-text"
            onClick={onAddText}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 text-blue-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            + Add Heading
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Text Layer Tabs if multiple */}
          {textOverlays.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {textOverlays.map((layer, index) => {
                const isSelected = layer.id === (activeText?.id || '');
                return (
                  <button
                    key={layer.id}
                    id={`btn-select-text-layer-${index}`}
                    onClick={() => onSelectText(layer.id)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold truncate max-w-[120px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {layer.text || `Text #${index + 1}`}
                  </button>
                );
              })}
            </div>
          )}

          {activeText && (
            <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 space-y-4">
              {/* Text Input */}
              <div>
                <label className="text-[11px] font-medium text-slate-600 mb-1.5 block">
                  Text Content
                </label>
                <input
                  id="input-text-content"
                  type="text"
                  value={activeText.text}
                  onChange={(e) => onUpdateText(activeText.id, { text: e.target.value })}
                  placeholder="Enter custom title or caption..."
                  className="w-full bg-white border border-slate-200 focus:border-blue-600 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Font Family Selector */}
              <div>
                <label className="text-[11px] font-medium text-slate-600 mb-1.5 block">
                  Typography Style
                </label>
                <select
                  id="select-font-family"
                  value={activeText.fontFamily}
                  onChange={(e) =>
                    onUpdateText(activeText.id, { fontFamily: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.name} value={f.family}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size & Rotation Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Font Size</span>
                    <span className="font-mono text-slate-700 font-semibold">{activeText.fontSize}px</span>
                  </div>
                  <input
                    id="slider-text-font-size"
                    type="range"
                    min="14"
                    max="96"
                    value={activeText.fontSize}
                    onChange={(e) =>
                      onUpdateText(activeText.id, { fontSize: Number(e.target.value) })
                    }
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Rotation</span>
                    <span className="font-mono text-slate-700 font-semibold">{activeText.rotation}°</span>
                  </div>
                  <input
                    id="slider-text-rotation"
                    type="range"
                    min="-180"
                    max="180"
                    value={activeText.rotation}
                    onChange={(e) =>
                      onUpdateText(activeText.id, { rotation: Number(e.target.value) })
                    }
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Formatting Actions: Bold, Italic, Align, Shadow */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    id="btn-text-bold"
                    onClick={() => onUpdateText(activeText.id, { isBold: !activeText.isBold })}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                      activeText.isBold
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id="btn-text-italic"
                    onClick={() =>
                      onUpdateText(activeText.id, { isItalic: !activeText.isItalic })
                    }
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                      activeText.isItalic
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    id="btn-text-align-left"
                    onClick={() => onUpdateText(activeText.id, { align: 'left' })}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                      activeText.align === 'left'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id="btn-text-align-center"
                    onClick={() => onUpdateText(activeText.id, { align: 'center' })}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                      activeText.align === 'center'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id="btn-text-align-right"
                    onClick={() => onUpdateText(activeText.id, { align: 'right' })}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                      activeText.align === 'right'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  id="btn-text-shadow-toggle"
                  onClick={() => onUpdateText(activeText.id, { shadow: !activeText.shadow })}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                    activeText.shadow
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Shadow
                </button>
              </div>

              {/* Color Palettes & Background Pill Toggle */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium">Text Color</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-700 font-semibold">{activeText.color}</span>
                    <input
                      id="input-custom-text-color"
                      type="color"
                      value={activeText.color}
                      onChange={(e) =>
                        onUpdateText(activeText.id, { color: e.target.value })
                      }
                      className="w-5 h-5 rounded border border-slate-300 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-1.5">
                  {COLOR_PALETTES.slice(0, 16).map((color) => (
                    <button
                      key={color}
                      id={`btn-text-color-${color.replace('#', '')}`}
                      onClick={() => onUpdateText(activeText.id, { color })}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-lg border transition-all cursor-pointer ${
                        activeText.color.toLowerCase() === color.toLowerCase()
                          ? 'border-blue-600 scale-110 shadow-sm ring-2 ring-blue-500/30'
                          : 'border-slate-300/80 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Background badge toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <label className="text-slate-700 font-medium">Background Badge</label>
                <div className="flex items-center gap-2">
                  {activeText.hasBackground && (
                    <input
                      id="input-text-badge-color"
                      type="color"
                      value={activeText.bgColor || '#000000'}
                      onChange={(e) =>
                        onUpdateText(activeText.id, { bgColor: e.target.value })
                      }
                      className="w-5 h-5 rounded border border-slate-300 bg-transparent cursor-pointer"
                    />
                  )}
                  <button
                    id="btn-toggle-badge"
                    onClick={() =>
                      onUpdateText(activeText.id, {
                        hasBackground: !activeText.hasBackground,
                        bgColor: activeText.bgColor || 'rgba(0,0,0,0.65)',
                      })
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeText.hasBackground
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {activeText.hasBackground ? 'Enabled' : 'Off'}
                  </button>
                </div>
              </div>

              {/* Delete Layer button */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Move className="w-3 h-3" />
                  Drag text on canvas to position
                </span>
                <button
                  id="btn-delete-text-overlay"
                  onClick={() => onDeleteText(activeText.id)}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
