import React, { useState, useEffect } from 'react';
import {
  CollageConfig,
  GridTemplate,
  CellImage,
  TextOverlay,
  ExportQuality,
  ExportFormat,
} from '../types';
import { exportCollageImage, exportCollageBlob } from '../utils/canvasRenderer';
import { ASPECT_RATIOS } from '../data/templates';
import {
  Download,
  Share2,
  X,
  Check,
  Smartphone,
  Loader2,
  FileCheck,
  Copy,
  ExternalLink,
  Info,
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
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const currentRatioObj =
    ASPECT_RATIOS.find((r) => r.id === config.ratio) || ASPECT_RATIOS[0];

  const isMobile =
    typeof navigator !== 'undefined' &&
    (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));

  // Generate high-res image & blob when modal opens or settings change
  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setImageBlob(null);
      setIsSaved(false);
      setIsCopied(false);
      setStatusMessage(null);
      return;
    }

    let isCancelled = false;

    const generate = async () => {
      setIsGenerating(true);
      setStatusMessage(null);
      try {
        const [dataUrl, blob] = await Promise.all([
          exportCollageImage(
            template,
            cellImages,
            config,
            textOverlays,
            currentRatioObj.ratio,
            quality,
            format
          ),
          exportCollageBlob(
            template,
            cellImages,
            config,
            textOverlays,
            currentRatioObj.ratio,
            quality,
            format
          ),
        ]);

        if (!isCancelled) {
          setPreviewUrl(dataUrl);
          setImageBlob(blob);
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

  const getFilename = () => {
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    return `photo-collage-${Date.now()}.${ext}`;
  };

  // Direct file download fallback
  const triggerFileDownload = () => {
    if (!previewUrl) return;

    try {
      const filename = getFilename();
      const link = document.createElement('a');

      if (imageBlob) {
        const objectUrl = URL.createObjectURL(imageBlob);
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(objectUrl);
        }, 1000);
      } else {
        link.href = previewUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setIsSaved(true);
      setStatusMessage('圖片已開始下載！');

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      console.error('Download error:', e);
      // Fallback: open in new tab
      if (previewUrl) {
        window.open(previewUrl, '_blank');
      }
    }
  };

  // Save directly to mobile Camera Roll / Photos via native Web Share API
  const handleSaveToCameraRoll = async () => {
    if (!imageBlob && !previewUrl) return;

    const filename = getFilename();
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

    try {
      // 1. Prepare File Object
      let file: File;
      if (imageBlob) {
        file = new File([imageBlob], filename, { type: mimeType });
      } else if (previewUrl) {
        const res = await fetch(previewUrl);
        const b = await res.blob();
        file = new File([b], filename, { type: mimeType });
      } else {
        return;
      }

      // 2. Check if native Web Share with files is supported (iOS Safari / Android Chrome)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Photo Collage',
          text: 'Check out my collage!',
        });

        setIsSaved(true);
        setStatusMessage('已成功呼叫相簿儲存面板！');

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        // Fallback to standard download if share is not available
        triggerFileDownload();
      }
    } catch (err: unknown) {
      // User cancelled share dialog or permission denied
      if (err instanceof Error && err.name !== 'AbortError') {
        console.warn('Share error, falling back to download:', err);
        triggerFileDownload();
      }
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!imageBlob && !previewUrl) return;

    try {
      let blobToCopy = imageBlob;
      if (!blobToCopy && previewUrl) {
        const res = await fetch(previewUrl);
        blobToCopy = await res.blob();
      }

      if (blobToCopy && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        // Most browsers require PNG format for clipboard
        const item = new ClipboardItem({ [blobToCopy.type]: blobToCopy });
        await navigator.clipboard.write([item]);
        setIsCopied(true);
        setStatusMessage('已複製圖片至剪貼簿！可直接貼上分享。');
        setTimeout(() => setIsCopied(false), 3000);
      } else {
        triggerFileDownload();
      }
    } catch (e) {
      console.warn('Clipboard write failed:', e);
      triggerFileDownload();
    }
  };

  // Open high-res image in new tab for manual long-press saving
  const handleOpenInNewTab = () => {
    if (!previewUrl) return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<html><head><title>Photo Collage Export</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#111;min-height:100vh;"><img src="${previewUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;" alt="Photo Collage"/></body></html>`
      );
      newWindow.document.close();
    }
  };

  const dimensionLabel =
    quality === 'ultra'
      ? '3000px Longest Edge (Ultra 4K Print / 超高解析度)'
      : quality === 'high'
      ? '2048px Longest Edge (High Resolution / 推薦高畫質)'
      : '1080px Longest Edge (Standard Web / 標準畫質)';

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div
        id="export-modal-card"
        className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 text-slate-800 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {isMobile ? '儲存至手機相簿 (Save to Photos)' : '匯出與下載拼貼 (Export Collage)'}
              </h3>
              <p className="text-[11px] text-slate-400">高解析度渲染輸出與無損畫質儲存</p>
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
        <div className="flex-1 overflow-y-auto my-3 sm:my-4 space-y-3 sm:space-y-4 pr-1">
          {/* Mobile Camera Roll Hint Card */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5 sm:p-3 text-xs text-blue-900 flex items-start gap-2.5 shadow-2xs">
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] sm:text-xs leading-relaxed">
              <span className="font-bold text-blue-950">手機存圖方式：</span>
              點擊下方「<span className="font-bold text-blue-700">儲存至相簿</span>」按鈕並在系統選單選擇「<span className="font-bold text-blue-700">儲存影像</span>」；或是直接<span className="font-bold text-blue-700">長按下方圖片</span>選擇「加入照片」即可存入相機膠卷。
            </div>
          </div>

          {/* Live Preview Container */}
          <div className="relative aspect-video max-h-[200px] sm:max-h-[220px] w-full bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2 shadow-inner group">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2 text-blue-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-semibold">正在渲染高畫質圖片...</span>
              </div>
            ) : previewUrl ? (
              <div className="relative flex items-center justify-center h-full w-full">
                <img
                  src={previewUrl}
                  alt="Collage Preview"
                  className="max-h-full max-w-full object-contain rounded-lg shadow-md border border-slate-200 select-none cursor-pointer"
                  style={{
                    WebkitTouchCallout: 'default',
                    userSelect: 'auto',
                  }}
                  title="長按可直接儲存至相簿"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  長按圖片亦可儲存
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium">生成預覽中...</span>
            )}
          </div>

          {/* Quality Options */}
          <div>
            <label className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              匯出畫質 (Resolution Quality)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-quality-high"
                onClick={() => setQuality('high')}
                className={`p-2 sm:p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  quality === 'high'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`font-semibold text-xs ${quality === 'high' ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>High (2048px)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">推薦高畫質</div>
              </button>

              <button
                id="btn-quality-normal"
                onClick={() => setQuality('normal')}
                className={`p-2 sm:p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  quality === 'normal'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`font-semibold text-xs ${quality === 'normal' ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>Normal (1080px)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">快速下載</div>
              </button>

              <button
                id="btn-quality-ultra"
                onClick={() => setQuality('ultra')}
                className={`p-2 sm:p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  quality === 'ultra'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`font-semibold text-xs ${quality === 'ultra' ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>Ultra (3000px)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">印刷級 4K</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{dimensionLabel}</p>
          </div>

          {/* Format Options */}
          <div>
            <label className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              圖片格式 (Image Format)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-format-png"
                onClick={() => setFormat('png')}
                className={`p-2 sm:p-2.5 rounded-lg border text-center text-xs font-semibold transition-all cursor-pointer ${
                  format === 'png'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                PNG (無損超清晰)
              </button>
              <button
                id="btn-format-jpeg"
                onClick={() => setFormat('jpeg')}
                className={`p-2 sm:p-2.5 rounded-lg border text-center text-xs font-semibold transition-all cursor-pointer ${
                  format === 'jpeg'
                    ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-600'
                }`}
              >
                JPG / JPEG (檔案較小)
              </button>
            </div>
          </div>
        </div>

        {/* Status Message if any */}
        {statusMessage && (
          <div className="mb-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] sm:text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 sm:pt-4 border-t border-slate-200 flex flex-col gap-2.5 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Secondary tool buttons */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-copy-collage"
                onClick={handleCopyImage}
                disabled={isGenerating || !previewUrl}
                title="複製圖片至剪貼簿"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{isCopied ? '已複製' : '複製'}</span>
              </button>

              <button
                id="btn-open-new-tab"
                onClick={handleOpenInNewTab}
                disabled={isGenerating || !previewUrl}
                title="在新分頁開啟原圖"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="text-[11px]">新分頁檢視</span>
              </button>

              <button
                id="btn-download-file-direct"
                onClick={triggerFileDownload}
                disabled={isGenerating || !previewUrl}
                title="直接下載圖檔至裝置"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px]">下載檔案</span>
              </button>
            </div>

            {/* Primary Action Button: Save to Photos (Mobile) or Download (Desktop) */}
            <div className="flex-1 sm:flex-initial flex items-center gap-2">
              <button
                id="btn-save-camera-roll"
                onClick={handleSaveToCameraRoll}
                disabled={isGenerating || !previewUrl}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>已完成儲存！</span>
                  </>
                ) : isMobile ? (
                  <>
                    <Smartphone className="w-4 h-4 text-white" />
                    <span>儲存至手機相簿 (Save to Photos)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-white" />
                    <span>下載拼貼照片 (Download)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

