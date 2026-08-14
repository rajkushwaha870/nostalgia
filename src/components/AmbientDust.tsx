import React, { useMemo } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  opacity: number;
}

export const AmbientDust: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

  // Generate lightweight deterministic-like floating dust particles
  const particles: Particle[] = useMemo(() => {
    const count = isMobile ? 8 : 24;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1.5, // 1.5px - 4px
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 12 + Math.random() * 14, // 12s - 26s slow drift
      opacity: 0.25 + Math.random() * 0.35, // 0.25 - 0.6 opacity
    }));
  }, [isMobile]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#E5AD54] animate-dust-float"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: '0 0 5px rgba(229, 173, 84, 0.6)',
          }}
        />
      ))}
    </div>
  );
};
