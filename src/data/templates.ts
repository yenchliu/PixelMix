import { GridTemplate, AspectRatio } from '../types';

export const TEMPLATES: GridTemplate[] = [
  // 1 Photo (Single)
  {
    id: '1-single',
    name: 'Full Canvas',
    photoCount: 1,
    cells: [{ id: 'c0', x: 0, y: 0, w: 1, h: 1 }],
  },

  // 2 Photos
  {
    id: '2-vertical-split',
    name: '2 Columns',
    photoCount: 2,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 1 },
      { id: 'c1', x: 0.5, y: 0, w: 0.5, h: 1 },
    ],
  },
  {
    id: '2-horizontal-split',
    name: '2 Rows',
    photoCount: 2,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1, h: 0.5 },
      { id: 'c1', x: 0, y: 0.5, w: 1, h: 0.5 },
    ],
  },
  {
    id: '2-asym-wide-left',
    name: 'Wide & Narrow',
    photoCount: 2,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.65, h: 1 },
      { id: 'c1', x: 0.65, y: 0, w: 0.35, h: 1 },
    ],
  },

  // 3 Photos
  {
    id: '3-hero-left',
    name: '1 Left, 2 Right',
    photoCount: 3,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 1 },
      { id: 'c1', x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { id: 'c2', x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    id: '3-hero-top',
    name: '1 Top, 2 Bottom',
    photoCount: 3,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1, h: 0.5 },
      { id: 'c1', x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { id: 'c2', x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    id: '3-columns',
    name: '3 Columns',
    photoCount: 3,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1 / 3, h: 1 },
      { id: 'c1', x: 1 / 3, y: 0, w: 1 / 3, h: 1 },
      { id: 'c2', x: 2 / 3, y: 0, w: 1 / 3, h: 1 },
    ],
  },
  {
    id: '3-rows',
    name: '3 Rows',
    photoCount: 3,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1, h: 1 / 3 },
      { id: 'c1', x: 0, y: 1 / 3, w: 1, h: 1 / 3 },
      { id: 'c2', x: 0, y: 2 / 3, w: 1, h: 1 / 3 },
    ],
  },
  {
    id: '3-hero-bottom',
    name: '2 Top, 1 Bottom',
    photoCount: 3,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 0.5 },
      { id: 'c1', x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { id: 'c2', x: 0, y: 0.5, w: 1, h: 0.5 },
    ],
  },

  // 4 Photos
  {
    id: '4-grid-2x2',
    name: 'Classic 2x2',
    photoCount: 4,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 0.5 },
      { id: 'c1', x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { id: 'c2', x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { id: 'c3', x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    id: '4-hero-top-3bottom',
    name: '1 Hero Top, 3 Bottom',
    photoCount: 4,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1, h: 0.6 },
      { id: 'c1', x: 0, y: 0.6, w: 1 / 3, h: 0.4 },
      { id: 'c2', x: 1 / 3, y: 0.6, w: 1 / 3, h: 0.4 },
      { id: 'c3', x: 2 / 3, y: 0.6, w: 1 / 3, h: 0.4 },
    ],
  },
  {
    id: '4-hero-left-3right',
    name: '1 Hero Left, 3 Right',
    photoCount: 4,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.6, h: 1 },
      { id: 'c1', x: 0.6, y: 0, w: 0.4, h: 1 / 3 },
      { id: 'c2', x: 0.6, y: 1 / 3, w: 0.4, h: 1 / 3 },
      { id: 'c3', x: 0.6, y: 2 / 3, w: 0.4, h: 1 / 3 },
    ],
  },
  {
    id: '4-columns',
    name: '4 Vertical Strips',
    photoCount: 4,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.25, h: 1 },
      { id: 'c1', x: 0.25, y: 0, w: 0.25, h: 1 },
      { id: 'c2', x: 0.5, y: 0, w: 0.25, h: 1 },
      { id: 'c3', x: 0.75, y: 0, w: 0.25, h: 1 },
    ],
  },
  {
    id: '4-pinwheel',
    name: 'Pinwheel Dynamic',
    photoCount: 4,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.6, h: 0.4 },
      { id: 'c1', x: 0.6, y: 0, w: 0.4, h: 0.6 },
      { id: 'c2', x: 0.4, y: 0.6, w: 0.6, h: 0.4 },
      { id: 'c3', x: 0, y: 0.4, w: 0.4, h: 0.6 },
    ],
  },

  // 5 Photos
  {
    id: '5-hero-center',
    name: 'Center Hero + 4 Corners',
    photoCount: 5,
    cells: [
      { id: 'c0', x: 0.25, y: 0.25, w: 0.5, h: 0.5 },
      { id: 'c1', x: 0, y: 0, w: 0.5, h: 0.25 },
      { id: 'c2', x: 0.5, y: 0, w: 0.5, h: 0.25 },
      { id: 'c3', x: 0, y: 0.75, w: 0.5, h: 0.25 },
      { id: 'c4', x: 0.5, y: 0.75, w: 0.5, h: 0.25 },
    ],
  },
  {
    id: '5-split-2-3',
    name: '2 Top, 3 Bottom',
    photoCount: 5,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 0.5 },
      { id: 'c1', x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { id: 'c2', x: 0, y: 0.5, w: 1 / 3, h: 0.5 },
      { id: 'c3', x: 1 / 3, y: 0.5, w: 1 / 3, h: 0.5 },
      { id: 'c4', x: 2 / 3, y: 0.5, w: 1 / 3, h: 0.5 },
    ],
  },
  {
    id: '5-split-3-2',
    name: '3 Top, 2 Bottom',
    photoCount: 5,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c1', x: 1 / 3, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c2', x: 2 / 3, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c3', x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { id: 'c4', x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    id: '5-hero-left-4grid',
    name: '1 Left, 4 Right (2x2)',
    photoCount: 5,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 1 },
      { id: 'c1', x: 0.5, y: 0, w: 0.25, h: 0.5 },
      { id: 'c2', x: 0.75, y: 0, w: 0.25, h: 0.5 },
      { id: 'c3', x: 0.5, y: 0.5, w: 0.25, h: 0.5 },
      { id: 'c4', x: 0.75, y: 0.5, w: 0.25, h: 0.5 },
    ],
  },

  // 6 Photos
  {
    id: '6-grid-3x2',
    name: '3x2 Grid',
    photoCount: 6,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c1', x: 1 / 3, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c2', x: 2 / 3, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c3', x: 0, y: 0.5, w: 1 / 3, h: 0.5 },
      { id: 'c4', x: 1 / 3, y: 0.5, w: 1 / 3, h: 0.5 },
      { id: 'c5', x: 2 / 3, y: 0.5, w: 1 / 3, h: 0.5 },
    ],
  },
  {
    id: '6-grid-2x3',
    name: '2x3 Grid',
    photoCount: 6,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 1 / 3 },
      { id: 'c1', x: 0.5, y: 0, w: 0.5, h: 1 / 3 },
      { id: 'c2', x: 0, y: 1 / 3, w: 0.5, h: 1 / 3 },
      { id: 'c3', x: 0.5, y: 1 / 3, w: 0.5, h: 1 / 3 },
      { id: 'c4', x: 0, y: 2 / 3, w: 0.5, h: 1 / 3 },
      { id: 'c5', x: 0.5, y: 2 / 3, w: 0.5, h: 1 / 3 },
    ],
  },
  {
    id: '6-hero-center-split',
    name: '2 Large + 4 Small',
    photoCount: 6,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 0.6 },
      { id: 'c1', x: 0.5, y: 0, w: 0.5, h: 0.6 },
      { id: 'c2', x: 0, y: 0.6, w: 0.25, h: 0.4 },
      { id: 'c3', x: 0.25, y: 0.6, w: 0.25, h: 0.4 },
      { id: 'c4', x: 0.5, y: 0.6, w: 0.25, h: 0.4 },
      { id: 'c5', x: 0.75, y: 0.6, w: 0.25, h: 0.4 },
    ],
  },

  // 7 Photos
  {
    id: '7-hero-top-6bottom',
    name: '1 Top + 6 Grid Bottom',
    photoCount: 7,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1, h: 0.5 },
      { id: 'c1', x: 0, y: 0.5, w: 1 / 3, h: 0.25 },
      { id: 'c2', x: 1 / 3, y: 0.5, w: 1 / 3, h: 0.25 },
      { id: 'c3', x: 2 / 3, y: 0.5, w: 1 / 3, h: 0.25 },
      { id: 'c4', x: 0, y: 0.75, w: 1 / 3, h: 0.25 },
      { id: 'c5', x: 1 / 3, y: 0.75, w: 1 / 3, h: 0.25 },
      { id: 'c6', x: 2 / 3, y: 0.75, w: 1 / 3, h: 0.25 },
    ],
  },
  {
    id: '7-split-3-4',
    name: '3 Top + 4 Bottom',
    photoCount: 7,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c1', x: 1 / 3, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c2', x: 2 / 3, y: 0, w: 1 / 3, h: 0.5 },
      { id: 'c3', x: 0, y: 0.5, w: 0.25, h: 0.5 },
      { id: 'c4', x: 0.25, y: 0.5, w: 0.25, h: 0.5 },
      { id: 'c5', x: 0.5, y: 0.5, w: 0.25, h: 0.5 },
      { id: 'c6', x: 0.75, y: 0.5, w: 0.25, h: 0.5 },
    ],
  },

  // 8 Photos
  {
    id: '8-grid-4x2',
    name: '4x2 Grid',
    photoCount: 8,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.25, h: 0.5 },
      { id: 'c1', x: 0.25, y: 0, w: 0.25, h: 0.5 },
      { id: 'c2', x: 0.5, y: 0, w: 0.25, h: 0.5 },
      { id: 'c3', x: 0.75, y: 0, w: 0.25, h: 0.5 },
      { id: 'c4', x: 0, y: 0.5, w: 0.25, h: 0.5 },
      { id: 'c5', x: 0.25, y: 0.5, w: 0.25, h: 0.5 },
      { id: 'c6', x: 0.5, y: 0.5, w: 0.25, h: 0.5 },
      { id: 'c7', x: 0.75, y: 0.5, w: 0.25, h: 0.5 },
    ],
  },
  {
    id: '8-grid-2x4',
    name: '2x4 Grid',
    photoCount: 8,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 0.5, h: 0.25 },
      { id: 'c1', x: 0.5, y: 0, w: 0.5, h: 0.25 },
      { id: 'c2', x: 0, y: 0.25, w: 0.5, h: 0.25 },
      { id: 'c3', x: 0.5, y: 0.25, w: 0.5, h: 0.25 },
      { id: 'c4', x: 0, y: 0.5, w: 0.5, h: 0.25 },
      { id: 'c5', x: 0.5, y: 0.5, w: 0.5, h: 0.25 },
      { id: 'c6', x: 0, y: 0.75, w: 0.5, h: 0.25 },
      { id: 'c7', x: 0.5, y: 0.75, w: 0.5, h: 0.25 },
    ],
  },

  // 9 Photos
  {
    id: '9-grid-3x3',
    name: 'Classic 3x3 Grid',
    photoCount: 9,
    cells: [
      { id: 'c0', x: 0, y: 0, w: 1 / 3, h: 1 / 3 },
      { id: 'c1', x: 1 / 3, y: 0, w: 1 / 3, h: 1 / 3 },
      { id: 'c2', x: 2 / 3, y: 0, w: 1 / 3, h: 1 / 3 },
      { id: 'c3', x: 0, y: 1 / 3, w: 1 / 3, h: 1 / 3 },
      { id: 'c4', x: 1 / 3, y: 1 / 3, w: 1 / 3, h: 1 / 3 },
      { id: 'c5', x: 2 / 3, y: 1 / 3, w: 1 / 3, h: 1 / 3 },
      { id: 'c6', x: 0, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
      { id: 'c7', x: 1 / 3, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
      { id: 'c8', x: 2 / 3, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
    ],
  },
  {
    id: '9-hero-center-large',
    name: 'Large Center 2x2 + 8 Border',
    photoCount: 9,
    cells: [
      // 8 border cells surrounding a 2/3 x 2/3 center
      { id: 'c0', x: 1 / 6, y: 1 / 6, w: 4 / 6, h: 4 / 6 }, // Center Hero
      { id: 'c1', x: 0, y: 0, w: 0.5, h: 1 / 6 },
      { id: 'c2', x: 0.5, y: 0, w: 0.5, h: 1 / 6 },
      { id: 'c3', x: 5 / 6, y: 1 / 6, w: 1 / 6, h: 2 / 6 },
      { id: 'c4', x: 5 / 6, y: 3 / 6, w: 1 / 6, h: 2 / 6 },
      { id: 'c5', x: 0.5, y: 5 / 6, w: 0.5, h: 1 / 6 },
      { id: 'c6', x: 0, y: 5 / 6, w: 0.5, h: 1 / 6 },
      { id: 'c7', x: 0, y: 3 / 6, w: 1 / 6, h: 2 / 6 },
      { id: 'c8', x: 0, y: 1 / 6, w: 1 / 6, h: 2 / 6 },
    ],
  },
];

export const ASPECT_RATIOS: { id: AspectRatio; label: string; ratio: number; icon: string }[] = [
  { id: '1:1', label: '1:1 Square', ratio: 1, icon: 'Square' },
  { id: '4:3', label: '4:3 Standard', ratio: 4 / 3, icon: 'Monitor' },
  { id: '7:5', label: '7:5 Classic Print', ratio: 7 / 5, icon: 'Image' },
  { id: '3:2', label: '3:2 35mm Photo', ratio: 3 / 2, icon: 'Camera' },
  { id: '16:9', label: '16:9 Widescreen', ratio: 16 / 9, icon: 'Tv' },
  { id: '9:16', label: '9:16 Story / Reel', ratio: 9 / 16, icon: 'Smartphone' },
  { id: '3:4', label: '3:4 Portrait', ratio: 3 / 4, icon: 'RectangleVertical' },
];

export const FONT_FAMILIES = [
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Playfair Display', family: '"Playfair Display", serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
  { name: 'Caveat (Handwritten)', family: 'Caveat, cursive' },
  { name: 'Pacifico (Retro)', family: 'Pacifico, cursive' },
  { name: 'Bebas Neue (Bold)', family: '"Bebas Neue", sans-serif' },
  { name: 'Outfit (Modern)', family: 'Outfit, sans-serif' },
  { name: 'Dancing Script', family: '"Dancing Script", cursive' },
  { name: 'Poppins', family: 'Poppins, sans-serif' },
];

export const COLOR_PALETTES = [
  '#ffffff',
  '#09090b',
  '#18181b',
  '#27272a',
  '#f4f4f5',
  '#e4e4e7',
  '#fca5a5',
  '#f87171',
  '#fb923c',
  '#facc15',
  '#4ade80',
  '#2dd4bf',
  '#38bdf8',
  '#60a5fa',
  '#818cf8',
  '#c084fc',
  '#f472b6',
  '#ffe4e6',
  '#fef3c7',
  '#ecfdf5',
  '#eff6ff',
  '#f5f3ff',
];

export const GRADIENT_PRESETS = [
  { name: 'Sunset Glow', from: '#ff512f', to: '#dd2476', direction: 'to-br' as const },
  { name: 'Ocean Breeze', from: '#2b5876', to: '#4e4376', direction: 'to-r' as const },
  { name: 'Neon Life', from: '#B224EF', to: '#7579FF', direction: 'to-br' as const },
  { name: 'Emerald Wave', from: '#0ba360', to: '#3cba92', direction: 'to-r' as const },
  { name: 'Soft Peach', from: '#ffecd2', to: '#fcb69f', direction: 'to-b' as const },
  { name: 'Midnight', from: '#0f2027', to: '#2c5364', direction: 'to-b' as const },
  { name: 'Lavender Mist', from: '#e0c3fc', to: '#8ec5fc', direction: 'to-r' as const },
  { name: 'Golden Hour', from: '#f6d365', to: '#fda085', direction: 'to-br' as const },
];
