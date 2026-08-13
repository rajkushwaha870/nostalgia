import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Disc,
  AlertCircle,
  X,
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const formatTime = (secs: number): string => {
  if (isNaN(secs) || secs < 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    errorMessage,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    clearError,
    isFavorite,
  } = useMusicPlayer();

  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState(false);
  const [artworkAnimate, setArtworkAnimate] = useState(false);

  // Subtle animation trigger when song changes
  useEffect(() => {
    setArtworkAnimate(true);
    const timer = setTimeout(() => setArtworkAnimate(false), 400);
    return () => clearTimeout(timer);
  }, [currentSong.id]);

  const liked = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4 h-4 text-[#B9472F] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />;
    }
    if (volume < 50) {
      return <Volume1 className="w-4 h-4 text-[#F1D7A3]/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />;
    }
    return <Volume2 className="w-4 h-4 text-[#F1D7A3]/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto z-30 select-none px-2 sm:px-4 pb-2 relative">
      
      {/* Unobtrusive Error Toast */}
      {errorMessage && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1c0e09]/90 border border-[#B9472F]/50 text-[#F1D7A3] px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-lg backdrop-blur-md animate-fade-in z-40">
          <AlertCircle className="w-3.5 h-3.5 text-[#B9472F] shrink-0" />
          <span>{errorMessage}</span>
          <button onClick={clearError} className="p-0.5 hover:text-[#B9472F] transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Translucent dark brown-black player floating naturally over the background artwork */}
      <div className="relative bg-[#140b07]/50 backdrop-blur-md rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 border border-[#F1D7A3]/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 transition-all">
        
        {/* LEFT: Album Art & Track Details */}
        <div className="flex items-center space-x-3 w-full md:w-1/3 min-w-0">
          {/* Small rounded album artwork */}
          <div className="relative group shrink-0">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#24150F] border border-[#F1D7A3]/20 shadow-md flex items-center justify-center overflow-hidden p-0.5 transition-all duration-300 ${
                artworkAnimate ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
              }`}
            >
              {currentSong.artwork ? (
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={currentSong.artwork}
                    alt={currentSong.title}
                    className={`w-full h-full object-cover rounded-full ${isPlaying ? 'animate-spin' : ''}`}
                    style={{ animationDuration: '10s' }}
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-[#B9472F] border border-[#F1D7A3]" />
                </div>
              ) : (
                <div className="relative w-full h-full rounded-full bg-[#160c08] flex items-center justify-center">
                  <Disc className={`w-6 h-6 text-[#E5AD54] transition-transform duration-1000 ${isPlaying ? 'animate-spin' : ''}`} />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-[#B9472F] border border-[#F1D7A3]" />
                </div>
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className={`min-w-0 flex-1 transition-opacity duration-300 ${artworkAnimate ? 'opacity-70' : 'opacity-100'}`}>
            <div className="text-[9px] font-mono tracking-widest text-[#E5AD54] uppercase font-semibold flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#B9472F] ${isPlaying ? 'animate-pulse' : ''}`} />
              NOW PLAYING
            </div>
            <h3 className="text-xs sm:text-sm font-serif font-bold text-[#F1D7A3] truncate tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {currentSong.title}
            </h3>
            <p className="text-[11px] text-[#F1D7A3]/70 truncate font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {currentSong.artist} • <span className="italic opacity-80">{currentSong.album}</span>
            </p>
          </div>

          {/* Favourite Button */}
          <button
            onClick={() => toggleFavorite(currentSong.id)}
            className="p-1.5 rounded-full text-[#F1D7A3]/80 hover:text-[#B9472F] transition-colors focus:outline-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer"
            title={liked ? 'Remove from Favourites' : 'Add to Favourites'}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                liked ? 'fill-[#B9472F] text-[#B9472F] scale-110' : 'hover:scale-110 text-[#F1D7A3]/80'
              }`}
            />
          </button>
        </div>

        {/* CENTER: Player Controls & Progress Bar */}
        <div className="flex flex-col items-center w-full md:w-5/12 space-y-1.5">
          {/* Controls */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-1 transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                isShuffle ? 'text-[#B9472F]' : 'text-[#F1D7A3]/70 hover:text-[#F1D7A3]'
              }`}
              title={isShuffle ? 'Shuffle Enabled' : 'Enable Shuffle'}
            >
              <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Previous */}
            <button
              onClick={prevSong}
              className="p-1 text-[#F1D7A3]/90 hover:text-[#F1D7A3] transition-transform active:scale-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer"
              title="Previous Song (Restart if > 3s)"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Play/Pause Button - Dusty red/terracotta active play button with warm cream icon */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#B9472F] hover:bg-[#C94B32] active:scale-95 transition-all text-[#F1D7A3] flex items-center justify-center shadow-[0_2px_10px_rgba(185,71,47,0.4)] border border-[#F1D7A3]/30 cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F1D7A3]" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F1D7A3] translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextSong}
              className="p-1 text-[#F1D7A3]/90 hover:text-[#F1D7A3] transition-transform active:scale-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer"
              title="Next Song"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`p-1 transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] relative ${
                repeatMode === 'one' ? 'text-[#B9472F]' : 'text-[#F1D7A3]/70 hover:text-[#F1D7A3]'
              }`}
              title={repeatMode === 'one' ? 'Repeat Song Active' : 'Repeat Off'}
            >
              <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 text-[8px] font-bold leading-none bg-[#B9472F] text-[#F1D7A3] rounded-full w-2.5 h-2.5 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Timeline Bar - Dusty Red / Terracotta Progress Bar */}
          <div className="w-full flex items-center space-x-2.5 text-[10px] sm:text-[11px] font-mono text-[#F1D7A3]/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <span>{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1.5 bg-[#24150F]/70 rounded-full overflow-hidden border border-[#F1D7A3]/10 cursor-pointer group flex items-center">
              <div
                className="h-full bg-[#B9472F] group-hover:bg-[#C94B32] rounded-full relative transition-colors"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Thumb Pin */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F1D7A3] shadow-sm" />
              </div>
              {/* Invisible range slider for smooth seeking & dragging */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeekChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title={`Seek: ${formatTime(currentTime)} / ${formatTime(duration)}`}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT: Volume & Secondary Controls */}
        <div className="flex items-center justify-end space-x-3 w-full md:w-1/4">
          {/* Volume Control */}
          <div className="flex items-center space-x-2 text-[#F1D7A3]/80">
            <button
              onClick={toggleMute}
              className="p-1 hover:text-[#F1D7A3] transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {renderVolumeIcon()}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-[#24150F]/70 accent-[#B9472F] rounded-lg cursor-pointer border border-[#F1D7A3]/10"
              title={`Volume: ${isMuted ? 0 : volume}%`}
            />
          </div>

          {/* Playlist Queue Toggle Button */}
          <button
            onClick={() => setShowPlaylistDrawer((prev) => !prev)}
            className={`p-1.5 rounded-full transition-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer ${
              showPlaylistDrawer
                ? 'text-[#B9472F] bg-[#F1D7A3]/10'
                : 'text-[#F1D7A3]/80 hover:text-[#F1D7A3] hover:bg-[#F1D7A3]/10'
            }`}
            title="Playlist Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
