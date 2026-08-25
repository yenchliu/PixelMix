import React, { useState } from 'react';
import { GridTemplate } from '../types';
import { TEMPLATES } from '../data/templates';
import { LayoutGrid, Layers } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: GridTemplate) => void;
  currentPhotoCount?: number;
}

const PHOTO_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
  const [filterCount, setFilterCount] = useState<number | 'all'>(selectedTemplate.photoCount);

  const filteredTemplates =
    filterCount === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.photoCount === filterCount);

  return (
    <div id="template-selector-container" className="space-y-3.5">
      {/* Header & Filter Pills */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            Grid Template
          </label>
          <span className="text-[11px] text-slate-400 font-medium">
            {filteredTemplates.length} layouts
          </span>
        </div>

        {/* Photo Count Filter Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          <button
            id="filter-count-all"
            onClick={() => setFilterCount('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterCount === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/80'
            }`}
          >
            All
          </button>
          {PHOTO_COUNTS.map((count) => (
            <button
              key={count}
              id={`filter-count-${count}`}
              onClick={() => setFilterCount(count)}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterCount === count
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/80'
              }`}
            >
              {count} {count === 1 ? 'Photo' : 'Photos'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Layout Preview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
        {filteredTemplates.map((template) => {
          const isSelected = template.id === selectedTemplateId;

          return (
            <button
              key={template.id}
              id={`btn-template-${template.id}`}
              onClick={() => onSelectTemplate(template)}
              className={`group flex flex-col items-center p-2 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500/20'
                  : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200'
              }`}
            >
              {/* Miniature CSS Grid Diagram */}
              <div
                className={`relative w-full aspect-square rounded-lg p-1.5 overflow-hidden mb-2 transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-2 border-solid border-blue-600'
                    : 'bg-slate-100/80 border-2 border-dashed border-slate-300'
                }`}
              >
                <div className="relative w-full h-full">
                  {template.cells.map((cell, idx) => (
                    <div
                      key={cell.id || idx}
                      className={`absolute rounded-[2px] transition-colors ${
                        isSelected
                          ? 'bg-blue-200/90 border border-blue-400/60'
                          : 'bg-slate-300/80 group-hover:bg-slate-400/80 border border-slate-300'
                      }`}
                      style={{
                        left: `${cell.x * 100}%`,
                        top: `${cell.y * 100}%`,
                        width: `${cell.w * 100}%`,
                        height: `${cell.h * 100}%`,
                        padding: '1px',
                        boxSizing: 'border-box',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Template Name & Count */}
              <div className="w-full text-center">
                <div className={`text-xs truncate ${isSelected ? 'font-bold text-blue-900' : 'font-semibold text-slate-800'}`}>
                  {template.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {template.photoCount} {template.photoCount === 1 ? 'slot' : 'slots'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
