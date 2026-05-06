'use client';

import { motion } from 'framer-motion';
import { Download, RotateCcw, Camera, Loader2 } from 'lucide-react';

interface Props {
  phase: 'setup' | 'capture' | 'review';
  photoCount: number;
  capturedCount: number;
  onStart: () => void;
  onRetake: () => void;
  onDownload: () => void;
  isDownloading: boolean;
  canStart: boolean;
}

export default function ControlBar({
  phase, photoCount, capturedCount, onStart, onRetake, onDownload, isDownloading, canStart
}: Props) {
  if (phase === 'capture') {
    return (
      <div className="flex items-center justify-center gap-3">
        <div className="glass rounded-full px-6 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            {Array.from({ length: photoCount }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: 10,
                  height: 10,
                  background: i < capturedCount
                    ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                    : 'rgba(255,255,255,0.15)',
                  boxShadow: i < capturedCount ? '0 0 8px rgba(6,182,212,0.6)' : 'none',
                }}
              />
            ))}
          </div>
          <span className="text-white/60 text-sm font-medium">
            {capturedCount} / {photoCount} shots
          </span>
        </div>
      </div>
    );
  }

  if (phase === 'review') {
    return (
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <motion.button
          onClick={onRetake}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="glass glass-hover flex items-center gap-2 px-5 py-3 rounded-full text-white/80 text-sm font-medium transition-all cursor-pointer"
        >
          <RotateCcw size={15} />
          Retake
        </motion.button>

        <motion.button
          onClick={onDownload}
          disabled={isDownloading}
          whileHover={{ scale: isDownloading ? 1 : 1.04 }}
          whileTap={{ scale: isDownloading ? 1 : 0.96 }}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold cursor-pointer transition-all"
          style={{
            background: isDownloading
              ? 'rgba(6,182,212,0.4)'
              : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            boxShadow: isDownloading ? 'none' : '0 4px 20px rgba(6,182,212,0.4)',
          }}
        >
          {isDownloading ? (
            <><Loader2 size={15} className="animate-spin" /> Rendering…</>
          ) : (
            <><Download size={15} /> Download</>
          )}
        </motion.button>
      </div>
    );
  }

  // Setup phase
  return (
    <div className="flex items-center justify-center">
      <motion.button
        onClick={onStart}
        disabled={!canStart}
        whileHover={{ scale: canStart ? 1.04 : 1 }}
        whileTap={{ scale: canStart ? 0.96 : 1 }}
        className={`relative flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-base cursor-pointer overflow-hidden transition-all ${canStart ? 'breathing-glow' : ''}`}
        style={{
          background: canStart
            ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
            : 'rgba(255,255,255,0.1)',
          opacity: canStart ? 1 : 0.5,
        }}
      >
        {canStart && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
        )}
        <Camera size={18} />
        <span>Start Capture</span>
        <span className="text-white/60 text-sm font-normal">(Space)</span>
      </motion.button>
    </div>
  );
}
