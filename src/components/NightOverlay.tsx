import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

export const NightOverlay: React.FC = () => {
  // Deterministic stars in upper sky portion (0% - 50% height)
  const stars: Star[] = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: 5 + (i * 2.6 + ((i * 17) % 23)) % 90,
      y: 3 + ((i * 13 + 7) % 45),
      size: ((i * 7) % 3 === 0 ? 2.5 : ((i * 3) % 2 === 0 ? 1.8 : 1.2)),
      opacity: 0.35 + (((i * 11) % 55) / 100),
      delay: (i * 0.35) % 4,
      duration: 2.5 + ((i * 5) % 3),
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10 animate-fade-in" aria-hidden="true">
      {/* 1. EVENING ATMOSPHERIC DEEP BLUE / BLACK TINT */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050C1B]/80 via-[#091428]/65 to-[#140C08]/75 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[#071124]/30 mix-blend-color" />

      {/* 2. MOONLIGHT GLOW IN UPPER SKY */}
      <div
        className="absolute top-[8%] right-[25%] w-[320px] h-[320px] rounded-full bg-radial from-[#D4E8FF]/35 via-[#6894C9]/15 to-transparent blur-3xl animate-pulse-slow"
        style={{ transform: 'translate(50%, -20%)' }}
      />
      {/* Soft Moon Crescent Silhouette */}
      <div className="absolute top-[8%] right-[26%] w-10 h-10 rounded-full bg-[#EAF2FF] shadow-[0_0_24px_rgba(209,230,255,0.7)] opacity-85">
        <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-[#091428] opacity-90" />
      </div>

      {/* 3. SUBTLE TWINKLING STARS */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-[#FFFFFF] animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: `0 0 3px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}

      {/* 4. WARM LIGHTS REMAIN VIBRANT & VISIBLE */}
      {/* Hanging Lantern warm golden glow enhanced against the night */}
      <div
        className="absolute top-[32%] left-[42%] w-36 h-36 rounded-full bg-radial from-[#FFCA6A]/55 via-[#E5AD54]/30 to-transparent blur-2xl animate-lantern-flicker"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Tea stall counter & kettle warm interior lighting */}
      <div
        className="absolute top-[52%] left-[48%] w-48 h-36 rounded-full bg-radial from-[#FFAD42]/30 via-[#B9472F]/15 to-transparent blur-3xl"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 vignette-overlay opacity-95" />
    </div>
  );
};
