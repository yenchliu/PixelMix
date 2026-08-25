import { CellImage, ImageAdjustments } from '../types';

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  grayscale: 0,
  sepia: 0,
  blur: 0,
};

/**
 * Downscale and optimize an image file on the client side
 * Prevents mobile memory exhaustion and ensures fast canvas rendering
 */
export async function processAndDownscaleImage(
  fileOrUrl: File | string,
  maxDimension = 2400
): Promise<{ dataUrl: string; width: number; height: number; name?: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl = '';
    let fileName = '';

    if (fileOrUrl instanceof File) {
      fileName = fileOrUrl.name;
      objectUrl = URL.createObjectURL(fileOrUrl);
      img.src = objectUrl;
    } else {
      img.src = fileOrUrl;
    }

    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calculate scaled dimensions while preserving aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Draw onto offscreen canvas to optimize and convert to data URL (prevent tainted canvas)
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const ctx = offscreenCanvas.getContext('2d');

      if (!ctx) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        resolve({
          dataUrl: img.src,
          width: img.naturalWidth,
          height: img.naturalHeight,
          name: fileName,
        });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const dataUrl = offscreenCanvas.toDataURL('image/jpeg', 0.92);
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        resolve({
          dataUrl,
          width,
          height,
          name: fileName,
        });
      } catch (err) {
        // Fallback in case of any conversion error
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        resolve({
          dataUrl: img.src,
          width,
          height,
          name: fileName,
        });
      }
    };

    img.onerror = (err) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
  });
}

export function createCellImage(
  id: string,
  dataUrl: string,
  width: number,
  height: number,
  name?: string
): CellImage {
  return {
    id,
    src: dataUrl,
    name,
    originalWidth: width,
    originalHeight: height,
    panX: 0,
    panY: 0,
    zoom: 1,
    rotation: 0,
    flipH: false,
    flipV: false,
    adjustments: { ...DEFAULT_ADJUSTMENTS },
  };
}

/**
 * Cached HTMLImageElement loader for smooth 60fps canvas rendering
 */
const imageCache = new Map<string, HTMLImageElement>();

export function getCachedImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth !== 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}
