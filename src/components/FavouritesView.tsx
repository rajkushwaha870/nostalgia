import React from 'react';
import { Heart, Music, Play, Disc } from 'lucide-react';
import { songs } from '../data/songs';
import type { Song } from '../data/songs';
import { SongItem } from './SongItem';
import { useFavourites } from '../hooks/useFavourites';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface FavouritesViewProps {
  onSelectTab?: (tab: string) => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({ onSelectTab }) => {
  const { favorites } = useFavourites();
  const { playQueue } = useMusicPlayer();

  // Filter songs based on current favorites list
  const favoriteSongs = songs.filter((s) => favorites.includes(s.id));

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0, 'favourites');
    }
  };

  const handlePlaySongInFavourites = (song: Song) => {
    playQueue(favoriteSongs, favoriteSongs.findIndex((s) => s.id === song.id), 'favourites');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 text-[#F1D7A3] animate-fade-in select-none">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C88A3D]/20 pb-6 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#E5AD54] uppercase tracking-widest mb-1.5">
            <Heart className="w-4 h-4 text-[#B9472F] fill-[#B9472F]" />
            <span>PERSONAL VAULT</span>
          </div>

          <div className="flex items-baseline space-x-3.5 flex-wrap">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F1D7A3] tracking-wide">
              FAVOURITES
            </h1>
            <span className="text-xs font-mono text-[#E5AD54] bg-[#3A2116]/80 px-2.5 py-1 rounded border border-[#C88A3D]/40 shadow-sm">
              {favoriteSongs.length} {favoriteSongs.length === 1 ? 'song' : 'songs'}
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#F1D7A3]/80 font-serif italic mt-1.5">
            The songs you chose to keep close.
          </p>
        </div>

        {/* Play All Button */}
        {favoriteSongs.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="self-start sm:self-auto px-5 py-2.5 bg-[#B9472F] hover:bg-[#C94B32] active:scale-95 text-[#F1D7A3] text-xs font-mono font-semibold tracking-widest uppercase border border-[#F1D7A3]/40 shadow-lg transition-all flex items-center gap-2 rounded-xs cursor-pointer"
            title="Play all favourite songs"
          >
            <Play className="w-3.5 h-3.5 fill-[#F1D7A3]" />
            <span>PLAY ALL</span>
          </button>
        )}
      </div>

      {/* 2. FAVOURITES CONTENT CARD */}
      {favoriteSongs.length > 0 ? (
        <div className="bg-[#24150F]/80 border border-[#C88A3D]/30 rounded-sm p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#C88A3D]/20 pb-3 mb-4 text-xs font-mono text-[#E5AD54] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[#B9472F]" />
              FAVOURITE SONGS ({favoriteSongs.length})
            </span>
            <span className="hidden sm:inline">DURATION</span>
          </div>

          <div className="flex flex-col space-y-1">
            {favoriteSongs.map((song, idx) => (
              <div key={song.id} className="transition-all duration-300 ease-out animate-fade-in">
                <SongItem
                  song={song}
                  index={idx}
                  onPlaySong={handlePlaySongInFavourites}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 3. VINTAGE NOSTALGIC EMPTY STATE */
        <div className="py-16 px-6 text-center bg-[#24150F]/80 border border-[#C88A3D]/30 rounded-sm shadow-xl flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16 rounded-full bg-[#3A2116] border border-[#C88A3D]/40 flex items-center justify-center text-[#E5AD54] shadow-inner mb-1">
            <Heart className="w-8 h-8 text-[#C88A3D] stroke-[1.5]" />
            <div className="absolute inset-0 rounded-full border border-[#E5AD54]/20 animate-ping opacity-25" />
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F1D7A3] tracking-wide">
            No memories saved yet.
          </h3>

          <p className="text-sm font-serif italic text-[#F1D7A3]/70 max-w-md">
            Find a song that feels like home.
          </p>

          <button
            onClick={() => onSelectTab?.('PLAYLISTS')}
            className="mt-2 px-6 py-2.5 bg-[#B9472F] hover:bg-[#C94B32] active:scale-95 text-[#F1D7A3] font-mono text-xs font-semibold tracking-widest uppercase rounded-xs border border-[#F1D7A3]/30 shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Disc className="w-3.5 h-3.5" />
            <span>EXPLORE PLAYLISTS</span>
          </button>
        </div>
      )}
    </div>
  );
};
