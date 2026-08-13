import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { songs } from '../data/songs';
import type { Song } from '../data/songs';

export type RepeatMode = 'off' | 'one';

interface MusicPlayerContextType {
  currentSong: Song;
  currentIndex: number;
  currentQueue: Song[];
  currentQueueIndex: number;
  activePlaylistId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  favorites: number[];
  errorMessage: string | null;
  togglePlay: () => void;
  playSong: (index?: number) => void;
  playQueue: (queue: Song[], startIndex?: number, playlistId?: string) => void;
  playSongInQueue: (song: Song, queue?: Song[], playlistId?: string) => void;
  pause: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (songId: number) => void;
  clearError: () => void;
  isFavorite: (songId: number) => boolean;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

const LOCAL_STORAGE_FAVS_KEY = 'nostalgia_favorites';

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQueue, setCurrentQueue] = useState<Song[]>(songs);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(songs[0]?.duration || 0);
  const [volume, setVolumeState] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Favorites state loaded from localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentSong = currentQueue[currentQueueIndex] || songs[0];
  const currentIndex = currentQueueIndex;

  // Single HTML5 Audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update src when currentSong changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    // Reset current time and state for new song
    setErrorMessage(null);
    setCurrentTime(0);

    audio.src = currentSong.audioUrl;
    audio.load();

    if (currentSong.duration > 0) {
      setDuration(currentSong.duration);
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio playback failed:', err.message || err);
          setIsPlaying(false);
          setErrorMessage(`Unable to play "${currentSong.title}". Skipping...`);
        });
      }
    }
  }, [currentQueueIndex, currentSong]);

  // Handle audio volume & mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Audio Event Listeners setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleError = () => {
      setIsPlaying(false);
      setErrorMessage(`Failed to load "${currentSong?.title || 'track'}". You can try another track.`);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong]);

  // Next song handler
  const nextSong = useCallback(() => {
    if (currentQueue.length === 0) return;

    let nextIndex: number;
    if (isShuffle && currentQueue.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * currentQueue.length);
      } while (nextIndex === currentQueueIndex);
    } else {
      nextIndex = (currentQueueIndex + 1) % currentQueue.length;
    }

    setCurrentQueueIndex(nextIndex);
    setIsPlaying(true);
  }, [currentQueueIndex, isShuffle, currentQueue]);

  // Previous song handler
  const prevSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (currentQueue.length === 0) return;

    let prevIndex: number;
    if (isShuffle && currentQueue.length > 1) {
      do {
        prevIndex = Math.floor(Math.random() * currentQueue.length);
      } while (prevIndex === currentQueueIndex);
    } else {
      prevIndex = (currentQueueIndex - 1 + currentQueue.length) % currentQueue.length;
    }

    setCurrentQueueIndex(prevIndex);
    setIsPlaying(true);
  }, [currentQueueIndex, isShuffle, currentQueue]);

  // Auto-next song trigger on ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
      } else {
        nextSong();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, isShuffle, currentQueueIndex, currentQueue, nextSong]);

  // Play / Pause controls
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      setErrorMessage(null);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
          setErrorMessage(`Unable to play "${currentSong?.title || 'track'}".`);
        });
      }
    }
  }, [isPlaying, currentSong]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  }, []);

  const playSong = useCallback((index?: number) => {
    const newIndex = index !== undefined ? index : currentQueueIndex;
    if (newIndex !== currentQueueIndex) {
      setCurrentQueueIndex(newIndex);
    }
    setIsPlaying(true);
  }, [currentQueueIndex]);

  const playQueue = useCallback((queue: Song[], startIndex = 0, playlistId?: string) => {
    if (queue.length === 0) return;
    setCurrentQueue(queue);
    setCurrentQueueIndex(startIndex);
    setActivePlaylistId(playlistId || null);
    setIsPlaying(true);
  }, []);

  const playSongInQueue = useCallback((song: Song, queue?: Song[], playlistId?: string) => {
    const targetQueue = queue && queue.length > 0 ? queue : currentQueue;
    const songIdx = targetQueue.findIndex((s) => s.id === song.id);

    if (queue && queue.length > 0) {
      setCurrentQueue(queue);
      setActivePlaylistId(playlistId || null);
    }

    if (songIdx !== -1) {
      setCurrentQueueIndex(songIdx);
    }
    setIsPlaying(true);
  }, [currentQueue]);

  const seek = useCallback((timeInSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clampedTime = Math.max(0, Math.min(timeInSeconds, duration || audio.duration || 0));
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, [duration]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(100, vol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => (prev === 'off' ? 'one' : 'off'));
  }, []);

  const toggleFavorite = useCallback((songId: number) => {
    setFavorites((prevFavs) => {
      let updated: number[];
      if (prevFavs.includes(songId)) {
        updated = prevFavs.filter((id) => id !== songId);
      } else {
        updated = [...prevFavs, songId];
      }
      try {
        localStorage.setItem(LOCAL_STORAGE_FAVS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save favorites to localStorage:', err);
      }
      return updated;
    });
  }, []);

  const isFavorite = useCallback((songId: number) => {
    return favorites.includes(songId);
  }, [favorites]);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 5);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(currentTime - 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(volume + 5);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(volume - 5);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay, seek, setVolume, currentTime, volume]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        currentIndex,
        currentQueue,
        currentQueueIndex,
        activePlaylistId,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        favorites,
        errorMessage,
        togglePlay,
        playSong,
        playQueue,
        playSongInQueue,
        pause,
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
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = (): MusicPlayerContextType => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
