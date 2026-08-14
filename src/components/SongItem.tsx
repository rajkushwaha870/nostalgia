import React from 'react';
import { Play, Pause, Disc } from 'lucide-react';
import type { Song } from '../data/songs';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FavouriteButton } from './FavouriteButton';

interface SongItemProps {
  song: Song;
  index: number;
  onPlaySong: (song: Song) => void;
}

const formatDuration = (secs: number): string => {
  if (!secs || isNaN(secs)) return '03:45';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const SongItem: React.FC<SongItemProps> = ({ song, index, onPlaySong }) => {
  const { currentSong, isPlaying, duration, togglePlay } = useMusicPlayer();

  const isCurrentTrack = currentSong?.id === song.id;
  const isCurrentTrackPlaying = isCurrentTrack && isPlaying;

  const handleRowClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      onPlaySong(song);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick();
    }
  };

  const formattedIndex = (index + 1).toString().padStart(2, '0');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      aria-label={`Play ${song.title} by ${song.artist}`}
      className={`group relative flex items-center justify-between px-3.5 py-3 rounded-md transition-all duration-200 cursor-pointer select-none border-b border-[#C88A3D]/10 hover:bg-[#3A2116]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] ${
        isCurrentTrack
          ? 'bg-[#3A2116]/80 border-l-4 border-l-[#B9472F] text-[#F1D7A3]'
          : 'text-[#F1D7A3]/90 hover:text-[#F1D7A3]'
      }`}
    >
      {/* LEFT: Index, Artwork & Song Info */}
      <div className="flex items-center space-x-3.5 min-w-0 flex-1">
        {/* Track Index / Play Icon */}
        <div className="w-7 text-center shrink-0 font-mono text-xs text-[#E5AD54] font-semibold">
          {isCurrentTrackPlaying ? (
            <div className="flex items-end justify-center space-x-0.5 h-4" aria-label="Currently playing indicator">
              <span className="w-1 bg-[#B9472F] animate-bounce h-3" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-[#E5AD54] animate-bounce h-4" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-[#B9472F] animate-bounce h-2" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <span className="group-hover:hidden">{formattedIndex}</span>
          )}
          {!isCurrentTrackPlaying && (
            <Play className="w-3.5 h-3.5 text-[#E5AD54] mx-auto hidden group-hover:block fill-[#E5AD54]" />
          )}
        </div>

        {/* Artwork */}
        <div className="relative w-10 h-10 rounded bg-[#24150F] border border-[#C88A3D]/30 overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
          {song.artwork ? (
            <img
              src={song.artwork}
              alt={song.title}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <Disc className="w-5 h-5 text-[#E5AD54]" />
          )}

          {isCurrentTrackPlaying && (
            <div className="absolute inset-0 bg-[#24150F]/40 flex items-center justify-center">
              <Pause className="w-4 h-4 text-[#F1D7A3] fill-[#F1D7A3]" />
            </div>
          )}
        </div>

        {/* Song Title & Artist */}
        <div className="min-w-0 flex-1 pr-2">
          <h4
            className={`text-xs sm:text-sm font-serif font-bold truncate ${
              isCurrentTrack ? 'text-[#E5AD54]' : 'text-[#F1D7A3]'
            }`}
          >
            {song.title}
          </h4>
          <p className="text-[11px] text-[#F1D7A3]/70 truncate font-sans">
            {song.artist} <span className="hidden sm:inline text-[#C88A3D]/70">• {song.album}</span>
          </p>
        </div>
      </div>

      {/* RIGHT: Duration / Year & Favorite Button */}
      <div className="flex items-center space-x-4 shrink-0 pl-2">
        <span className="font-mono text-xs text-[#E5AD54]/80">
          {isCurrentTrack && duration > 0 ? formatDuration(duration) : (song.year ? song.year.toString() : 'YouTube')}
        </span>

        {/* Favourite Heart Toggle */}
        <FavouriteButton songId={song.id} size={16} />
      </div>
    </div>
  );
};
