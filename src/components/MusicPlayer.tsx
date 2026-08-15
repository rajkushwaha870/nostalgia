import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  AlertCircle,
  X,
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FavouriteButton } from './FavouriteButton';
import { MusicVisualizer } from './MusicVisualizer';

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
    clearError,
  } = useMusicPlayer();

  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState(false);
  const [artworkAnimate, setArtworkAnimate] = useState(false);

  const fallbackArtwork = '/hero-bg.png';
  const [artworkSrc, setArtworkSrc] = useState<string>(currentSong.artwork || fallbackArtwork);

  // Synchronize artwork image whenever song changes
  useEffect(() => {
    setArtworkSrc(currentSong.artwork || fallbackArtwork);
  }, [currentSong.id, currentSong.artwork]);

  const handleArtworkError = () => {
    if (artworkSrc !== fallbackArtwork) {
      setArtworkSrc(fallbackArtwork);
    }
  };

  // Smooth slide & fade transition trigger when song changes (duration 350ms)
  useEffect(() => {
    setArtworkAnimate(true);
    const timer = setTimeout(() => setArtworkAnimate(false), 350);
    return () => clearTimeout(timer);
  }, [currentSong.id]);

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
    <div className="w-full max-w-6xl mx-auto z-30 select-none px-2 sm:px-4 pb-2 relative" aria-label="Music Player Console">
      
      {/* Unobtrusive Error Toast */}
      {errorMessage && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1c0e09]/90 border border-[#B9472F]/50 text-[#F1D7A3] px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-lg backdrop-blur-md animate-fade-in z-40">
          <AlertCircle className="w-3.5 h-3.5 text-[#B9472F] shrink-0" />
          <span>{errorMessage}</span>
          <button
            onClick={clearError}
            aria-label="Dismiss error notification"
            className="p-0.5 hover:text-[#B9472F] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E5AD54] rounded"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Genuinely Transparent Glass Player Floating Over Background Artwork */}
      <div className="relative bg-[#140b07]/35 backdrop-blur-sm sm:backdrop-blur-md rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3 border border-[#F1D7A3]/15 shadow-[0_4px_24px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 transition-all">
        
        {/* LEFT: Album Art & Track Details with Song Change Slide & Fade Transition */}
        <div className="flex items-center space-x-3 w-full md:w-1/3 min-w-0 justify-between md:justify-start">
          {/* Track Details Container */}
          <div
            className={`flex items-center space-x-3 flex-1 min-w-0 transition-all duration-350 ease-out transform ${
              artworkAnimate ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
            }`}
          >
            {/* Small circular album artwork */}
            <div className="relative group shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#24150F]/80 border border-[#F1D7A3]/20 shadow-md flex items-center justify-center overflow-hidden p-0.5">
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={artworkSrc}
                    alt={currentSong.title || 'Album Artwork'}
                    loading="lazy"
                    className={`w-full h-full object-cover rounded-full ${isPlaying ? 'animate-spin' : ''}`}
                    style={{ borderRadius: '50%', objectFit: 'cover', animationDuration: '10s' }}
                    onError={handleArtworkError}
                  />
                  <div className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#B9472F] border border-[#F1D7A3]" />
                </div>
              </div>
            </div>

            {/* Track Info & Vintage Radio Signal Visualizer */}
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-mono tracking-widest text-[#E5AD54] uppercase font-semibold flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span className={`w-1.5 h-1.5 rounded-full bg-[#B9472F] ${isPlaying ? 'animate-pulse' : ''}`} />
                <span>NOW PLAYING</span>
                {/* Vintage Radio Signal Visualizer */}
                <MusicVisualizer isPlaying={isPlaying} />
              </div>
              <h3 className="text-xs sm:text-sm font-serif font-bold text-[#F1D7A3] truncate tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {currentSong.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#F1D7A3]/75 truncate font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {currentSong.artist} • <span className="italic opacity-80">{currentSong.album}</span>
              </p>
            </div>
          </div>

          {/* Favourite Button */}
          <FavouriteButton songId={currentSong.id} size={18} />
        </div>

        {/* CENTER: Player Controls & Progress Bar */}
        <div className="flex flex-col items-center w-full md:w-5/12 space-y-1 sm:space-y-1.5">
          {/* Controls */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
              className={`p-1 transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] rounded ${
                isShuffle ? 'text-[#B9472F]' : 'text-[#F1D7A3]/70 hover:text-[#F1D7A3]'
              }`}
              title={isShuffle ? 'Shuffle Enabled' : 'Enable Shuffle'}
            >
              <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Previous */}
            <button
              onClick={prevSong}
              aria-label="Previous track (or restart if playing past 3 seconds)"
              className="p-1 text-[#F1D7A3]/90 hover:text-[#F1D7A3] transition-transform active:scale-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] rounded"
              title="Previous Song (Restart if > 3s)"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Play/Pause Button - Dusty red/terracotta active play button with warm cream icon */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause music (Space)' : 'Play music (Space)'}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#B9472F] hover:bg-[#C94B32] active:scale-95 transition-all text-[#F1D7A3] flex items-center justify-center shadow-[0_2px_10px_rgba(185,71,47,0.4)] border border-[#F1D7A3]/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54]"
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
              aria-label="Next track"
              className="p-1 text-[#F1D7A3]/90 hover:text-[#F1D7A3] transition-transform active:scale-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] rounded"
              title="Next Song"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              aria-label={repeatMode === 'one' ? 'Disable repeat song' : 'Enable repeat song'}
              className={`p-1 transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] rounded ${
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
                aria-label="Seek playback position"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer focus-visible:opacity-100 focus-visible:accent-[#B9472F]"
                title={`Seek: ${formatTime(currentTime)} / ${formatTime(duration)}`}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT: Volume & Secondary Controls */}
        <div className="flex items-center justify-end space-x-3 w-full md:w-1/4 justify-between md:justify-end">
          {/* Volume Control */}
          <div className="flex items-center space-x-2 text-[#F1D7A3]/80">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
              className="p-1 hover:text-[#F1D7A3] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] rounded"
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
              aria-label="Volume level"
              className="w-16 sm:w-20 h-1 bg-[#24150F]/70 accent-[#B9472F] rounded-lg cursor-pointer border border-[#F1D7A3]/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E5AD54]"
              title={`Volume: ${isMuted ? 0 : volume}%`}
            />
          </div>

          {/* Playlist Queue Toggle Button */}
          <button
            onClick={() => setShowPlaylistDrawer((prev) => !prev)}
            aria-label="Toggle playlist queue drawer"
            className={`p-1.5 rounded-full transition-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] ${
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
