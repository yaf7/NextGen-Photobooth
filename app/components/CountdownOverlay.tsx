'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  value: number | null; // null = hidden, 0 = "SMILE!", 1-3 = countdown
}

export default function CountdownOverlay({ value }: Props) {
  const display = value === 0 ? '😊' : value;

  return (
    <AnimatePresence>
      {value !== null && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ scale: 4.5, opacity: 0, y: -40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex flex-col items-center gap-4"
            >
              <span
                className="font-display font-black leading-none select-none"
                style={{
                  fontSize: value === 0 ? '8rem' : '18rem',
                  background: 'linear-gradient(135deg, #22d3ee, #60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 50px rgba(34,211,238,0.9))',
                }}
              >
                {display}
              </span>
              {value === 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-2xl font-semibold tracking-widest uppercase"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                  Capturing…
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
