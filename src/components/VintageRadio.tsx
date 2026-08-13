import React, { useState } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Radio } from 'lucide-react';

export const VintageRadio: React.FC = () => {
  const { isPlaying, togglePlay, nextSong, currentSong } = useMusicPlayer();
  const [frequency, setFrequency] = useState(92.7);
  const [knobRotation, setKnobRotation] = useState(45);

  const handleTune = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newFreq = (88 + percentage * 20).toFixed(1);
    setFrequency(parseFloat(newFreq));
    setKnobRotation((prev) => (prev + 45) % 360);
    nextSong();
  };

  const handleKnobClick = () => {
    setKnobRotation((prev) => (prev + 45) % 360);
    nextSong();
  };

  return (
    <div className="relative group select-none z-20 transition-transform duration-500 hover:scale-[1.03]">
      {/* Subtle warmth glow behind radio */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#E5AD54]/25 via-[#B9472F]/25 to-transparent blur-xl rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Radio Container */}
      <div className="relative w-72 sm:w-80 md:w-88 bg-gradient-to-b from-[#3A2116] via-[#24150F] to-[#1A0E0A] border-4 border-[#C88A3D]/50 rounded-lg p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
        
        {/* Telescopic Antenna */}
        <div className="absolute -top-16 left-6 w-1 h-20 bg-gradient-to-t from-[#888] via-[#ccc] to-[#eee] origin-bottom transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500 shadow-md">
          <div className="absolute top-0 -left-1 w-3 h-3 rounded-full bg-[#E5AD54] shadow-[0_0_8px_#E5AD54]" />
        </div>

        {/* Top Handle / Metal Trim */}
        <div className="h-2 w-full bg-gradient-to-r from-[#C88A3D]/40 via-[#E5AD54] to-[#C88A3D]/40 rounded-t mb-2 flex items-center justify-between px-2">
          <span className="text-[8px] font-mono tracking-widest text-[#24150F] font-bold flex items-center gap-1">
            <Radio className="w-2.5 h-2.5" /> NATIONAL TRANSISTOR • 1978
          </span>
          <span className="text-[7px] font-mono text-[#24150F] uppercase">3-BAND RECEIVER</span>
        </div>

        {/* Main Body Grid */}
        <div className="grid grid-cols-12 gap-3 items-stretch">
          
          {/* Left: Speaker Grill */}
          <div className="col-span-6 bg-[#1F120B] rounded border border-[#C88A3D]/20 p-2 relative overflow-hidden shadow-inner flex flex-col justify-between">
            {/* Woven Fabric Texture Grids */}
            <div className="space-y-1.5 opacity-90 my-auto">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-full bg-gradient-to-r from-[#C88A3D]/30 via-[#E5AD54]/70 to-[#C88A3D]/30 rounded-full shadow-xs ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            
            {/* Retro Emblem & Playing Song Info */}
            <div className="mt-2 text-center border-t border-[#C88A3D]/20 pt-1">
              <span className="text-[9px] font-serif font-bold text-[#E5AD54] tracking-wider uppercase block">
                Murphy Gold
              </span>
              <span className="text-[8px] font-mono text-[#F1D7A3]/70 truncate block max-w-full">
                {currentSong?.title || 'Radio Nostalgia'}
              </span>
            </div>
          </div>

          {/* Right: Tuning Dial & Controls */}
          <div className="col-span-6 flex flex-col justify-between space-y-2">
            
            {/* Frequency Display Window */}
            <div
              onClick={handleTune}
              className="bg-[#1A0D08] border-2 border-[#C88A3D]/50 rounded p-2 relative cursor-pointer group/dial overflow-hidden shadow-inner"
              title="Click dial to tune frequency & next song"
            >
              {/* Dial Scale Header */}
              <div className="flex justify-between text-[8px] font-mono text-[#E5AD54]/80 border-b border-[#C88A3D]/30 pb-0.5 mb-1">
                <span>MW</span>
                <span>SW1</span>
                <span>SW2</span>
              </div>

              {/* Frequencies numbers */}
              <div className="flex justify-between text-[7px] font-mono text-[#F1D7A3]/60 mb-1">
                <span>530</span>
                <span>800</span>
                <span>1200</span>
                <span>1600</span>
              </div>

              {/* Tuning Red/Amber Indicator Line */}
              <div
                className="absolute top-1 bottom-1 w-0.5 bg-[#C94B32] shadow-[0_0_8px_#C94B32] transition-all duration-300 pointer-events-none"
                style={{
                  left: `${((frequency - 88) / 20) * 80 + 10}%`,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#E5AD54] -translate-x-[2px] -translate-y-0.5 shadow-sm" />
              </div>

              {/* Dial Light Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5AD54]/10 to-transparent pointer-events-none animate-dial-glow" />

              <div className="text-[9px] text-right font-mono text-[#E5AD54] mt-1 font-bold">
                {frequency} MHz
              </div>
            </div>

            {/* Knobs & Buttons Section */}
            <div className="bg-[#24150F] p-2 rounded border border-[#C88A3D]/20 flex items-center justify-between">
              
              {/* Power / Light Indicator */}
              <button
                onClick={togglePlay}
                className="flex flex-col items-center group/btn focus:outline-none cursor-pointer"
                title={isPlaying ? 'Pause Radio (Space)' : 'Play Radio (Space)'}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border border-[#24150F] transition-all duration-300 shadow-md ${
                    isPlaying
                      ? 'bg-[#C94B32] shadow-[0_0_10px_#C94B32] animate-pulse'
                      : 'bg-[#3A2116]'
                  }`}
                />
                <span className="text-[7px] text-[#F1D7A3]/70 mt-0.5 font-mono">POWER</span>
              </button>

              {/* Volume Knob */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E5AD54] via-[#3A2116] to-[#1A0E0A] border border-[#C88A3D] flex items-center justify-center shadow-md cursor-pointer hover:rotate-45 transition-transform duration-300">
                  <div className="w-1 h-2 bg-[#F1D7A3] rounded-full transform -translate-y-1" />
                </div>
                <span className="text-[7px] text-[#F1D7A3]/70 mt-0.5 font-mono">VOL</span>
              </div>

              {/* Tuning Knob */}
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#C88A3D] via-[#24150F] to-[#E5AD54] border-2 border-[#E5AD54]/70 flex items-center justify-center shadow-lg cursor-pointer transition-transform duration-300"
                  style={{ transform: `rotate(${knobRotation}deg)` }}
                  onClick={handleKnobClick}
                  title="Click to change channel & next song"
                >
                  <div className="w-1 h-2.5 bg-[#C94B32] rounded-full transform -translate-y-1.5" />
                </div>
                <span className="text-[7px] text-[#F1D7A3]/70 mt-0.5 font-mono">TUNE</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Brass Plate Detail */}
        <div className="mt-2 text-center text-[8px] tracking-widest font-mono text-[#E5AD54]/70 uppercase border-t border-[#C88A3D]/20 pt-1 flex justify-between px-1">
          <span>HIGH SENSITIVITY</span>
          <span className="text-[#C94B32] font-bold">SOLID STATE</span>
          <span>MADE IN INDIA</span>
        </div>

      </div>
    </div>
  );
};
