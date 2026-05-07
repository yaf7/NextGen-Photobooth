export interface FilterConfig {
  id: string;
  name: string;
  emoji: string;
  cssFilter: string;
  // Preview color swatch (background gradient shown in picker)
  swatchGradient: string;
}

export const FILTERS: FilterConfig[] = [
  {
    id: "none",
    name: "Asli",
    emoji: "🌈",
    cssFilter: "none",
    swatchGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "bw",
    name: "B&W",
    emoji: "🖤",
    cssFilter: "grayscale(100%) contrast(110%)",
    swatchGradient: "linear-gradient(135deg, #2c2c2c, #888)",
  },
  {
    id: "vintage",
    name: "Vintage",
    emoji: "🕰️",
    cssFilter: "sepia(60%) saturate(80%) brightness(90%) contrast(105%)",
    swatchGradient: "linear-gradient(135deg, #c9a96e, #8b6914)",
  },
  {
    id: "cool",
    name: "Biru Sejuk",
    emoji: "🧊",
    cssFilter: "saturate(80%) hue-rotate(180deg) brightness(105%)",
    swatchGradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
  },
  {
    id: "vivid",
    name: "Vivid",
    emoji: "💥",
    cssFilter: "saturate(200%) contrast(115%) brightness(105%)",
    swatchGradient: "linear-gradient(135deg, #f093fb, #f5576c)",
  },
  {
    id: "fade",
    name: "Pudar",
    emoji: "🌫️",
    cssFilter: "brightness(130%) saturate(60%) contrast(75%)",
    swatchGradient: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
  },
  {
    id: "glam",
    name: "Glam",
    emoji: "💄",
    cssFilter: "brightness(115%) saturate(140%) contrast(95%) hue-rotate(-10deg)",
    swatchGradient: "linear-gradient(135deg, #f6d365, #fda085)",
  },
  {
    id: "lofi",
    name: "Lo-fi",
    emoji: "📟",
    cssFilter: "contrast(145%) saturate(65%) brightness(82%)",
    swatchGradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  },
  {
    id: "dreamy",
    name: "Mimpi",
    emoji: "🌸",
    cssFilter: "brightness(115%) saturate(80%) contrast(90%) blur(0.4px)",
    swatchGradient: "linear-gradient(135deg, #ffecd2, #fcb69f)",
  },
  {
    id: "noir",
    name: "Noir",
    emoji: "🎭",
    cssFilter: "grayscale(100%) contrast(160%) brightness(75%)",
    swatchGradient: "linear-gradient(135deg, #0f0c29, #302b63)",
  },
  {
    id: "studio",
    name: "Studio Glow",
    emoji: "✨",
    cssFilter: "contrast(115%) brightness(110%) saturate(120%) drop-shadow(0px 0px 4px rgba(255,255,255,0.2))",
    swatchGradient: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
  },
];

export function getFilter(id: string): FilterConfig {
  return FILTERS.find(f => f.id === id) ?? FILTERS[0];
}

export function getFilterCss(id: string): string {
  return getFilter(id).cssFilter;
}
