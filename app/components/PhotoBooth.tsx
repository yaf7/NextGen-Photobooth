'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
import { playCountdownBeep, playShutterClick } from '../lib/audio';

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
        playCountdownBeep();
        await delay(900);
      }

      // Capture moment
      setCountdown(0);
      await delay(200);
      setIsFlashing(true);
      playShutterClick();
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (like caption)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' && phase === 'setup') {
        e.preventDefault(); // prevent scrolling
        startCapture();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, startCapture]);

  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center overflow-hidden" style={{ zIndex: 1 }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/dokumen/logo-nexgen.png"
            alt="NextGen Logo"
            className="w-8 h-8 object-contain rounded-lg bg-white p-1 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
          />
          <div>
            <span className="font-display font-bold gradient-text text-xl tracking-tight pr-1">NextGen</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/40 text-xs">
          <span className="hidden sm:inline">v1.0 Beta</span>
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
      <div className="w-full flex-1 min-h-0 flex justify-center pb-6">
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] w-full relative">

          {/* ── Left: Camera & Review Area ──────────────────────────────── */}
          <div className="flex-1 flex flex-col min-h-0 relative items-center justify-center">

            {/* Main Stage (Camera or PhotoStrip) */}
            <div
              className="relative w-full flex-1 min-h-0 rounded-[32px] overflow-hidden flex items-center justify-center bg-black/40 backdrop-blur-md group"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              <AnimatePresence mode="wait">
                {phase !== 'review' ? (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: countdown ? 1 + (4 - countdown) * 0.02 : 1 
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <CameraView
                      ref={cameraRef}
                      filterCss={filterCss}
                      isFlashing={isFlashing}
                      facingMode={facingMode}
                    />

                    {/* Viewfinder brackets */}
                    <div className="absolute inset-8 pointer-events-none z-10 flex flex-col justify-between opacity-50 transition-opacity duration-500 group-hover:opacity-100 hidden sm:flex">
                      <div className="flex justify-between">
                        <div className="w-12 h-12 border-t-[3px] border-l-[3px] border-white/40 rounded-tl-3xl" />
                        <div className="w-12 h-12 border-t-[3px] border-r-[3px] border-white/40 rounded-tr-3xl" />
                      </div>
                      <div className="flex justify-between">
                        <div className="w-12 h-12 border-b-[3px] border-l-[3px] border-white/40 rounded-bl-3xl" />
                        <div className="w-12 h-12 border-b-[3px] border-r-[3px] border-white/40 rounded-br-3xl" />
                      </div>
                    </div>

                    {/* Camera flip toggle */}
                    {phase === 'setup' && (
                      <button
                        onClick={() => setFacingMode(m => m === 'user' ? 'environment' : 'user')}
                        className="absolute top-6 right-6 glass glass-hover p-3 rounded-full text-white/80 transition-all z-20 shadow-lg"
                        title="Switch Camera"
                      >
                        <FlipHorizontal size={20} />
                      </button>
                    )}

                    {/* Shot thumbnails during capture */}
                    {phase === 'capture' && capturedPhotos.length > 0 && (
                      <div className="absolute bottom-28 right-8 flex flex-col gap-3 z-20">
                        {capturedPhotos.map((p, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-xl overflow-hidden"
                            style={{
                              width: 64, height: 48,
                              border: '2px solid rgba(6,182,212,0.8)',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                            }}
                          >
                            <img src={p} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" style={{ filter: filterCss }} />
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Shot indicator */}
                    {phase === 'capture' && (
                      <div className="absolute top-6 left-6 glass rounded-full px-4 py-2 text-sm font-semibold text-white/90 shadow-lg z-20">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                           Shot {currentShot + 1} of {layout.photoCount}
                        </div>
                      </div>
                    )}

                    <CountdownOverlay value={countdown} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center p-8 overflow-y-auto custom-scrollbar"
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

              {/* Floating Control Bar inside Camera View at the bottom */}
              <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-4 pointer-events-none">
                 <div className="pointer-events-auto">
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
                 </div>
              </div>
            </div>

            {/* Caption input (review only) */}
            <AnimatePresence>
              {phase === 'review' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="w-full max-w-md mt-4"
                >
                  <input
                    type="text"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="Add a caption to your photostrip…"
                    maxLength={60}
                    className="w-full px-5 py-4 rounded-2xl text-sm text-white placeholder-white/40 outline-none transition-all shadow-xl"
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(20px)'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.2)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Customization Panel ──────────────────────────────── */}
          {/* Mobile toggle */}
          <div className="lg:hidden shrink-0 mt-4">
            <button
              onClick={() => setShowPanel(v => !v)}
              className="w-full glass rounded-2xl px-5 py-4 flex items-center justify-between text-white/90 text-sm font-semibold shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Settings2 size={18} className="text-cyan-400" />
                <span>Customize Style</span>
              </div>
              <ChevronDown
                size={18}
                style={{ transform: showPanel ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}
              />
            </button>
          </div>

          {/* Unified panel: visible on mobile when toggled as an absolute overlay, always visible on lg+ */}
          <div className={`
          absolute inset-x-4 bottom-[72px] top-4 z-50 lg:static lg:inset-auto lg:z-auto lg:h-full
          ${showPanel ? 'block' : 'hidden'} lg:block
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
  const [activeTab, setActiveTab] = useState<'layout' | 'filter'>('layout');
  const layout = getLayout(selectedLayoutId);

  return (
    <div
      className="flex flex-col w-full h-full lg:w-[380px] xl:w-[420px] rounded-[32px] overflow-hidden relative"
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        backdropFilter: 'blur(30px)',
      }}
    >
      {/* Mobile Header / Close */}
      <div className="flex justify-between items-center lg:hidden p-5 pb-0">
        <span className="font-semibold text-white/80 tracking-wide text-sm uppercase">Customization</span>
        <button onClick={onCloseMobile} className="p-2 glass glass-hover rounded-full">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Customization Tabs */}
      <div className="flex p-1.5 gap-1.5 bg-black/40 m-5 mb-3 rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'layout' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          Layouts
        </button>
        <button
          onClick={() => setActiveTab('filter')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'filter' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          Filters
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5 custom-scrollbar min-h-0">
        {activeTab === 'layout' ? (
          <LayoutPicker selected={selectedLayoutId} onSelect={onLayoutChange} />
        ) : (
          <FilterPicker selected={selectedFilterId} onSelect={onFilterChange} previewPhoto={previewPhoto} />
        )}
      </div>

      {/* Info card at the bottom */}
      <div className="p-5 pt-4 border-t border-white/5 bg-black/20 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-2xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            {layout.emoji}
          </div>
          <div>
            <p className="text-white/90 font-semibold text-sm">{layout.name}</p>
            <div className="flex gap-2 mt-1">
               <span className="text-[10px] text-cyan-200 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/20">{layout.photoCount} shots</span>
               <span className="text-[10px] text-indigo-200 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/20">{layout.tag}</span>
            </div>
          </div>
        </div>
        
        {phase === 'setup' && (
          <div className="text-[11px] text-white/40 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2">
            <Sparkles size={14} className="text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Allow camera access, pick a style, then hit <strong className="text-white/70 font-medium">Start Capture</strong> or press <kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/10 font-mono">Space</kbd>.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
