import React, { useState, useEffect } from 'react';
import {
  CollageConfig,
  GridTemplate,
  CellImage,
  TextOverlay,
  ExportQuality,
  ExportFormat,
} from '../types';
import { exportCollageImage } from '../utils/canvasRenderer';
import { ASPECT_RATIOS } from '../data/templates';
import {
  Download,
  Share2,
  X,
  Check,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: GridTemplate;
  cellImages: Record<string, CellImage | undefined>;
  config: CollageConfig;
  textOverlays: TextOverlay[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  template,
  cellImages,
  config,
  textOverlays,
}) => {
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [format, setFormat] = useState<ExportFormat>('png');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const currentRatioObj =
    ASPECT_RATIOS.find((r) => r.id === config.ratio) || ASPECT_RATIOS[0];

  // Generate preview when modal opens or settings change
  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setIsDownloaded(false);
      return;
    }

    let isCancelled = false;

    const generate = async () => {
      setIsGenerating(true);
      try {
        const dataUrl = await exportCollageImage(
          template,
          cellImages,
          config,
          textOverlays,
          currentRatioObj.ratio,
          quality,
          format
        );
        if (!isCancelled) {
          setPreviewUrl(dataUrl);
        }
      } catch (err) {
        console.error('Export failed:', err);
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    generate();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, template, cellImages, config, textOverlays, currentRatioObj.ratio, quality, format]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!previewUrl) return;

    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `photo-collage-${Date.now()}.${format === 'jpeg' ? 'jpg' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloaded(true);

    // Confetti effect
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleShare = async () => {
    if (!previewUrl) return;

    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const file = new File([blob], `collage.${format === 'jpeg' ? 'jpg' : 'png'}`, {
        type: blob.type,
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Photo Collage',
          text: 'Check out this photo collage created with Photo Collage Generator!',
        });
      } else {
        // Fallback: Copy to clipboard or trigger download
        handleDownload();
      }
    } catch (err) {
      console.error('Share error:', err);
      handleDownload();
    }
  };

  const dimensionLabel =
    quality === 'ultra'
      ? '3000px Longest Edge (Ultra 4K Print)'
      : quality === 'high'
      ? '2048px Longest Edge (High Resolution)'
      : '1080px Longest Edge (Standard Web)';

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="export-modal-card"
        className="bg-white border border-slate-200 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden p-6 text-slate-800 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Export & Download Collage</h3>
              <p className="text-[11px] text-slate-400">High-resolution export with crisp layout rendering</p>
            </div>
          </div>
          <button
            id="btn-close-export-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
          {/* Live Preview Container */}
          <div className="relative aspect-video max-h-[220px] w-full bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-3 shadow-inner">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2 text-blue-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-semibold">Rendering high resolution...</span>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Collage Preview"
                className="max-h-full max-w-full object-contain rounded-lg shadow-md border border-slate-200"
              />
            ) : (
              <span className="text-xs text-slate-400 font-medium">Generating preview...</span>
            )}
          </div>

          {/* Quality Options */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
              Resolution Quality
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-quality-high"
                onClick={() => setQuality('high')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  quality === 'high'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`font-semibold text-xs ${quality === 'high' ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>High (2048px)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Recommended</div>
              </button>

              <button
                id="btn-quality-normal"
                onClick={() => setQuality('normal')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  quality === 'normal'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`font-semibold text-xs ${quality === 'normal' ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>Normal (1080px)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Fast & Compact</div>
              </button>

              <button
                id="btn-quality-ultra"
                onClick={() => setQuality('ultra')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  quality === 'ultra'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`font-semibold text-xs ${quality === 'ultra' ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>Ultra (3000px)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">For High-DPI Prints</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{dimensionLabel}</p>
          </div>

          {/* Format Options */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
              Image Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-format-png"
                onClick={() => setFormat('png')}
                className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition-all cursor-pointer ${
                  format === 'png'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                PNG (Lossless & Crisp)
              </button>
              <button
                id="btn-format-jpeg"
                onClick={() => setFormat('jpeg')}
                className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition-all cursor-pointer ${
                  format === 'jpeg'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                JPG / JPEG (Small File Size)
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Ready for instant download</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                id="btn-share-collage"
                onClick={handleShare}
                disabled={isGenerating || !previewUrl}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            )}

            <button
              id="btn-download-final-collage"
              onClick={handleDownload}
              disabled={isGenerating || !previewUrl}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Collage
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
