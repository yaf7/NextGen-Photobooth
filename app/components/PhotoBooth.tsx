'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Settings2, ChevronDown, FlipHorizontal } from 'lucide-react';

import CameraView, { CameraViewHandle } from './CameraView';
import LayoutPicker from './LayoutPicker';
import FilterPicker from './FilterPicker';
import CountdownOverlay from './CountdownOverlay';
import PhotoStrip from './PhotoStrip';
import ControlBar from './ControlBar';

import { LAYOUTS, getLayout } from '../lib/layouts';
import { getFilterCss } from '../lib/filters';
import { exportCanvas } from '../lib/canvasExport';

type Phase = 'setup' | 'capture' | 'review';

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export default function PhotoBooth() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedLayoutId, setSelectedLayoutId] = useState('strip-4');
  const [selectedFilterId, setSelectedFilterId] = useState('none');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [currentShot, setCurrentShot] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [caption, setCaption] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [showPanel, setShowPanel] = useState(false); // mobile panel toggle
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const cameraRef = useRef<CameraViewHandle>(null);

  const layout = getLayout(selectedLayoutId);
  const filterCss = getFilterCss(selectedFilterId);

  // ── Capture Flow ─────────────────────────────────────────────────────────
  const startCapture = useCallback(async () => {
    setPhase('capture');
    const photos: string[] = [];

    for (let shotIdx = 0; shotIdx < layout.photoCount; shotIdx++) {
      setCurrentShot(shotIdx);

      // Countdown 3-2-1
      for (let c = 3; c >= 1; c--) {
        setCountdown(c);
        await delay(900);
      }

      // Capture moment
      setCountdown(0);
      await delay(200);
      setIsFlashing(true);
      const photo = cameraRef.current?.capture() ?? null;
      if (photo) {
        photos.push(photo);
        setCapturedPhotos([...photos]);
      }
      await delay(250);
      setIsFlashing(false);
      setCountdown(null);

      // Pause between shots (except after last)
      if (shotIdx < layout.photoCount - 1) {
        await delay(1200);
      }
    }

    await delay(400);
    setPhase('review');
  }, [layout.photoCount]);

  const handleRetake = () => {
    setCapturedPhotos([]);
    setCurrentShot(0);
    setCountdown(null);
    setIsFlashing(false);
    setPhase('setup');
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await exportCanvas(layout, capturedPhotos, selectedFilterId, caption);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `nextgen-${layout.id}-${Date.now()}.jpg`;
      a.click();
    } catch (e) {
      console.error('Export failed', e);
    }
    setIsDownloading(false);
  };

  const handleLayoutChange = (id: string) => {
    setSelectedLayoutId(id);
    setCapturedPhotos([]);
    if (phase !== 'setup') setPhase('setup');
  };

  return (
    <div className="relative h-[100dvh] overflow-hidden flex flex-col" style={{ zIndex: 1 }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold gradient-text text-xl tracking-tight pr-1">NextGen-Photobooth</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/40 text-xs">
          <span className="hidden sm:inline">Deyafa Arsetya</span>
          <AnimatePresence>
            {phase === 'capture' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)' }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-semibold">REC</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:gap-0 px-4 pb-4 sm:px-6 max-w-[1400px] mx-auto w-full relative">

        {/* ── Left: Camera + Controls ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4 lg:pr-4 min-h-0">

          {/* Camera frame */}
          <div
            className="relative w-full flex-1 min-h-0 rounded-2xl overflow-hidden flex items-center justify-center bg-black/20"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
          >
            <AnimatePresence mode="wait">
              {phase !== 'review' ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <CameraView
                    ref={cameraRef}
                    filterCss={filterCss}
                    isFlashing={isFlashing}
                    facingMode={facingMode}
                  />

                  {/* Camera flip toggle */}
                  {phase === 'setup' && (
                    <button
                      onClick={() => setFacingMode(m => m === 'user' ? 'environment' : 'user')}
                      className="absolute top-4 right-4 glass glass-hover p-2 rounded-full text-white/80 transition-all z-20"
                      title="Switch Camera"
                    >
                      <FlipHorizontal size={18} />
                    </button>
                  )}

                  {/* Shot thumbnails during capture */}
                  {phase === 'capture' && capturedPhotos.length > 0 && (
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {capturedPhotos.map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-lg overflow-hidden"
                          style={{
                            width: 52, height: 40,
                            border: '2px solid rgba(6,182,212,0.7)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                          }}
                        >
                          <img src={p} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" style={{ filter: filterCss }} />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Shot indicator */}
                  {phase === 'capture' && (
                    <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-semibold text-white/80">
                      Shot {currentShot + 1} of {layout.photoCount}
                    </div>
                  )}

                  <CountdownOverlay value={countdown} />
                </motion.div>
              ) : (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex items-center justify-center p-4"
                  style={{ minHeight: 300 }}
                >
                  <PhotoStrip
                    layout={layout}
                    photos={capturedPhotos}
                    filterCss={filterCss}
                    caption={caption}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Control bar */}
          <ControlBar
            phase={phase}
            photoCount={layout.photoCount}
            capturedCount={capturedPhotos.length}
            onStart={startCapture}
            onRetake={handleRetake}
            onDownload={handleDownload}
            isDownloading={isDownloading}
            canStart={true}
          />

          {/* Caption input (setup + review) */}
          <AnimatePresence>
            {(phase === 'setup' || phase === 'review') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Add a caption… (optional)"
                  maxLength={60}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white/80 placeholder-white/25 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Customization Panel ──────────────────────────────── */}
        {/* Mobile toggle */}
        <div className="lg:hidden shrink-0">
          <button
            onClick={() => setShowPanel(v => !v)}
            className="w-full glass rounded-xl px-4 py-3 flex items-center justify-between text-white/70 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <Settings2 size={15} />
              <span>Customize Layout & Filter</span>
            </div>
            <ChevronDown
              size={15}
              style={{ transform: showPanel ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
            />
          </button>
        </div>

        {/* Unified panel: visible on mobile when toggled as an absolute overlay, always visible on lg+ */}
        <div className={`
          absolute inset-x-4 bottom-[72px] top-4 z-50 lg:static lg:inset-auto lg:z-auto
          ${showPanel ? 'block' : 'hidden'} lg:block lg:h-full lg:overflow-hidden
        `}>
          <SidePanel
            selectedLayoutId={selectedLayoutId}
            onLayoutChange={handleLayoutChange}
            selectedFilterId={selectedFilterId}
            onFilterChange={setSelectedFilterId}
            previewPhoto={capturedPhotos[0] ?? null}
            phase={phase}
            onCloseMobile={() => setShowPanel(false)}
          />
        </div>

      </main>
    </div>
  );
}

// ── Side Panel ──────────────────────────────────────────────────────────────
interface SidePanelProps {
  selectedLayoutId: string;
  onLayoutChange: (id: string) => void;
  selectedFilterId: string;
  onFilterChange: (id: string) => void;
  previewPhoto: string | null;
  phase: Phase;
  onCloseMobile?: () => void;
}

function SidePanel({ selectedLayoutId, onLayoutChange, selectedFilterId, onFilterChange, previewPhoto, phase, onCloseMobile }: SidePanelProps) {
  const layout = getLayout(selectedLayoutId);

  return (
    <div
      className="flex flex-col gap-5 lg:w-[320px] xl:w-[360px] glass rounded-2xl p-5 h-full overflow-y-auto lg:max-h-[calc(100vh-120px)]"
      style={{ flexShrink: 0 }}
    >
      {/* Mobile Header / Close */}
      <div className="flex justify-between items-center lg:hidden">
        <span className="font-semibold text-white/80 tracking-wide text-sm uppercase">Customization</span>
        <button onClick={onCloseMobile} className="p-2 glass glass-hover rounded-full">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      {/* Layout Picker */}
      <LayoutPicker selected={selectedLayoutId} onSelect={onLayoutChange} />

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Filter Picker */}
      <FilterPicker
        selected={selectedFilterId}
        onSelect={onFilterChange}
        previewPhoto={previewPhoto}
      />

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Info card */}
      <div
        className="rounded-xl p-4 flex flex-col gap-2"
        style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{layout.emoji}</span>
          <div>
            <p className="text-white/90 text-sm font-semibold">{layout.name}</p>
            <p className="text-white/40 text-xs">{layout.description}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mt-1">
          <Chip label={`${layout.photoCount} photo${layout.photoCount > 1 ? 's' : ''}`} color="#22d3ee" />
          <Chip label={`${layout.canvasWidth}×${layout.canvasHeight}px`} color="#60a5fa" />
          <Chip label={layout.tag} color="#f9a8d4" />
        </div>
      </div>

      {/* Tips */}
      {phase === 'setup' && (
        <div className="text-xs text-white/30 leading-relaxed">
          💡 <strong className="text-white/50">Tip:</strong> Allow camera access, pick a layout, choose a filter, then hit <em>Start Capture</em>. Each shot includes a 3-second countdown.
        </div>
      )}

      {/* Credit */}
      <div className="mt-auto pt-4 border-t border-white/5 text-center">
        <span className="text-[10px] text-white/30 tracking-widest uppercase">
          Developed by <strong className="text-white/60">Deyafa Arsetya</strong>
        </span>
      </div>
    </div>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  );
}
