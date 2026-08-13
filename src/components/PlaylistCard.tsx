import React from 'react';
import { Play, Disc, Music } from 'lucide-react';
import type { Playlist } from '../data/playlists';

interface PlaylistCardProps {
  playlist: Playlist;
  songCount: number;
  onSelectPlaylist: (playlistId: string) => void;
  onPlayPlaylist: (playlist: Playlist, e: React.MouseEvent) => void;
  isPlayingThisPlaylist?: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  songCount,
  onSelectPlaylist,
  onPlayPlaylist,
  isPlayingThisPlaylist = false,
}) => {
  return (
    <div
      onClick={() => onSelectPlaylist(playlist.id)}
      className="group relative cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-1.5"
    >
      {/* Outer Vintage Vinyl / J-Card Sleeve Container */}
      <div className="relative bg-[#26150F] border-2 border-[#C88A3D]/40 rounded-sm p-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)] group-hover:border-[#E5AD54] group-hover:shadow-[0_15px_35px_rgba(185,71,47,0.3)] transition-all overflow-hidden flex flex-col justify-between min-h-[340px]">
        
        {/* Distressed Corner Accents */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#C88A3D]/70" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#C88A3D]/70" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#C88A3D]/70" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#C88A3D]/70" />

        {/* Paper & Film Grain Overlay */}
        <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none" />
        <div className="absolute inset-0 film-grain opacity-20 pointer-events-none mix-blend-overlay" />

        {/* TOP: Vintage Artwork with Cassette / Vinyl Slide effect */}
        <div className="relative w-full aspect-square bg-[#1A0E09] border border-[#C88A3D]/30 overflow-hidden shadow-inner mb-3.5 group">
          {/* Peeking Vinyl Record */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#110805] border-4 border-[#24150F] shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:translate-x-6 group-hover:rotate-45 pointer-events-none z-0">
            <div className="w-10 h-10 rounded-full bg-[#B9472F] border-2 border-[#F1D7A3] flex items-center justify-center">
              <Disc className="w-5 h-5 text-[#F1D7A3] animate-spin" style={{ animationDuration: '12s' }} />
            </div>
          </div>

          {/* Main Cover Art */}
          <img
            src={playlist.artwork}
            alt={playlist.title}
            className="relative z-10 w-full h-full object-cover filter contrast-105 saturate-95 group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Cover Overlay Vignette */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#26150F] via-transparent to-black/30 pointer-events-none" />

          {/* Category Tag Stamp */}
          <div className="absolute top-2 left-2 z-20 px-2 py-0.5 bg-[#B9472F]/90 text-[#F1D7A3] text-[9px] font-mono tracking-widest uppercase border border-[#F1D7A3]/30 shadow-md">
            {playlist.category}
          </div>

          {/* Playing Status Badge */}
          {isPlayingThisPlaylist && (
            <div className="absolute top-2 right-2 z-20 px-2 py-0.5 bg-[#E5AD54] text-[#24150F] text-[9px] font-mono font-bold tracking-widest uppercase border border-[#24150F] shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9472F] animate-ping" />
              PLAYING
            </div>
          )}
        </div>

        {/* MIDDLE: Title & Description */}
        <div className="flex-1 flex flex-col justify-between z-10">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#F1D7A3] group-hover:text-[#E5AD54] transition-colors tracking-wide leading-snug">
              {playlist.title}
            </h3>

            <p className="text-xs text-[#F1D7A3]/75 font-sans mt-1 line-clamp-2 leading-relaxed italic">
              "{playlist.description}"
            </p>
          </div>

          {/* BOTTOM: Song Count & Vintage Play Button */}
          <div className="pt-3 mt-3 border-t border-[#C88A3D]/20 flex items-center justify-between">
            <span className="text-xs font-mono text-[#E5AD54]/90 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-[#C88A3D]" />
              {songCount} {songCount === 1 ? 'song' : 'songs'}
            </span>

            {/* Vintage Play Button */}
            <button
              onClick={(e) => onPlayPlaylist(playlist, e)}
              className="px-3.5 py-1.5 bg-[#B9472F] hover:bg-[#C94B32] active:scale-95 text-[#F1D7A3] text-xs font-semibold tracking-wider uppercase border border-[#F1D7A3]/40 shadow-md transition-all flex items-center gap-1.5 rounded-xs"
              title={`Play ${playlist.title}`}
            >
              <Play className="w-3 h-3 fill-[#F1D7A3]" />
              <span>PLAY</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
