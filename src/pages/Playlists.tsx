import React, { useState, useMemo } from 'react';
import { playlists } from '../data/playlists';
import type { Playlist } from '../data/playlists';
import { songs } from '../data/songs';
import type { Song } from '../data/songs';
import { PlaylistCard } from '../components/PlaylistCard';
import { PlaylistHeader } from '../components/PlaylistHeader';
import { SearchMemories } from '../components/SearchMemories';
import { SongItem } from '../components/SongItem';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Music, Disc } from 'lucide-react';

interface PlaylistsProps {
  initialPlaylistId?: string | null;
}

export const Playlists: React.FC<PlaylistsProps> = ({ initialPlaylistId = null }) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(initialPlaylistId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const { playQueue, playSongInQueue, activePlaylistId, isPlaying } = useMusicPlayer();

  // Selected Playlist object if in Detail View
  const selectedPlaylist = useMemo(() => {
    return playlists.find((p) => p.id === selectedPlaylistId) || null;
  }, [selectedPlaylistId]);

  // Songs belonging to selected playlist
  const selectedPlaylistSongs = useMemo(() => {
    if (!selectedPlaylist) return [];
    return selectedPlaylist.songIds
      .map((id: number) => songs.find((s: Song) => s.id === id))
      .filter((s): s is Song => s !== undefined);
  }, [selectedPlaylist]);

  // Filtered Playlists based on category & search query
  const filteredPlaylists = useMemo(() => {
    let result = playlists;

    // Filter by Category
    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category.toUpperCase() === selectedCategory.toUpperCase());
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const searchedSongs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.album && s.album.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Handle Play All button
  const handlePlayAll = (playlist: Playlist) => {
    const playlistSongs = playlist.songIds
      .map((id: number) => songs.find((s: Song) => s.id === id))
      .filter((s): s is Song => s !== undefined);

    if (playlistSongs.length > 0) {
      playQueue(playlistSongs, 0, playlist.id);
    }
  };

  // Handle Play single song in playlist
  const handlePlaySongInPlaylist = (song: Song, queue: Song[], playlistId?: string) => {
    playSongInQueue(song, queue, playlistId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-24 text-[#F1D7A3]">
      
      {/* If in Detail View */}
      {selectedPlaylist ? (
        <div className="animate-fade-in">
          <PlaylistHeader
            isDetailView={true}
            playlist={selectedPlaylist}
            songCount={selectedPlaylistSongs.length}
            onBack={() => setSelectedPlaylistId(null)}
            onPlayAll={() => handlePlayAll(selectedPlaylist)}
            isPlayingThisPlaylist={activePlaylistId === selectedPlaylist.id && isPlaying}
          />

          {/* Songs List */}
          <div className="bg-[#24150F]/80 border border-[#C88A3D]/30 rounded-sm p-4 sm:p-6 shadow-xl relative">
            <div className="flex items-center justify-between border-b border-[#C88A3D]/20 pb-3 mb-4 text-xs font-mono text-[#E5AD54] uppercase tracking-wider">
              <span>TRACKLIST ({selectedPlaylistSongs.length})</span>
              <span className="hidden sm:inline">DURATION</span>
            </div>

            {selectedPlaylistSongs.length > 0 ? (
              <div className="flex flex-col space-y-1">
                {selectedPlaylistSongs.map((song: Song, idx: number) => (
                  <SongItem
                    key={song.id}
                    song={song}
                    index={idx}
                    onPlaySong={(s) =>
                      handlePlaySongInPlaylist(s, selectedPlaylistSongs, selectedPlaylist.id)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-serif italic text-[#F1D7A3]/60">
                No songs currently found in this playlist archive.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Overview Grid View */
        <div className="animate-fade-in">
          {/* Header */}
          <PlaylistHeader isDetailView={false} />

          {/* Search & Category Filter */}
          <SearchMemories
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Searched Songs Result Section (if active search query matches songs) */}
          {searchQuery.trim() && searchedSongs.length > 0 && (
            <div className="mb-10 bg-[#24150F]/90 border border-[#C88A3D]/40 rounded-sm p-4 sm:p-6 shadow-xl">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#E5AD54] uppercase tracking-wider border-b border-[#C88A3D]/20 pb-3 mb-4">
                <Music className="w-4 h-4 text-[#B9472F]" />
                <span>MATCHING SONGS ({searchedSongs.length})</span>
              </div>

              <div className="flex flex-col space-y-1">
                {searchedSongs.map((song: Song, idx: number) => (
                  <SongItem
                    key={song.id}
                    song={song}
                    index={idx}
                    onPlaySong={(s) => handlePlaySongInPlaylist(s, searchedSongs)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Playlists Grid Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#E5AD54] uppercase tracking-wider flex items-center gap-1.5">
              <Disc className="w-3.5 h-3.5 text-[#B9472F]" />
              PLAYLIST COLLECTIONS ({filteredPlaylists.length})
            </span>
          </div>

          {/* Responsive 3-Col Desktop, 2-Col Tablet, 1-Col Mobile Grid */}
          {filteredPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPlaylists.map((playlist) => {
                const count = playlist.songIds.length;
                const isPlayingThis = activePlaylistId === playlist.id && isPlaying;

                return (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    songCount={count}
                    onSelectPlaylist={(id) => setSelectedPlaylistId(id)}
                    onPlayPlaylist={(pl, e) => {
                      e.stopPropagation();
                      handlePlayAll(pl);
                    }}
                    isPlayingThisPlaylist={isPlayingThis}
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#24150F]/50 border border-[#C88A3D]/20 rounded-sm">
              <p className="text-sm font-serif italic text-[#F1D7A3]/70">
                No nostalgic playlists found matching your search.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
