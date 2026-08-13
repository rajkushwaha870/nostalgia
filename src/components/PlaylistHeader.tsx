import React from 'react';
import { Play, ArrowLeft, Disc, Music } from 'lucide-react';
import type { Playlist } from '../data/playlists';

interface PlaylistHeaderProps {
  isDetailView?: boolean;
  playlist?: Playlist | null;
  songCount?: number;
  onBack?: () => void;
  onPlayAll?: () => void;
  isPlayingThisPlaylist?: boolean;
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  isDetailView = false,
  playlist,
  songCount = 0,
  onBack,
  onPlayAll,
  isPlayingThisPlaylist = false,
}) => {
  if (isDetailView && playlist) {
    return (
      <div className="relative mb-8 select-none">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="group inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-[#3A2116]/60 border border-[#C88A3D]/30 text-[#F1D7A3] hover:text-[#E5AD54] hover:border-[#E5AD54] hover:bg-[#3A2116] transition-all text-xs font-semibold uppercase tracking-wider mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Playlists</span>
        </button>

        {/* Vintage Playlist Cover Banner */}
        <div className="relative bg-[#26150F]/90 border-2 border-[#C88A3D]/40 rounded-sm p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 overflow-hidden">
          {/* Background Textures */}
          <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none" />
          <div className="absolute inset-0 film-grain opacity-20 pointer-events-none mix-blend-overlay" />

          {/* Left: Artwork Frame */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 bg-[#1A0E09] border border-[#C88A3D]/40 rounded-sm overflow-hidden shrink-0 shadow-lg group">
            <img
              src={playlist.artwork}
              alt={playlist.title}
              className="w-full h-full object-cover filter contrast-105"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#B9472F] text-[#F1D7A3] text-[9px] font-mono tracking-widest uppercase border border-[#F1D7A3]/30">
              {playlist.category}
            </div>
          </div>

          {/* Right: Info & Play All Button */}
          <div className="flex-1 text-center md:text-left z-10">
            <div className="text-xs font-mono text-[#E5AD54] uppercase tracking-widest font-semibold flex items-center justify-center md:justify-start gap-2 mb-1">
              <Disc className="w-3.5 h-3.5 text-[#B9472F]" />
              SPECIAL COLLECTION
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#F1D7A3] tracking-wide mb-2">
              {playlist.title}
            </h1>

            <p className="text-sm sm:text-base text-[#F1D7A3]/85 font-sans italic max-w-xl mb-4 leading-relaxed">
              "{playlist.description}"
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {/* Song count badge */}
              <span className="text-xs font-mono text-[#E5AD54]/90 flex items-center gap-1.5 bg-[#1A0E09]/60 px-3 py-1.5 rounded border border-[#C88A3D]/20">
                <Music className="w-3.5 h-3.5 text-[#C88A3D]" />
                {songCount} {songCount === 1 ? 'song' : 'songs'}
              </span>

              {/* PLAY ALL Button */}
              <button
                onClick={onPlayAll}
                className="px-6 py-2.5 bg-[#B9472F] hover:bg-[#C94B32] active:scale-95 text-[#F1D7A3] text-xs font-bold tracking-widest uppercase border border-[#F1D7A3]/40 shadow-lg transition-all flex items-center gap-2 rounded-xs cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#F1D7A3]" />
                <span>{isPlayingThisPlaylist ? 'PLAYING ALL' : 'PLAY ALL'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-left mb-8 select-none border-b border-[#C88A3D]/20 pb-6">
      <div className="flex items-center space-x-2 text-xs font-mono text-[#E5AD54] uppercase tracking-widest mb-1">
        <Disc className="w-4 h-4 text-[#B9472F]" />
        <span>ARCHIVE SELECTION</span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F1D7A3] tracking-wide">
        PLAYLISTS
      </h1>

      <p className="text-sm sm:text-base text-[#F1D7A3]/80 font-sans italic mt-1">
        A collection of songs from old memories.
      </p>
    </div>
  );
};
