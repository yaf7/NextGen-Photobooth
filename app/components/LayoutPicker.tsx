'use client';

import { motion } from 'framer-motion';
import { LAYOUTS } from '../lib/layouts';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const TAG_COLORS: Record<string, string> = {
  Classic:  'rgba(59,130,246,0.25)',
  Trendy:   'rgba(236,72,153,0.25)',
  Premium:  'rgba(139,92,246,0.25)',
  Retro:    'rgba(245,158,11,0.25)',
  Bold:     'rgba(239,68,68,0.25)',
  Editorial:'rgba(16,185,129,0.25)',
};

const TAG_TEXT: Record<string, string> = {
  Classic:  '#93c5fd',
  Trendy:   '#f9a8d4',
  Premium:  '#c4b5fd',
  Retro:    '#fcd34d',
  Bold:     '#fca5a5',
  Editorial:'#6ee7b7',
};

export default function LayoutPicker({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Choose Layout
      </h3>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {LAYOUTS.map((layout, i) => {
          const isSelected = selected === layout.id;
          return (
            <motion.button
              key={layout.id}
              onClick={() => onSelect(layout.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-center gap-2 p-3 rounded-xl text-left transition-all duration-200 cursor-pointer"
              style={{
                background: isSelected
                  ? 'rgba(139,92,246,0.2)'
                  : 'rgba(255,255,255,0.04)',
                border: isSelected
                  ? '1.5px solid rgba(139,92,246,0.7)'
                  : '1.5px solid rgba(255,255,255,0.08)',
                boxShadow: isSelected
                  ? '0 0 20px rgba(139,92,246,0.25)'
                  : 'none',
              }}
            >
              {/* Visual preview thumbnail */}
              <LayoutThumbnail layout={layout} isSelected={isSelected} />

              {/* Info */}
              <div className="w-full flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-white/90 truncate">
                    {layout.emoji} {layout.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    style={{
                      background: TAG_COLORS[layout.tag] ?? 'rgba(255,255,255,0.1)',
                      color: TAG_TEXT[layout.tag] ?? '#fff',
                    }}
                  >
                    {layout.tag}
                  </span>
                  <span className="text-[9px] text-white/30">{layout.photoCount} shot{layout.photoCount > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="layout-selected"
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#8b5cf6' }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function LayoutThumbnail({ layout, isSelected }: { layout: import('../lib/layouts').LayoutConfig; isSelected: boolean }) {
  const accent = isSelected ? '#8b5cf6' : 'rgba(255,255,255,0.15)';
  const bg = isSelected ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)';

  const thumbnailStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: 8,
    background: bg,
    border: `1px solid ${accent}`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  };

  return (
    <div style={{ ...thumbnailStyle, aspectRatio: getThumbnailAspect(layout.id) }}>
      <ThumbGrid layout={layout} accent={accent} />
    </div>
  );
}

function getThumbnailAspect(id: string) {
  if (id.startsWith('strip')) return '1/3';
  if (id === 'grid-2x2') return '1/1';
  if (id === 'retro-film') return '4/1';
  if (id === 'wide-1') return '16/9';
  if (id === 'neon-single') return '1/1';
  return '4/3';
}

function ThumbGrid({ layout, accent }: { layout: import('../lib/layouts').LayoutConfig; accent: string }) {
  const slotStyle: React.CSSProperties = {
    background: accent,
    borderRadius: 3,
    opacity: 0.7,
  };

  if (layout.id.startsWith('strip')) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '80%', height: '90%' }}>
        {Array.from({ length: layout.photoCount }).map((_, i) => (
          <div key={i} style={{ ...slotStyle, flex: 1 }} />
        ))}
      </div>
    );
  }

  if (layout.id === 'grid-2x2') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '80%', height: '80%' }}>
        {[0,1,2,3].map(i => <div key={i} style={slotStyle} />)}
      </div>
    );
  }

  if (layout.id === 'retro-film') {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: 2, width: '95%', height: '60%' }}>
        {[0,1,2,3].map(i => <div key={i} style={{ ...slotStyle, flex: 1 }} />)}
      </div>
    );
  }

  if (layout.id === 'magazine') {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: 2, width: '90%', height: '80%' }}>
        <div style={{ ...slotStyle, flex: 3 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 2 }}>
          <div style={{ ...slotStyle, flex: 1 }} />
          <div style={{ ...slotStyle, flex: 1 }} />
        </div>
      </div>
    );
  }

  if (layout.id === 'polaroid-3') {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: 3, width: '90%', height: '75%', alignItems: 'flex-end' }}>
        {['-4deg','0deg','4deg'].map((rot,i) => (
          <div
            key={i}
            style={{
              ...slotStyle,
              flex: 1,
              borderBottom: '6px solid rgba(255,255,255,0.3)',
              transform: `rotate(${rot})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (layout.id === 'diagonal') {
    return (
      <div style={{ position: 'relative', width: '90%', height: '70%', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ ...slotStyle, position: 'absolute', left: 0, top: 0, width: '60%', height: '100%', borderRadius: 0 }} />
        <div style={{ ...slotStyle, position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', borderRadius: 0, opacity: 0.4 }} />
        <div style={{
          position: 'absolute',
          left: '45%',
          top: 0,
          width: 2,
          height: '100%',
          background: accent,
          transform: 'skewX(-12deg)',
        }} />
      </div>
    );
  }

  // Default: single block
  return <div style={{ ...slotStyle, width: '80%', height: '80%' }} />;
}
