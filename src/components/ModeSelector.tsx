import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, CloudRain, ChevronDown, Sparkles } from 'lucide-react';
import { useSceneMode } from '../context/SceneModeContext';
import type { SceneMode } from '../context/SceneModeContext';

export const ModeSelector: React.FC = () => {
  const { mode, setMode } = useSceneMode();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modes: { id: SceneMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'normal', label: 'NORMAL', icon: Sun },
    { id: 'night', label: 'NIGHT', icon: Moon },
    { id: 'rain', label: 'RAIN', icon: CloudRain },
  ];

  const currentModeObj = modes.find((m) => m.id === mode) || modes[0];
  const CurrentIcon = currentModeObj.icon;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectMode = (newMode: SceneMode) => {
    setMode(newMode);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left select-none" ref={dropdownRef}>
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Current mode: ${currentModeObj.label}. Click to change mode.`}
        className={`group flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium tracking-wider backdrop-blur-md border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E5AD54] ${
          isOpen
            ? 'bg-[#3A2116]/90 text-[#F1D7A3] border-[#E5AD54] shadow-[0_0_12px_rgba(229,173,84,0.3)]'
            : 'bg-[#1E110C]/85 text-[#F1D7A3]/90 hover:text-[#F1D7A3] hover:bg-[#3A2116]/70 border-[#C88A3D]/40 hover:border-[#E5AD54]/60 shadow-[0_2px_10px_rgba(0,0,0,0.4)]'
        }`}
      >
        <CurrentIcon className="w-3.5 h-3.5 text-[#E5AD54] transition-transform duration-200 group-hover:scale-110" />
        <span className="hidden sm:inline font-semibold uppercase tracking-widest text-[10px] sm:text-[11px] text-[#F1D7A3]">
          MODE
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#C88A3D] transition-transform duration-200 hidden sm:inline ${
            isOpen ? 'rotate-180 text-[#E5AD54]' : 'group-hover:text-[#F1D7A3]'
          }`}
        />
      </button>

      {/* Popover / Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-36 rounded-xl bg-[#1E110C]/95 backdrop-blur-xl border border-[#C88A3D]/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)] py-1.5 z-50 animate-fade-in divide-y divide-[#C88A3D]/15 focus:outline-none"
        >
          <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-[#E5AD54]/70 flex items-center space-x-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Select Ambience</span>
          </div>

          <div className="py-1 space-y-0.5 px-1">
            {modes.map((item) => {
              const Icon = item.icon;
              const isActive = mode === item.id;

              return (
                <button
                  key={item.id}
                  role="menuitem"
                  onClick={() => handleSelectMode(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#B9472F] text-[#F1D7A3] font-semibold shadow-[0_2px_8px_rgba(185,71,47,0.4)] border border-[#F1D7A3]/30'
                      : 'text-[#F1D7A3]/80 hover:text-[#F1D7A3] hover:bg-[#3A2116]/80'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-[#F1D7A3]' : 'text-[#C88A3D]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F1D7A3] shadow-[0_0_6px_rgba(241,215,163,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
