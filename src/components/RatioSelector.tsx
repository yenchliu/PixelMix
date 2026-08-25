import React from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../data/templates';
import {
  Square,
  Monitor,
  Image as ImageIcon,
  Camera,
  Tv,
  Smartphone,
  RectangleVertical,
} from 'lucide-react';

interface RatioSelectorProps {
  currentRatio: AspectRatio;
  onSelectRatio: (ratio: AspectRatio) => void;
}

const ICONS: Record<string, React.ElementType> = {
  Square,
  Monitor,
  Image: ImageIcon,
  Camera,
  Tv,
  Smartphone,
  RectangleVertical,
};

export const RatioSelector: React.FC<RatioSelectorProps> = ({
  currentRatio,
  onSelectRatio,
}) => {
  return (
    <div id="ratio-selector-container" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Canvas Aspect Ratio
        </label>
        <span className="text-[11px] font-mono text-blue-700 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
          {currentRatio}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ASPECT_RATIOS.map((item) => {
          const IconComponent = ICONS[item.icon] || Square;
          const isSelected = currentRatio === item.id;

          return (
            <button
              key={item.id}
              id={`btn-ratio-${item.id.replace(':', '-')}`}
              onClick={() => onSelectRatio(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/30 font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 shrink-0 ${
                  isSelected ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <div className="truncate">
                <div className={`leading-tight ${isSelected ? 'text-blue-900 font-bold' : 'text-slate-800 font-semibold'}`}>
                  {item.id}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {item.label.split(' ')[1] || item.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
