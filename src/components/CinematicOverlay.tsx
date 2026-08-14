import React from 'react';

export const CinematicOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10" aria-hidden="true">
      
      {/* 1. SUNSET ATMOSPHERIC GLOW */}
      {/* Soft warm radial glow over upper center sunset area */}
      <div
        className="absolute top-[10%] right-[30%] w-[380px] h-[380px] rounded-full bg-radial from-[#E5AD54]/30 via-[#C94B32]/15 to-transparent blur-3xl animate-sunset-glow"
        style={{ transform: 'translate(50%, -30%)' }}
      />

      {/* 2. TREE LEAF SWAY OVERLAY */}
      {/* Subtle leaf/branch shadow overlay swaying gently in top right / top left */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 opacity-20 mix-blend-soft-light animate-leaf-sway">
        <svg viewBox="0 0 400 400" className="w-full h-full text-[#24150F] fill-current">
          <path d="M350 0 C 300 50, 250 80, 200 120 C 230 140, 270 110, 320 60 Z M 280 80 C 240 130, 190 160, 150 200 C 180 210, 220 180, 270 120 Z" />
        </svg>
      </div>

      {/* 3. HANGING LANTERN FLICKER */}
      {/* Soft warm light flicker overlay around hanging tea stall lantern area */}
      <div
        className="absolute top-[32%] left-[42%] w-24 h-24 rounded-full bg-radial from-[#F1D7A3]/40 via-[#E5AD54]/20 to-transparent blur-xl animate-lantern-flicker"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* 4. VIGNETTE OVERLAY */}
      <div className="absolute inset-0 vignette-overlay opacity-90" />

      {/* 5. FILM GRAIN OVERLAY */}
      <div className="absolute inset-0 film-grain opacity-25 mix-blend-overlay" />
      
    </div>
  );
};
