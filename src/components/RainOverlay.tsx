import React, { useEffect, useRef, useMemo } from 'react';

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface ScreenDroplet {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  hasDrip?: boolean;
  delay?: number;
}

export const RainOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scattered small water droplets on glass / screen
  const screenDroplets: ScreenDroplet[] = useMemo(() => [
    { id: 1, x: 12, y: 18, size: 4.5, opacity: 0.75, hasDrip: true, delay: 1 },
    { id: 2, x: 13, y: 22, size: 2.5, opacity: 0.6 },
    { id: 3, x: 28, y: 35, size: 3.5, opacity: 0.7 },
    { id: 4, x: 42, y: 15, size: 5, opacity: 0.8, hasDrip: true, delay: 4 },
    { id: 5, x: 58, y: 28, size: 3, opacity: 0.65 },
    { id: 6, x: 72, y: 20, size: 4, opacity: 0.75 },
    { id: 7, x: 84, y: 42, size: 5.5, opacity: 0.8, hasDrip: true, delay: 2.5 },
    { id: 8, x: 86, y: 48, size: 2.5, opacity: 0.55 },
    { id: 9, x: 22, y: 65, size: 3.5, opacity: 0.65 },
    { id: 10, x: 68, y: 60, size: 4, opacity: 0.7, hasDrip: true, delay: 6 },
    { id: 11, x: 92, y: 75, size: 3, opacity: 0.6 },
    { id: 12, x: 8, y: 80, size: 4.5, opacity: 0.75 },
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize raindrops with wind trajectory
    const dropCount = Math.min(130, Math.floor(width / 9));
    const drops: Drop[] = [];
    const ripples: Ripple[] = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height,
        length: 14 + Math.random() * 20,
        speed: 18 + Math.random() * 14,
        opacity: 0.25 + Math.random() * 0.45,
        width: 1 + Math.random() * 0.8,
      });
    }

    const windAngle = -0.22; // Subtle natural wind angle

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update raindrops
      ctx.lineCap = 'round';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        ctx.lineWidth = d.width;
        ctx.strokeStyle = `rgba(240, 248, 255, ${d.opacity})`;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.length * windAngle, d.y + d.length);
        ctx.stroke();

        d.x += d.speed * windAngle;
        d.y += d.speed;

        // Reset drop when off-screen
        if (d.y > height) {
          // Occasional subtle surface splash ripple
          if (Math.random() < 0.18 && ripples.length < 20) {
            ripples.push({
              x: d.x,
              y: height - (Math.random() * 100 + 15),
              radius: 1,
              maxRadius: 5 + Math.random() * 7,
              opacity: 0.35,
            });
          }

          d.y = -d.length - Math.random() * 20;
          d.x = Math.random() * (width + 200) - 50;
        }
      }

      // Render ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 2, r.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(240, 248, 255, ${r.opacity})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        r.radius += 0.35;
        r.opacity -= 0.018;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10 animate-fade-in" aria-hidden="true">
      
      {/* 1. ORIGINAL WARM SUNSET ATMOSPHERIC GLOW (Preserves warm vintage look) */}
      <div
        className="absolute top-[10%] right-[30%] w-[380px] h-[380px] rounded-full bg-radial from-[#E5AD54]/25 via-[#C94B32]/10 to-transparent blur-3xl animate-sunset-glow"
        style={{ transform: 'translate(50%, -30%)' }}
      />

      {/* 2. TREE LEAVES & BRANCHES GENTLY SWAYING WITH THE WIND */}
      {/* Top-Right Tree Branch Silhouette */}
      <div className="absolute top-0 right-0 w-2/5 h-1/2 opacity-25 mix-blend-soft-light animate-wind-sway">
        <svg viewBox="0 0 400 400" className="w-full h-full text-[#24150F] fill-current">
          <path d="M380 0 C 320 60, 260 90, 190 130 C 225 155, 275 120, 335 65 Z M 290 85 C 235 140, 180 175, 130 215 C 165 225, 215 190, 275 125 Z M 390 110 C 330 160, 270 200, 200 240 C 235 250, 280 220, 340 170 Z" />
        </svg>
      </div>

      {/* Top-Left Subtle Leaf Silhouette Sway */}
      <div
        className="absolute top-0 left-0 w-1/4 h-1/3 opacity-20 mix-blend-soft-light animate-wind-sway"
        style={{ animationDelay: '-2.5s' }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full text-[#24150F] fill-current transform scale-x-[-1]">
          <path d="M280 0 C 220 50, 170 80, 120 120 C 150 135, 190 110, 240 60 Z M 200 80 C 150 125, 110 155, 70 190 C 100 200, 140 170, 190 115 Z" />
        </svg>
      </div>

      {/* 3. SLIGHT RAIN MIST (Soft, light, translucent, 0% darkening) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.02] animate-mist-drift" />

      {/* 4. ANIMATED FALLING RAIN CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 5. OCCASIONAL SMALL WATER DROPLETS ON SCREEN */}
      {screenDroplets.map((drop) => (
        <div
          key={drop.id}
          className={`absolute rounded-full pointer-events-none transition-opacity duration-500 ${
            drop.hasDrip ? 'animate-droplet-drip' : ''
          }`}
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            width: `${drop.size}px`,
            height: `${drop.size * 1.15}px`,
            opacity: drop.opacity,
            animationDelay: drop.delay ? `${drop.delay}s` : undefined,
            background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 40%, rgba(200, 225, 255, 0.15) 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.25)',
            border: '0.5px solid rgba(255, 255, 255, 0.4)',
          }}
        />
      ))}

      {/* 6. HANGING LANTERN FLICKER (Warm light shining through rain) */}
      <div
        className="absolute top-[32%] left-[42%] w-28 h-28 rounded-full bg-radial from-[#F1D7A3]/45 via-[#E5AD54]/25 to-transparent blur-xl animate-lantern-flicker"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* 7. FILM GRAIN & VIGNETTE (Standard original overlays) */}
      <div className="absolute inset-0 vignette-overlay opacity-80" />
      <div className="absolute inset-0 film-grain opacity-25 mix-blend-overlay" />

    </div>
  );
};
