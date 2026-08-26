import {
  CollageConfig,
  GridTemplate,
  CellImage,
  TextOverlay,
  CellCoords,
} from '../types';
import { getCachedImage } from './imageUtils';

export interface RenderCellCalculated {
  cell: CellCoords;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function calculateCellDimensions(
  template: GridTemplate,
  canvasWidth: number,
  canvasHeight: number,
  gap: number,
  padding: number
): RenderCellCalculated[] {
  const innerWidth = Math.max(10, canvasWidth - padding * 2);
  const innerHeight = Math.max(10, canvasHeight - padding * 2);

  return template.cells.map((cell) => {
    // Exact gap calculation between adjacent partitions
    const hasLeftNeighbor = cell.x > 0.001;
    const hasRightNeighbor = cell.x + cell.w < 0.999;
    const hasTopNeighbor = cell.y > 0.001;
    const hasBottomNeighbor = cell.y + cell.h < 0.999;

    const left = padding + cell.x * innerWidth + (hasLeftNeighbor ? gap / 2 : 0);
    const right =
      padding + (cell.x + cell.w) * innerWidth - (hasRightNeighbor ? gap / 2 : 0);
    const top = padding + cell.y * innerHeight + (hasTopNeighbor ? gap / 2 : 0);
    const bottom =
      padding + (cell.y + cell.h) * innerHeight - (hasBottomNeighbor ? gap / 2 : 0);

    const w = Math.max(0, right - left);
    const h = Math.max(0, bottom - top);

    return {
      cell,
      x: left,
      y: top,
      w,
      h,
    };
  });
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: CollageConfig
) {
  const { background } = config;
  ctx.save();

  if (background.type === 'gradient' && background.gradient) {
    let grad: CanvasGradient;
    const { from, to, direction } = background.gradient;

    switch (direction) {
      case 'to-r':
        grad = ctx.createLinearGradient(0, 0, width, 0);
        break;
      case 'to-b':
        grad = ctx.createLinearGradient(0, 0, 0, height);
        break;
      case 'to-br':
        grad = ctx.createLinearGradient(0, 0, width, height);
        break;
      case 'to-tr':
        grad = ctx.createLinearGradient(0, height, width, 0);
        break;
      case 'radial':
        grad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          10,
          width / 2,
          height / 2,
          Math.max(width, height) / 1.4
        );
        break;
      default:
        grad = ctx.createLinearGradient(0, 0, width, height);
    }
    grad.addColorStop(0, from);
    grad.addColorStop(1, to);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === 'pattern') {
    ctx.fillStyle = background.color || '#18181b';
    ctx.fillRect(0, 0, width, height);

    // Render subtle decorative pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    const step = 24;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else {
    // Solid background
    ctx.fillStyle = background.color || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

/**
 * Render the entire collage onto a target Canvas context
 */
export async function renderCollage(
  canvas: HTMLCanvasElement,
  template: GridTemplate,
  cellImages: Record<string, CellImage | undefined>,
  config: CollageConfig,
  textOverlays: TextOverlay[],
  options: {
    selectedCellId?: string | null;
    selectedTextId?: string | null;
    isExport?: boolean;
    scaleMultiplier?: number;
    logicalWidth?: number;
    logicalHeight?: number;
  } = {}
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = options.logicalWidth || canvas.width;
  const height = options.logicalHeight || canvas.height;
  const scale = options.scaleMultiplier || (width / 600);

  // Scale adjusted spacing
  const gap = config.gap * scale;
  const padding = config.padding * scale;
  const borderRadius = config.borderRadius * scale;

  ctx.save();

  // If logical dimensions differ from physical canvas dimensions (High-DPI / Retina screens)
  if (options.logicalWidth && canvas.width !== options.logicalWidth) {
    const dprX = canvas.width / options.logicalWidth;
    const dprY = canvas.height / options.logicalHeight!;
    ctx.scale(dprX, dprY);
  }

  ctx.clearRect(0, 0, width, height);

  // 1. Draw Canvas Background
  drawBackground(ctx, width, height, config);

  // 2. Calculate cell bounds
  const calculatedCells = calculateCellDimensions(
    template,
    width,
    height,
    gap,
    padding
  );

  // 3. Draw each cell
  for (const item of calculatedCells) {
    const { cell, x, y, w, h } = item;
    if (w <= 0 || h <= 0) continue;

    const imgData = cellImages[cell.id];
    const isSelected = !options.isExport && options.selectedCellId === cell.id;

    ctx.save();

    // Cell drop shadow
    if (config.shadow > 0) {
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.15)';
      ctx.shadowBlur = config.shadow * scale * 1.5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = config.shadow * scale * 0.75;
      ctx.fillStyle = '#f8fafc';
      drawRoundedRectPath(ctx, x, y, w, h, borderRadius);
      ctx.fill();
      ctx.restore();
    }

    // Clip to cell rounded rectangle
    drawRoundedRectPath(ctx, x, y, w, h, borderRadius);
    ctx.clip();

    if (imgData && imgData.src) {
      try {
        const img = await getCachedImage(imgData.src);

        // Account for rotation when computing cover aspect ratio
        const isRotated90 = imgData.rotation === 90 || imgData.rotation === 270;
        const naturalW = isRotated90 ? img.naturalHeight : img.naturalWidth;
        const naturalH = isRotated90 ? img.naturalWidth : img.naturalHeight;

        // Object-fit: cover scaling
        const baseCoverScale = Math.max(w / naturalW, h / naturalH);
        const effectiveScale = baseCoverScale * (imgData.zoom || 1);

        const renderW = img.naturalWidth * effectiveScale;
        const renderH = img.naturalHeight * effectiveScale;

        // Panning offset bounds
        const maxPanX = Math.max(0, (isRotated90 ? renderH : renderW) - w) / 2;
        const maxPanY = Math.max(0, (isRotated90 ? renderW : renderH) - h) / 2;

        const panOffsetX = (imgData.panX || 0) * maxPanX;
        const panOffsetY = (imgData.panY || 0) * maxPanY;

        const centerX = x + w / 2 + panOffsetX;
        const centerY = y + h / 2 + panOffsetY;

        ctx.save();
        ctx.translate(centerX, centerY);

        if (imgData.rotation) {
          ctx.rotate((imgData.rotation * Math.PI) / 180);
        }
        if (imgData.flipH || imgData.flipV) {
          ctx.scale(imgData.flipH ? -1 : 1, imgData.flipV ? -1 : 1);
        }

        // Apply filters
        const adj = imgData.adjustments;
        if (adj) {
          const filterStr = `brightness(${100 + adj.brightness}%) contrast(${100 + adj.contrast}%) saturate(${100 + adj.saturation}%) grayscale(${adj.grayscale}%) sepia(${adj.sepia}%) blur(${adj.blur * scale}px)`;
          ctx.filter = filterStr;
        }

        ctx.drawImage(
          img,
          -renderW / 2,
          -renderH / 2,
          renderW,
          renderH
        );

        ctx.restore();
      } catch (err) {
        // Draw placeholder on error
        drawEmptyCellPlaceholder(ctx, x, y, w, h, isSelected, scale);
      }
    } else {
      // Draw empty cell placeholder
      drawEmptyCellPlaceholder(ctx, x, y, w, h, isSelected, scale);
    }

    ctx.restore();

    // Draw active cell selection border
    if (isSelected) {
      ctx.save();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = Math.max(2, 3 * scale);
      drawRoundedRectPath(ctx, x, y, w, h, borderRadius);
      ctx.stroke();
      ctx.restore();
    }
  }

  // 4. Draw Text Overlays
  for (const textItem of textOverlays) {
    if (!textItem.text.trim()) continue;

    ctx.save();

    const isTextSelected = !options.isExport && options.selectedTextId === textItem.id;
    const posX = textItem.x * width;
    const posY = textItem.y * height;
    const fontSize = textItem.fontSize * scale;

    ctx.translate(posX, posY);
    if (textItem.rotation) {
      ctx.rotate((textItem.rotation * Math.PI) / 180);
    }

    const fontStyle = `${textItem.isItalic ? 'italic ' : ''}${textItem.isBold ? 'bold ' : ''}`;
    ctx.font = `${fontStyle}${fontSize}px ${textItem.fontFamily || 'Inter, sans-serif'}`;
    ctx.textAlign = textItem.align || 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(textItem.text);
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.2;

    // Optional background badge
    if (textItem.hasBackground && textItem.bgColor) {
      ctx.save();
      ctx.fillStyle = textItem.bgColor;
      const padX = fontSize * 0.4;
      const padY = fontSize * 0.25;

      let rectX = -textWidth / 2 - padX;
      if (textItem.align === 'left') rectX = -padX;
      if (textItem.align === 'right') rectX = -textWidth - padX;

      const rectY = -textHeight / 2 - padY;
      const rectW = textWidth + padX * 2;
      const rectH = textHeight + padY * 2;

      drawRoundedRectPath(ctx, rectX, rectY, rectW, rectH, 8 * scale);
      ctx.fill();
      ctx.restore();
    }

    // Shadow
    if (textItem.shadow) {
      ctx.shadowColor = textItem.shadowColor || 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 8 * scale;
      ctx.shadowOffsetX = 2 * scale;
      ctx.shadowOffsetY = 2 * scale;
    }

    ctx.fillStyle = textItem.color || '#ffffff';
    ctx.fillText(textItem.text, 0, 0);

    // Text selection outline
    if (isTextSelected) {
      ctx.restore();
      ctx.save();
      ctx.translate(posX, posY);
      if (textItem.rotation) {
        ctx.rotate((textItem.rotation * Math.PI) / 180);
      }
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1.5 * scale;
      ctx.setLineDash([4 * scale, 4 * scale]);
      const pad = 8 * scale;
      let boxX = -textWidth / 2 - pad;
      if (textItem.align === 'left') boxX = -pad;
      if (textItem.align === 'right') boxX = -textWidth - pad;
      ctx.strokeRect(boxX, -textHeight / 2 - pad, textWidth + pad * 2, textHeight + pad * 2);
      ctx.restore();
      continue;
    }

    ctx.restore();
  }

  // Restore the initial DPR transform save
  ctx.restore();
}

function drawEmptyCellPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  isSelected: boolean,
  scale: number
) {
  ctx.save();
  ctx.fillStyle = isSelected ? 'rgba(37, 99, 235, 0.06)' : 'rgba(241, 245, 249, 0.85)';
  ctx.fillRect(x, y, w, h);

  // Draw Plus / Add Icon
  const iconSize = Math.min(32 * scale, Math.min(w, h) * 0.25);
  if (iconSize > 12) {
    ctx.strokeStyle = isSelected ? '#2563eb' : 'rgba(148, 163, 184, 0.8)';
    ctx.lineWidth = 2 * scale;
    const cx = x + w / 2;
    const cy = y + h / 2;

    // Circle
    ctx.beginPath();
    ctx.arc(cx, cy, iconSize, 0, Math.PI * 2);
    ctx.stroke();

    // Plus sign
    const arm = iconSize * 0.45;
    ctx.beginPath();
    ctx.moveTo(cx - arm, cy);
    ctx.lineTo(cx + arm, cy);
    ctx.moveTo(cx, cy - arm);
    ctx.lineTo(cx, cy + arm);
    ctx.stroke();

    // Small label if space permits
    if (h > 90 * scale && w > 80 * scale) {
      ctx.font = `600 ${Math.max(10, 11 * scale)}px Inter, sans-serif`;
      ctx.fillStyle = isSelected ? '#2563eb' : 'rgba(100, 116, 139, 0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Click to add photo', cx, cy + iconSize + 6 * scale);
    }
  }

  ctx.restore();
}

/**
 * Generate high-res image Blob for export and sharing
 */
export async function exportCollageBlob(
  template: GridTemplate,
  cellImages: Record<string, CellImage | undefined>,
  config: CollageConfig,
  textOverlays: TextOverlay[],
  aspectRatioValue: number,
  quality: 'normal' | 'high' | 'ultra',
  format: 'png' | 'jpeg'
): Promise<Blob> {
  const targetLongestEdge = quality === 'ultra' ? 3000 : quality === 'high' ? 2048 : 1080;

  let exportW = targetLongestEdge;
  let exportH = targetLongestEdge;

  if (aspectRatioValue >= 1) {
    exportW = targetLongestEdge;
    exportH = Math.round(targetLongestEdge / aspectRatioValue);
  } else {
    exportH = targetLongestEdge;
    exportW = Math.round(targetLongestEdge * aspectRatioValue);
  }

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = exportW;
  exportCanvas.height = exportH;

  const scaleMultiplier = exportW / 600;

  await renderCollage(
    exportCanvas,
    template,
    cellImages,
    config,
    textOverlays,
    {
      isExport: true,
      scaleMultiplier,
    }
  );

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const qualityLevel = format === 'jpeg' ? 0.95 : undefined;

  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image blob'));
        }
      },
      mimeType,
      qualityLevel
    );
  });
}

/**
 * Generate high-res image data URL for export
 */
export async function exportCollageImage(
  template: GridTemplate,
  cellImages: Record<string, CellImage | undefined>,
  config: CollageConfig,
  textOverlays: TextOverlay[],
  aspectRatioValue: number,
  quality: 'normal' | 'high' | 'ultra',
  format: 'png' | 'jpeg'
): Promise<string> {
  const targetLongestEdge = quality === 'ultra' ? 3000 : quality === 'high' ? 2048 : 1080;

  let exportW = targetLongestEdge;
  let exportH = targetLongestEdge;

  if (aspectRatioValue >= 1) {
    exportW = targetLongestEdge;
    exportH = Math.round(targetLongestEdge / aspectRatioValue);
  } else {
    exportH = targetLongestEdge;
    exportW = Math.round(targetLongestEdge * aspectRatioValue);
  }

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = exportW;
  exportCanvas.height = exportH;

  const scaleMultiplier = exportW / 600;

  await renderCollage(
    exportCanvas,
    template,
    cellImages,
    config,
    textOverlays,
    {
      isExport: true,
      scaleMultiplier,
    }
  );

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const qualityLevel = format === 'jpeg' ? 0.95 : undefined;

  return exportCanvas.toDataURL(mimeType, qualityLevel);
}
