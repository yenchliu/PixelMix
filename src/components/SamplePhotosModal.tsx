import React from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_PHOTOS, SamplePhoto } from '../data/samplePhotos';

interface SamplePhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: SamplePhoto) => void;
  onFillAllWithSamples: () => void;
  cellCount: number;
}

export const SamplePhotosModal: React.FC<SamplePhotosModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  onFillAllWithSamples,
  cellCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="sample-photos-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="sample-photos-modal-card"
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden p-6 text-slate-800 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Sample Photo Library</h3>
              <p className="text-[11px] text-slate-400">High-definition curated royalty-free photography</p>
            </div>
          </div>
          <button
            id="btn-close-samples-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4 p-3.5 bg-blue-50/60 rounded-lg border border-blue-200/80 shrink-0">
          <div>
            <p className="text-xs font-bold text-blue-900">Quick Auto-Fill</p>
            <p className="text-[11px] text-blue-700/80">
              Instantly populate all {cellCount} slots with aesthetic sample photography.
            </p>
          </div>
          <button
            id="btn-fill-all-samples"
            onClick={() => {
              onFillAllWithSamples();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            ✨ Fill All {cellCount} Slots
          </button>
        </div>

        {/* Photos Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <label className="text-xs font-semibold text-slate-500 mb-2.5 block uppercase tracking-wider">
            Select Individual Photo
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SAMPLE_PHOTOS.map((photo) => (
              <div
                key={photo.id}
                id={`sample-card-${photo.id}`}
                onClick={() => {
                  onSelectPhoto(photo);
                  onClose();
                }}
                className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 hover:border-blue-600 cursor-pointer transition-all hover:scale-[1.02] shadow-xs"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-[11px] font-semibold text-white truncate leading-tight">
                    {photo.title}
                  </div>
                  <div className="text-[9px] text-slate-300 font-medium">
                    {photo.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
