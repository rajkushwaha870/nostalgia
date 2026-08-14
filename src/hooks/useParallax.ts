import { useState, useEffect } from 'react';

interface ParallaxOffset {
  bgX: number;
  bgY: number;
  fgX: number;
  fgY: number;
}

export const useParallax = (): ParallaxOffset => {
  const [offset, setOffset] = useState<ParallaxOffset>({
    bgX: 0,
    bgY: 0,
    fgX: 0,
    fgY: 0,
  });

  useEffect(() => {
    // Check for reduced motion preference or small screen (mobile)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized coordinates (-1 to 1) from window center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;

      // Extremely subtle shifts: background 2-4px max, foreground 4-6px max
      animationFrameId = requestAnimationFrame(() => {
        setOffset({
          bgX: normX * 3, // ~3px max movement
          bgY: normY * 2,
          fgX: normX * -5, // opposite subtle movement for depth
          fgY: normY * -3,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return offset;
};
