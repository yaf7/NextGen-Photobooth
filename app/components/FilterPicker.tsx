'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FILTERS } from '../lib/filters';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
  previewPhoto?: string | null;
}

export default function FilterPicker({ selected, onSelect, previewPhoto }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Filter
      </h3>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        {FILTERS.map((filter, i) => {
          const isSelected = selected === filter.id;
          return (
            <motion.button
              key={filter.id}
              onClick={() => onSelect(filter.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer"
            >
              {/* Swatch / preview */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  border: isSelected
                    ? '2px solid #06b6d4'
                    : '2px solid rgba(255,255,255,0.1)',
                  boxShadow: isSelected
                    ? '0 0 14px rgba(6,182,212,0.6)'
                    : 'none',
                  transition: 'all 0.2s',
                  background: filter.swatchGradient,
                }}
              >
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt={filter.name}
                    className="w-full h-full object-cover"
                    style={{ filter: filter.cssFilter }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xl"
                    style={{ filter: filter.id === 'none' ? 'none' : filter.cssFilter }}
                  >
                    {filter.emoji}
                  </div>
                )}
                {isSelected && (
                  <motion.div
                    layoutId="filter-selected"
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(6,182,212,0.25)' }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: '#06b6d4' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>

              <span
                className="text-[10px] font-medium text-center leading-tight"
                style={{ color: isSelected ? '#22d3ee' : 'rgba(255,255,255,0.5)', maxWidth: 56 }}
              >
                {filter.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
