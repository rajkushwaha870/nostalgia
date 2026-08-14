import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const RadioGlow: React.FC = () => {
  const { isPlaying } = useMusicPlayer();

  return (
    <div
      className="absolute pointer-events-none transition-all duration-1000 ease-in-out z-10"
      style={{
        left: '24%',
        bottom: '28%',
        width: '180px',
        height: '140px',
        transform: 'translate(-50%, 50%)',
      }}
      aria-hidden="true"
    >
      {/* Warm ambient radial glow over the artwork transistor radio */}
      <div
        className={`w-full h-full rounded-full transition-all duration-1000 ease-in-out ${
          isPlaying
            ? 'opacity-80 scale-110 bg-radial from-[#E5AD54]/45 via-[#C88A3D]/20 to-transparent blur-2xl animate-pulse-slow'
            : 'opacity-25 scale-90 bg-radial from-[#E5AD54]/20 via-[#C88A3D]/10 to-transparent blur-xl'
        }`}
      />
    </div>
  );
};
