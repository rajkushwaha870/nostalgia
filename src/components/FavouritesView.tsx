import React from 'react';
import { Heart, Music } from 'lucide-react';
import { songs } from '../data/songs';
import { SongItem } from './SongItem';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const FavouritesView: React.FC = () => {
  const { favorites, playSongInQueue } = useMusicPlayer();

  const favoriteSongs = songs.filter((s) => favorites.includes(s.id));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 text-[#F1D7A3] animate-fade-in select-none">
      <div className="text-left mb-8 border-b border-[#C88A3D]/20 pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#E5AD54] uppercase tracking-widest mb-1">
          <Heart className="w-4 h-4 text-[#B9472F] fill-[#B9472F]" />
          <span>PERSONAL VAULT</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F1D7A3] tracking-wide">
          FAVOURITES
        </h1>

        <p className="text-sm sm:text-base text-[#F1D7A3]/80 font-sans italic mt-1">
          Your treasured collection of loved nostalgic songs.
        </p>
      </div>

      <div className="bg-[#24150F]/80 border border-[#C88A3D]/30 rounded-sm p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C88A3D]/20 pb-3 mb-4 text-xs font-mono text-[#E5AD54] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#B9472F]" />
            FAVOURITE SONGS ({favoriteSongs.length})
          </span>
          <span className="hidden sm:inline">DURATION</span>
        </div>

        {favoriteSongs.length > 0 ? (
          <div className="flex flex-col space-y-1">
            {favoriteSongs.map((song, idx) => (
              <SongItem
                key={song.id}
                song={song}
                index={idx}
                onPlaySong={(s) => playSongInQueue(s, favoriteSongs)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-xs sm:text-sm font-serif italic text-[#F1D7A3]/60">
            No favourite songs saved yet. Click the heart icon ♡ on any song in the playlist archive to save it here.
          </div>
        )}
      </div>
    </div>
  );
};
