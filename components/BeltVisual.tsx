import React from 'react';
import { BeltRank } from '../types';
import { BELT_COLORS } from '../constants';
import { motion } from 'framer-motion';

interface BeltVisualProps {
  rank: BeltRank;
  stripes: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BeltVisual: React.FC<BeltVisualProps> = ({ rank, stripes, className = '', size = 'md' }) => {
  const colors = BELT_COLORS[rank];

  // Map size to pixel heights for better control
  const height = size === 'sm' ? 32 : size === 'md' ? 64 : 96;
  const fontSize = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-[18px]' : 'text-[24px]';

  // Rank Bar Color (Black for most, Red for Black belt)
  const rankBarColor = rank === BeltRank.BLACK ? 'bg-red-700' : 'bg-black';

  return (
    <motion.div
      className={`relative w-full rounded-[8px] overflow-hidden flex items-center ${colors.main} shadow-lg ${className}`}
      style={{ height }}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Texture Overlay (Cloth pattern simulation) */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
      
      {/* 3D Lighting Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20 pointer-events-none" />

      {/* Main Belt Area */}
      <div className="flex-grow relative h-full flex items-center pl-4 z-10">
        <span className={`font-black tracking-widest uppercase italic drop-shadow-md text-white/90 ${fontSize}`}>
          {rank}
        </span>
      </div>

      {/* Rank Bar (Black Bar) */}
      <div className={`relative h-full w-[25%] max-w-[100px] ${rankBarColor} flex items-center justify-evenly px-1 shadow-inner z-10 border-l border-black/20`}>
        {/* Stripes */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-[70%] w-2 rounded-[1px] shadow-sm transform ${
              i < stripes ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : 'bg-white/5'
            } ${size === 'sm' ? 'w-1' : 'w-3'}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BeltVisual;