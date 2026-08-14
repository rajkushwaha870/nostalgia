import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC = () => {
  const [phase, setPhase] = useState<'tuning' | 'title' | 'done'>('tuning');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Quick sequence: 600ms tuning -> 600ms title -> fade out
    const t1 = setTimeout(() => {
      setPhase('title');
    }, 600);

    const t2 = setTimeout(() => {
      setFadeOut(true);
    }, 1200);

    const t3 = setTimeout(() => {
      setPhase('done');
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#24150F] text-[#F1D7A3] transition-opacity duration-400 ease-out select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Vintage Radio Frequency Wave Indicator */}
      <div className="flex items-center space-x-1.5 mb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 bg-[#E5AD54] rounded-full animate-radio-signal-bar"
            style={{
              height: `${12 + (i % 3) * 8}px`,
              animationDelay: `${i * 0.12}s`,
              animationDuration: '0.8s',
            }}
          />
        ))}
      </div>

      {/* Dynamic Text Sequence */}
      <div className="text-center px-4">
        {phase === 'tuning' && (
          <p className="text-sm font-mono tracking-widest text-[#E5AD54] uppercase animate-pulse">
            tuning into memories...
          </p>
        )}
        {phase === 'title' && (
          <h1 className="text-3xl sm:text-4xl font-serif tracking-widest text-[#F1D7A3] font-bold drop-shadow-md animate-fade-in">
            NOSTALGIA
          </h1>
        )}
      </div>
    </div>
  );
};
