'use client';

import { motion } from 'framer-motion';
import { LayoutConfig } from '../lib/layouts';

interface Props {
  layout: LayoutConfig;
  photos: string[];
  filterCss: string;
  caption: string;
}

export default function PhotoStrip({ layout, photos, filterCss, caption }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div id="photo-strip-preview" className="relative" style={{ maxWidth: 480, width: '100%' }}>
        <StripRenderer layout={layout} photos={photos} filterCss={filterCss} caption={caption} />
      </div>
    </div>
  );
}

function StripRenderer({ layout, photos, filterCss, caption }: Props) {
  const { id } = layout;

  if (id.startsWith('strip')) return <StripLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;
  if (id === 'grid-2x2') return <GridLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;
  if (id === 'wide-1') return <WideLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;
  if (id === 'polaroid-3') return <PolaroidLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;
  if (id === 'retro-film') return <FilmLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;
  if (id === 'magazine') return <MagazineLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;
  if (id === 'diagonal') return <DiagonalLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;
  if (id === 'neon-single') return <NeonLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;

  return <StripLayout layout={layout} photos={photos} filterCss={filterCss} caption={caption} />;
}

// ── Shared photo slot component ─────────────────────────────────────────────
function Slot({
  src,
  index,
  style = {},
  imgStyle = {},
  filterCss,
  radius = 4,
}: {
  src?: string;
  index: number;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  filterCss: string;
  radius?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      className="overflow-hidden relative"
      style={{ borderRadius: radius, background: 'rgba(255,255,255,0.05)', ...style }}
    >
      {src ? (
        <img
          src={src}
          alt={`Shot ${index + 1}`}
          className="w-full h-full object-cover"
          style={{ filter: filterCss, ...imgStyle }}
        />
      ) : (
        <div className="w-full h-full shot-placeholder flex items-center justify-center">
          <span className="text-white/20 text-4xl">📷</span>
        </div>
      )}
    </motion.div>
  );
}

// ── Strip Layout ─────────────────────────────────────────────────────────────
function StripLayout({ layout, photos, filterCss, caption }: Props) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: '#ffffff', padding: 12, gap: 8 }}
    >
      {Array.from({ length: layout.photoCount }).map((_, i) => (
        <Slot
          key={i} index={i} src={photos[i]}
          filterCss={filterCss}
          style={{ aspectRatio: '4/3' }}
          radius={6}
        />
      ))}
      {caption && (
        <p className="text-center text-sm font-medium mt-1" style={{ color: '#555', fontFamily: 'Outfit, sans-serif' }}>
          {caption}
        </p>
      )}
    </div>
  );
}

// ── Grid Layout ──────────────────────────────────────────────────────────────
function GridLayout({ layout, photos, filterCss, caption }: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#ffffff', padding: 12 }}
    >
      <div className="grid grid-cols-2 gap-2">
        {[0,1,2,3].map(i => (
          <Slot key={i} index={i} src={photos[i]} filterCss={filterCss} style={{ aspectRatio: '1/1' }} radius={6} />
        ))}
      </div>
      {caption && (
        <p className="text-center text-sm font-medium mt-2" style={{ color: '#555' }}>{caption}</p>
      )}
    </div>
  );
}

// ── Wide/Cinematic Layout ────────────────────────────────────────────────────
function WideLayout({ photos, filterCss, caption }: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0a0a0f', padding: '24px 24px 32px', border: '2px solid #c9a96e' }}
    >
      <Slot index={0} src={photos[0]} filterCss={filterCss} style={{ aspectRatio: '16/9' }} radius={6} />
      {caption && (
        <p className="text-center text-sm font-medium mt-3" style={{ color: '#c9a96e', letterSpacing: '0.1em' }}>{caption}</p>
      )}
    </div>
  );
}

// ── Polaroid Layout ──────────────────────────────────────────────────────────
function PolaroidLayout({ photos, filterCss, caption }: Props) {
  const rots = [-6, 0, 5];
  return (
    <div
      className="relative rounded-2xl overflow-visible"
      style={{ background: '#fdf6e3', padding: 32, minHeight: 280 }}
    >
      <div className="flex items-end justify-center gap-1">
        {[0,1,2].map(i => (
          <motion.div
            key={i}
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: rots[i], opacity: 1 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
            style={{
              background: '#fff',
              padding: '8px 8px 28px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              borderRadius: 4,
              flex: 1,
            }}
          >
            <Slot index={i} src={photos[i]} filterCss={filterCss} style={{ aspectRatio: '1/1' }} radius={2} />
          </motion.div>
        ))}
      </div>
      {caption && (
        <p className="text-center text-xs font-medium mt-4" style={{ color: '#888', fontFamily: 'Outfit, sans-serif' }}>{caption}</p>
      )}
    </div>
  );
}

// ── Retro Film Layout ────────────────────────────────────────────────────────
function FilmLayout({ photos, filterCss, caption }: Props) {
  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{ background: '#1a1a1a', padding: '28px 12px' }}
    >
      {/* Sprocket holes top */}
      <div className="absolute top-0 left-0 right-0 flex justify-around px-2" style={{ height: 24, alignItems: 'center' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: 10, height: 10, background: '#444' }} />
        ))}
      </div>
      {/* Sprocket holes bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around px-2" style={{ height: 24, alignItems: 'center' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: 10, height: 10, background: '#444' }} />
        ))}
      </div>

      <div className="flex gap-2">
        {[0,1,2,3].map(i => (
          <Slot key={i} index={i} src={photos[i]} filterCss={filterCss} style={{ flex: 1, aspectRatio: '3/4' }} radius={3} />
        ))}
      </div>
      {caption && (
        <p className="text-center text-xs font-medium mt-2" style={{ color: '#888', letterSpacing: '0.15em' }}>{caption}</p>
      )}
    </div>
  );
}

// ── Magazine Layout ──────────────────────────────────────────────────────────
function MagazineLayout({ photos, filterCss, caption }: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', padding: 10 }}
    >
      <div className="flex gap-2">
        <div style={{ flex: 3 }}>
          <Slot index={0} src={photos[0]} filterCss={filterCss} style={{ aspectRatio: '4/5' }} radius={6} />
        </div>
        <div className="flex flex-col gap-2" style={{ flex: 2 }}>
          <Slot index={1} src={photos[1]} filterCss={filterCss} style={{ aspectRatio: '1/1' }} radius={6} />
          <Slot index={2} src={photos[2]} filterCss={filterCss} style={{ aspectRatio: '1/1' }} radius={6} />
        </div>
      </div>
      {caption && (
        <p className="text-center text-xs font-medium mt-2" style={{ color: '#555' }}>{caption}</p>
      )}
    </div>
  );
}

// ── Diagonal Layout ──────────────────────────────────────────────────────────
function DiagonalLayout({ photos, filterCss, caption }: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{ background: '#0a0a0f', aspectRatio: '16/10' }}
    >
      {/* Left photo */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)' }}
      >
        {photos[0] ? (
          <img src={photos[0]} alt="Shot 1" className="absolute inset-0 w-full h-full object-cover" style={{ filter: filterCss }} />
        ) : (
          <div className="absolute inset-0 shot-placeholder" />
        )}
      </div>
      {/* Right photo */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 42% 100%)' }}
      >
        {photos[1] ? (
          <img src={photos[1]} alt="Shot 2" className="absolute inset-0 w-full h-full object-cover" style={{ filter: filterCss }} />
        ) : (
          <div className="absolute inset-0 shot-placeholder" />
        )}
      </div>
      {/* Divider */}
      <div
        className="absolute inset-y-0"
        style={{
          left: '42%',
          width: 4,
          background: 'linear-gradient(180deg, #06b6d4, #3b82f6)',
          boxShadow: '0 0 16px rgba(6,182,212,0.7)',
          transform: 'skewX(-8deg)',
          transformOrigin: 'top',
        }}
      />
      {caption && (
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Neon Layout ──────────────────────────────────────────────────────────────
function NeonLayout({ photos, filterCss, caption }: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{ background: '#080010', padding: 20, aspectRatio: '1/1' }}
    >
      <Slot
        index={0}
        src={photos[0]}
        filterCss={filterCss}
        style={{ width: '100%', height: '100%', aspectRatio: '1/1' }}
        radius={10}
      />
      {/* Neon border overlay */}
      <motion.div
        className="absolute inset-4 rounded-xl pointer-events-none"
        style={{
          border: '2px solid #06b6d4',
          boxShadow: '0 0 20px #06b6d4, inset 0 0 20px rgba(6,182,212,0.2)',
        }}
        animate={{ boxShadow: [
          '0 0 20px #06b6d4, inset 0 0 20px rgba(6,182,212,0.2)',
          '0 0 40px #3b82f6, inset 0 0 30px rgba(59,130,246,0.2)',
          '0 0 20px #06b6d4, inset 0 0 20px rgba(6,182,212,0.2)',
        ]}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {caption && (
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs font-semibold" style={{ color: '#67e8f9', textShadow: '0 0 8px rgba(6,182,212,0.8)' }}>
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
