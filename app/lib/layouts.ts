// Layout definitions for the photo booth
// Each layout specifies how many photos to capture and canvas export geometry.

export interface SlotGeometry {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number; // degrees, for canvas transform
}

export interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tag: string; // e.g. "Classic", "Trendy"
  photoCount: number;
  // CSS preview aspect: determines how tall the preview card is
  previewAspect: string; // e.g. "aspect-[3/8]"
  previewCols: number;   // columns in the CSS grid preview
  // Canvas export dimensions
  canvasWidth: number;
  canvasHeight: number;
  slots: SlotGeometry[];
  canvasBg: string;       // hex or rgb
  borderColor: string;    // for decorations
  borderSize: number;     // outer padding
  showSprockets?: boolean;
  showPolaroidBase?: boolean;
  isDiagonal?: boolean;
  isNeon?: boolean;
}

const PAD = 24; // outer padding
const GAP = 12; // gap between photos

// ── 1. Classic Strip 2 ──────────────────────────────────────────────────────
const strip2: LayoutConfig = {
  id: "strip-2",
  name: "Duo Klasik",
  description: "Strip vertikal 2-foto",
  emoji: "🎞️",
  tag: "Klasik",
  photoCount: 2,
  previewAspect: "aspect-[2/5]",
  previewCols: 1,
  canvasWidth: 800,
  canvasHeight: 1300,
  canvasBg: "#ffffff",
  borderColor: "#ffffff",
  borderSize: PAD,
  slots: [
    { x: PAD, y: PAD, w: 800 - PAD * 2, h: 600 },
    { x: PAD, y: PAD + 600 + GAP, w: 800 - PAD * 2, h: 600 },
  ],
};

// ── 2. Classic Strip 3 ──────────────────────────────────────────────────────
const strip3: LayoutConfig = {
  id: "strip-3",
  name: "Trio Klasik",
  description: "Strip vertikal 3-foto",
  emoji: "📽️",
  tag: "Klasik",
  photoCount: 3,
  previewAspect: "aspect-[1/4]",
  previewCols: 1,
  canvasWidth: 800,
  canvasHeight: 1900,
  canvasBg: "#ffffff",
  borderColor: "#ffffff",
  borderSize: PAD,
  slots: [
    { x: PAD, y: PAD, w: 800 - PAD * 2, h: 570 },
    { x: PAD, y: PAD + 570 + GAP, w: 800 - PAD * 2, h: 570 },
    { x: PAD, y: PAD + (570 + GAP) * 2, w: 800 - PAD * 2, h: 570 },
  ],
};

// ── 3. Classic Strip 4 ──────────────────────────────────────────────────────
const strip4: LayoutConfig = {
  id: "strip-4",
  name: "Quad Klasik",
  description: "Strip vertikal 4-foto",
  emoji: "🎬",
  tag: "Klasik",
  photoCount: 4,
  previewAspect: "aspect-[1/5]",
  previewCols: 1,
  canvasWidth: 800,
  canvasHeight: 2400,
  canvasBg: "#ffffff",
  borderColor: "#ffffff",
  borderSize: PAD,
  slots: [
    { x: PAD, y: PAD,                    w: 800 - PAD * 2, h: 560 },
    { x: PAD, y: PAD + (560 + GAP),      w: 800 - PAD * 2, h: 560 },
    { x: PAD, y: PAD + (560 + GAP) * 2,  w: 800 - PAD * 2, h: 560 },
    { x: PAD, y: PAD + (560 + GAP) * 3,  w: 800 - PAD * 2, h: 560 },
  ],
};

// ── 4. Square Grid 2×2 ──────────────────────────────────────────────────────
const grid2x2: LayoutConfig = {
  id: "grid-2x2",
  name: "Kisi Kotak",
  description: "Kolase 2x2 4-foto",
  emoji: "⬛",
  tag: "Tren",
  photoCount: 4,
  previewAspect: "aspect-square",
  previewCols: 2,
  canvasWidth: 1200,
  canvasHeight: 1200,
  canvasBg: "#ffffff",
  borderColor: "#ffffff",
  borderSize: PAD,
  slots: (() => {
    const cell = (1200 - PAD * 2 - GAP) / 2;
    return [
      { x: PAD,           y: PAD,           w: cell, h: cell },
      { x: PAD + cell + GAP, y: PAD,         w: cell, h: cell },
      { x: PAD,           y: PAD + cell + GAP, w: cell, h: cell },
      { x: PAD + cell + GAP, y: PAD + cell + GAP, w: cell, h: cell },
    ];
  })(),
};

// ── 5. Cinematic Single ─────────────────────────────────────────────────────
const wide1: LayoutConfig = {
  id: "wide-1",
  name: "Sinematik",
  description: "Bingkai lebar 1-foto",
  emoji: "🎥",
  tag: "Premium",
  photoCount: 1,
  previewAspect: "aspect-video",
  previewCols: 1,
  canvasWidth: 1600,
  canvasHeight: 1000,
  canvasBg: "#0a0a0f",
  borderColor: "#c9a96e",
  borderSize: 40,
  slots: [
    { x: 40, y: 80, w: 1520, h: 780 },
  ],
};

// ── 6. Polaroid Party ───────────────────────────────────────────────────────
const polaroid3: LayoutConfig = {
  id: "polaroid-3",
  name: "Pesta Polaroid",
  description: "3 bingkai polaroid",
  emoji: "📸",
  tag: "Retro",
  photoCount: 3,
  previewAspect: "aspect-[4/3]",
  previewCols: 3,
  canvasWidth: 1400,
  canvasHeight: 900,
  canvasBg: "#fdf6e3",
  borderColor: "#ffffff",
  borderSize: 0,
  showPolaroidBase: true,
  slots: [
    { x: 60,  y: 60,  w: 360, h: 310, rotation: -5 },
    { x: 520, y: 30,  w: 360, h: 310, rotation: 1  },
    { x: 975, y: 55,  w: 360, h: 310, rotation: 4  },
  ],
};

// ── 7. Retro Filmstrip ──────────────────────────────────────────────────────
const retroFilm: LayoutConfig = {
  id: "retro-film",
  name: "Film Retro",
  description: "Strip film horizontal 4-foto",
  emoji: "🎞",
  tag: "Retro",
  photoCount: 4,
  previewAspect: "aspect-[4/1]",
  previewCols: 4,
  canvasWidth: 2000,
  canvasHeight: 700,
  canvasBg: "#1a1a1a",
  borderColor: "#333",
  borderSize: 0,
  showSprockets: true,
  slots: (() => {
    const photoW = 440;
    const photoH = 500;
    const sprocket = 60;
    const startX = 60;
    const y = (700 - photoH) / 2;
    return [0,1,2,3].map(i => ({
      x: startX + i * (photoW + GAP * 2),
      y,
      w: photoW,
      h: photoH,
    }));
  })(),
};

// ── 8. Magazine Cover ───────────────────────────────────────────────────────
const magazine: LayoutConfig = {
  id: "magazine",
  name: "Majalah",
  description: "Editorial: 1 besar + 2 kecil",
  emoji: "📰",
  tag: "Editorial",
  photoCount: 3,
  previewAspect: "aspect-[4/3]",
  previewCols: 1,
  canvasWidth: 1400,
  canvasHeight: 1000,
  canvasBg: "#ffffff",
  borderColor: "#ffffff",
  borderSize: PAD,
  slots: [
    { x: PAD,       y: PAD,       w: 840, h: 952 },
    { x: PAD + 852, y: PAD,       w: 500, h: 466 },
    { x: PAD + 852, y: PAD + 478, w: 500, h: 474 },
  ],
};

// ── 9. Diagonal Slash ───────────────────────────────────────────────────────
const diagonal: LayoutConfig = {
  id: "diagonal",
  name: "Diagonal",
  description: "2-foto diagonal berani",
  emoji: "⚡",
  tag: "Berani",
  photoCount: 2,
  previewAspect: "aspect-video",
  previewCols: 2,
  canvasWidth: 1400,
  canvasHeight: 900,
  canvasBg: "#0a0a0f",
  borderColor: "#06b6d4",
  borderSize: 0,
  isDiagonal: true,
  slots: [
    { x: 0,   y: 0, w: 900, h: 900 },
    { x: 500, y: 0, w: 900, h: 900 },
  ],
};

// ── 10. Neon Single ─────────────────────────────────────────────────────────
const neonSingle: LayoutConfig = {
  id: "neon-single",
  name: "Bingkai Neon",
  description: "1-foto bingkai neon bercahaya",
  emoji: "✨",
  tag: "Premium",
  photoCount: 1,
  previewAspect: "aspect-square",
  previewCols: 1,
  canvasWidth: 1000,
  canvasHeight: 1000,
  canvasBg: "#080010",
  borderColor: "#06b6d4",
  borderSize: 50,
  isNeon: true,
  slots: [
    { x: 60, y: 60, w: 880, h: 880 },
  ],
};

export const LAYOUTS: LayoutConfig[] = [
  strip4,
  strip3,
  strip2,
  grid2x2,
  wide1,
  polaroid3,
  retroFilm,
  magazine,
  diagonal,
  neonSingle,
];

export function getLayout(id: string): LayoutConfig {
  return LAYOUTS.find(l => l.id === id) ?? LAYOUTS[0];
}
