import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  ListMusic,
  Disc,
} from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(75);

  return (
    <div className="w-full max-w-7xl mx-auto z-30 select-none px-2 sm:px-4 pb-3">
      {/* Container: Vintage Hand-Painted Audio Console Frame */}
      <div className="relative bg-gradient-to-r from-[#24150F]/95 via-[#3A2116]/95 to-[#24150F]/95 border-t-2 border-b-2 border-[#C88A3D]/40 rounded-xl p-3 sm:p-4 shadow-[0_-10px_35px_rgba(0,0,0,0.7)] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Subtle Decorative Golden Corner Accents */}
        <div className="absolute top-1 left-2 text-[10px] font-mono text-[#E5AD54]/40 tracking-widest pointer-events-none hidden sm:block">
          ✦ NOSTALGIA STEREO ✦
        </div>
        <div className="absolute top-1 right-2 text-[9px] font-mono text-[#C88A3D]/40 tracking-widest pointer-events-none hidden sm:block">
          HI-FI AUDIO SYSTEM
        </div>

        {/* LEFT: Album Art & Track Details */}
        <div className="flex items-center space-x-3.5 w-full md:w-1/3 min-w-0">
          {/* Vintage Cassette / Vinyl Album Cover Graphic */}
          <div className="relative group shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-gradient-to-br from-[#B9472F] via-[#3A2116] to-[#24150F] border border-[#E5AD54]/50 shadow-lg flex items-center justify-center overflow-hidden p-1">
              {/* Retro Vinyl Record Design */}
              <div className="relative w-full h-full rounded bg-[#1A0E0A] flex items-center justify-center border border-[#C88A3D]/30">
                <Disc className={`w-8 h-8 text-[#E5AD54] transition-transform duration-1000 ${isPlaying ? 'animate-spin' : ''}`} />
                <div className="absolute w-3 h-3 rounded-full bg-[#B9472F] border border-[#F1D7A3]" />
              </div>
            </div>
            {/* Soft Warm Glow */}
            <div className="absolute inset-0 bg-[#E5AD54]/10 rounded-md blur-xs group-hover:bg-[#E5AD54]/20 transition-all pointer-events-none" />
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1">
            <div className="text-[9px] font-mono tracking-widest text-[#C88A3D] uppercase font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C94B32] animate-pulse" />
              NOW PLAYING
            </div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#F1D7A3] truncate tracking-wide">
              Lag Jaa Gale Se Phir
            </h3>
            <p className="text-xs text-[#E5AD54]/80 truncate font-sans">
              Lata Mangeshkar • <span className="italic">Woh Kaun Thi? (1964)</span>
            </p>
          </div>

          {/* Favourite Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 rounded-full text-[#F1D7A3]/70 hover:text-[#C94B32] transition-colors focus:outline-none"
            title="Add to Favourites"
          >
            <Heart
              className={`w-5 h-5 transition-transform duration-300 ${
                isLiked ? 'fill-[#C94B32] text-[#C94B32] scale-110' : 'hover:scale-110'
              }`}
            />
          </button>
        </div>

        {/* CENTER: Player Controls & Progress Bar */}
        <div className="flex flex-col items-center w-full md:w-5/12 space-y-2">
          {/* Main Control Buttons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Shuffle */}
            <button
              className="p-1.5 text-[#F1D7A3]/60 hover:text-[#E5AD54] transition-colors cursor-pointer"
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
              className="p-1.5 text-[#F1D7A3]/80 hover:text-[#F1D7A3] transition-transform active:scale-90"
              title="Previous Song"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause Button (Vintage Metallic Ornament) */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#8F3025] via-[#C94B32] to-[#E5AD54] border-2 border-[#F1D7A3]/80 flex items-center justify-center shadow-[0_0_15px_rgba(201,75,50,0.5)] hover:scale-105 active:scale-95 transition-all text-[#24150F]"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-[#24150F]" />
              ) : (
                <Play className="w-5 h-5 fill-[#24150F] translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              className="p-1.5 text-[#F1D7A3]/80 hover:text-[#F1D7A3] transition-transform active:scale-90"
              title="Next Song"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Repeat */}
            <button
              className="p-1.5 text-[#F1D7A3]/60 hover:text-[#E5AD54] transition-colors cursor-pointer"
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Bar */}
          <div className="w-full flex items-center space-x-3 text-[11px] font-mono text-[#E5AD54]/80">
            <span>00:00</span>
            <div className="relative flex-1 h-2 bg-[#1A0E0A] rounded-full overflow-hidden border border-[#C88A3D]/30 cursor-pointer group">
              <div className="h-full bg-gradient-to-r from-[#B9472F] via-[#C94B32] to-[#E5AD54] w-[35%] rounded-full relative">
                {/* Brass Slider Handle Pin */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#F1D7A3] border border-[#24150F] shadow-md" />
              </div>
            </div>
            <span>05:42</span>
          </div>
        </div>

        {/* RIGHT: Volume & Secondary Controls */}
        <div className="flex items-center justify-end space-x-3 w-full md:w-1/4">
          {/* Volume Control */}
          <div className="flex items-center space-x-2 text-[#F1D7A3]/80">
            <Volume2 className="w-4 h-4 text-[#C88A3D]" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 sm:w-24 h-1.5 bg-[#1A0E0A] accent-[#E5AD54] rounded-lg cursor-pointer border border-[#C88A3D]/30"
              title={`Volume: ${volume}%`}
            />
          </div>

          {/* Playlist Icon Button */}
          <button
            className="p-2 rounded-lg bg-[#3A2116]/60 border border-[#C88A3D]/30 text-[#F1D7A3]/80 hover:text-[#E5AD54] hover:border-[#E5AD54] transition-all"
            title="Playlist Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
