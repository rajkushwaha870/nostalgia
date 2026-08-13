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
    <div className="w-full max-w-6xl mx-auto z-30 select-none px-2 sm:px-4 pb-2">
      {/* Translucent dark brown-black player floating naturally over the background artwork */}
      <div className="relative bg-[#140b07]/50 backdrop-blur-md rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 border border-[#F1D7A3]/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 transition-all">
        
        {/* LEFT: Album Art & Track Details */}
        <div className="flex items-center space-x-3 w-full md:w-1/3 min-w-0">
          {/* Small rounded album artwork */}
          <div className="relative group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#24150F] border border-[#F1D7A3]/20 shadow-md flex items-center justify-center overflow-hidden p-0.5">
              <div className="relative w-full h-full rounded-full bg-[#160c08] flex items-center justify-center">
                <Disc className={`w-6 h-6 text-[#E5AD54] transition-transform duration-1000 ${isPlaying ? 'animate-spin' : ''}`} />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#B9472F] border border-[#F1D7A3]" />
              </div>
            </div>
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1">
            <div className="text-[9px] font-mono tracking-widest text-[#E5AD54] uppercase font-semibold flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9472F] animate-pulse" />
              NOW PLAYING
            </div>
            <h3 className="text-xs sm:text-sm font-serif font-bold text-[#F1D7A3] truncate tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Lag Jaa Gale Se Phir
            </h3>
            <p className="text-[11px] text-[#F1D7A3]/70 truncate font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Lata Mangeshkar • <span className="italic opacity-80">Woh Kaun Thi? (1964)</span>
            </p>
          </div>

          {/* Favourite Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-1.5 rounded-full text-[#F1D7A3]/80 hover:text-[#B9472F] transition-colors focus:outline-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            title="Add to Favourites"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                isLiked ? 'fill-[#B9472F] text-[#B9472F] scale-110' : 'hover:scale-110'
              }`}
            />
          </button>
        </div>

        {/* CENTER: Player Controls & Progress Bar */}
        <div className="flex flex-col items-center w-full md:w-5/12 space-y-1.5">
          {/* Controls: Warm cream / golden control icons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Shuffle */}
            <button
              className="p-1 text-[#F1D7A3]/70 hover:text-[#F1D7A3] transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              title="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Previous */}
            <button
              className="p-1 text-[#F1D7A3]/90 hover:text-[#F1D7A3] transition-transform active:scale-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              title="Previous Song"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Play/Pause Button - Dusty red/terracotta active play button with warm cream icon */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#B9472F] hover:bg-[#C94B32] active:scale-95 transition-all text-[#F1D7A3] flex items-center justify-center shadow-[0_2px_10px_rgba(185,71,47,0.4)] border border-[#F1D7A3]/30"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F1D7A3]" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F1D7A3] translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              className="p-1 text-[#F1D7A3]/90 hover:text-[#F1D7A3] transition-transform active:scale-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              title="Next Song"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Repeat */}
            <button
              className="p-1 text-[#F1D7A3]/70 hover:text-[#F1D7A3] transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              title="Repeat"
            >
              <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Timeline Bar - Dusty Red / Terracotta Progress Bar */}
          <div className="w-full flex items-center space-x-2.5 text-[10px] sm:text-[11px] font-mono text-[#F1D7A3]/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <span>00:00</span>
            <div className="relative flex-1 h-1.5 bg-[#24150F]/70 rounded-full overflow-hidden border border-[#F1D7A3]/10 cursor-pointer group">
              <div className="h-full bg-[#B9472F] group-hover:bg-[#C94B32] w-[35%] rounded-full relative transition-colors">
                {/* Thumb Pin */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F1D7A3] shadow-sm" />
              </div>
            </div>
            <span>05:42</span>
          </div>
        </div>

        {/* RIGHT: Volume & Secondary Controls */}
        <div className="flex items-center justify-end space-x-3 w-full md:w-1/4">
          {/* Volume Control */}
          <div className="flex items-center space-x-2 text-[#F1D7A3]/80">
            <Volume2 className="w-4 h-4 text-[#F1D7A3]/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-[#24150F]/70 accent-[#B9472F] rounded-lg cursor-pointer border border-[#F1D7A3]/10"
              title={`Volume: ${volume}%`}
            />
          </div>

          {/* Playlist Icon Button */}
          <button
            className="p-1.5 rounded-full text-[#F1D7A3]/80 hover:text-[#F1D7A3] hover:bg-[#F1D7A3]/10 transition-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            title="Playlist Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
