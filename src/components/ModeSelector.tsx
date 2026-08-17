import React from 'react';
import { Sun, Moon, CloudRain } from 'lucide-react';
import { useSceneMode } from '../context/SceneModeContext';
import type { SceneMode } from '../context/SceneModeContext';

export const ModeSelector: React.FC = () => {
  const { mode, setMode } = useSceneMode();

  const modes: { id: SceneMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'normal', label: 'NORMAL', icon: Sun },
    { id: 'night', label: 'NIGHT', icon: Moon },
    { id: 'rain', label: 'RAIN', icon: CloudRain },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Scene Mode Selector"
      className="inline-flex items-center bg-[#1E110C]/85 backdrop-blur-md border border-[#C88A3D]/40 rounded-full p-0.5 sm:p-1 shadow-[0_2px_12px_rgba(0,0,0,0.4)] select-none"
    >
      <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#E5AD54] uppercase px-2 hidden lg:inline font-semibold">
        MODE:
      </span>

      <div className="flex items-center space-x-1">
        {modes.map((item) => {
          const Icon = item.icon;
          const isActive = mode === item.id;

          return (
            <button
              key={item.id}
              role="radio"
              aria-checked={isActive}
              onClick={() => setMode(item.id)}
              className={`group flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-medium tracking-wider transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E5AD54] ${
                isActive
                  ? 'bg-[#B9472F] text-[#F1D7A3] font-semibold shadow-[0_2px_8px_rgba(185,71,47,0.45)] border border-[#F1D7A3]/30 scale-102'
                  : 'text-[#F1D7A3]/75 hover:text-[#F1D7A3] hover:bg-[#3A2116]/60 border border-transparent'
              }`}
              title={`Switch to ${item.label} mode`}
            >
              <Icon
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 ${
                  isActive
                    ? 'text-[#F1D7A3] scale-110'
                    : 'text-[#C88A3D] group-hover:text-[#E5AD54] group-hover:scale-105'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
