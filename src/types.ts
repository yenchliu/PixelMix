export type AspectRatio = '1:1' | '4:3' | '7:5' | '3:2' | '16:9' | '9:16' | '3:4';

export interface CellCoords {
  id: string;
  x: number; // 0 to 1
  y: number; // 0 to 1
  w: number; // 0 to 1
  h: number; // 0 to 1
}

export interface GridTemplate {
  id: string;
  name: string;
  photoCount: number;
  cells: CellCoords[];
  iconType?: string;
}

export interface ImageAdjustments {
  brightness: number; // -100 to 100 (default 0)
  contrast: number; // -100 to 100 (default 0)
  saturation: number; // -100 to 100 (default 0)
  grayscale: number; // 0 to 100 (default 0)
  sepia: number; // 0 to 100 (default 0)
  blur: number; // 0 to 10 (default 0)
}

export interface CellImage {
  id: string;
  src: string;
  name?: string;
  originalWidth: number;
  originalHeight: number;
  panX: number; // -1 to 1 offset relative to cover width
  panY: number; // -1 to 1 offset relative to cover height
  zoom: number; // 1.0 to 4.0
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  adjustments: ImageAdjustments;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number; // 0 to 1 relative to canvas
  y: number; // 0 to 1 relative to canvas
  fontSize: number; // in relative scale (14..120)
  fontFamily: string;
  color: string;
  bgColor: string; // transparent or rgba / hex
  hasBackground: boolean;
  isBold: boolean;
  isItalic: boolean;
  shadow: boolean;
  shadowColor: string;
  align: 'left' | 'center' | 'right';
  rotation: number; // degrees -180 to 180
}

export type BackgroundType = 'solid' | 'gradient' | 'pattern';

export interface BackgroundConfig {
  type: BackgroundType;
  color: string;
  gradient?: {
    from: string;
    to: string;
    direction: 'to-r' | 'to-b' | 'to-br' | 'to-tr' | 'radial';
  };
  pattern?: string; // 'dots' | 'grid' | 'stripes' | 'noise'
}

export interface CollageConfig {
  ratio: AspectRatio;
  templateId: string;
  gap: number; // 0 to 40 px in reference scale
  padding: number; // 0 to 50 px outer margin
  borderRadius: number; // 0 to 40 px corner radius
  shadow: number; // 0 to 20 px cell elevation
  background: BackgroundConfig;
}

export type ExportQuality = 'normal' | 'high' | 'ultra';
export type ExportFormat = 'png' | 'jpeg';
