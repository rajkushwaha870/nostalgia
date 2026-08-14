import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { songs } from '../data/songs';
import type { Song } from '../data/songs';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

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
  toggleFavourite: (songId: number) => void;
  addFavourite: (songId: number) => void;
  removeFavourite: (songId: number) => void;
  clearFavourites: () => void;
  clearError: () => void;
  isFavorite: (songId: number) => boolean;
  isFavourite: (songId: number) => boolean;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

const LOCAL_STORAGE_FAVS_KEY = 'nostalgia_favourites';

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQueue, setCurrentQueue] = useState<Song[]>(songs);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
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

  // Single YouTube Player instance ref
  const ytPlayerRef = useRef<any>(null);
  const isPlayerReadyRef = useRef<boolean>(false);
  const pendingPlayRef = useRef<boolean>(false);

  // Keep refs of values needed in event handlers to avoid stale closures
  const currentQueueRef = useRef(currentQueue);
  currentQueueRef.current = currentQueue;
  const currentQueueIndexRef = useRef(currentQueueIndex);
  currentQueueIndexRef.current = currentQueueIndex;
  const isShuffleRef = useRef(isShuffle);
  isShuffleRef.current = isShuffle;
  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Next song handler definition
  const nextSong = useCallback(() => {
    const queue = currentQueueRef.current;
    const index = currentQueueIndexRef.current;
    const shuffle = isShuffleRef.current;
    if (queue.length === 0) return;

    let nextIdx: number;
    if (shuffle && queue.length > 1) {
      do {
        nextIdx = Math.floor(Math.random() * queue.length);
      } while (nextIdx === index);
    } else {
      nextIdx = (index + 1) % queue.length;
    }

    setCurrentQueueIndex(nextIdx);
    setIsPlaying(true);
  }, []);

  const nextSongRef = useRef(nextSong);
  nextSongRef.current = nextSong;

  // Previous song handler definition
  const prevSong = useCallback(() => {
    if (ytPlayerRef.current && isPlayerReadyRef.current) {
      const curTime = ytPlayerRef.current.getCurrentTime ? ytPlayerRef.current.getCurrentTime() : 0;
      if (curTime > 3) {
        ytPlayerRef.current.seekTo(0, true);
        setCurrentTime(0);
        return;
      }
    }

    const queue = currentQueueRef.current;
    const index = currentQueueIndexRef.current;
    const shuffle = isShuffleRef.current;
    if (queue.length === 0) return;

    let prevIdx: number;
    if (shuffle && queue.length > 1) {
      do {
        prevIdx = Math.floor(Math.random() * queue.length);
      } while (prevIdx === index);
    } else {
      prevIdx = (index - 1 + queue.length) % queue.length;
    }

    setCurrentQueueIndex(prevIdx);
    setIsPlaying(true);
  }, []);

  // Initialize YouTube Iframe API & Player
  useEffect(() => {
    let checkInterval: any = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      const container = document.getElementById('nostalgia-yt-iframe');
      if (!container || ytPlayerRef.current) return;

      ytPlayerRef.current = new window.YT.Player('nostalgia-yt-iframe', {
        height: '1',
        width: '1',
        videoId: currentSong.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            isPlayerReadyRef.current = true;
            event.target.setVolume(isMuted ? 0 : volume);
            if (pendingPlayRef.current || isPlayingRef.current) {
              pendingPlayRef.current = false;
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0, BUFFERING=3, CUED=5
            if (event.data === 1) { // PLAYING
              setIsPlaying(true);
              setErrorMessage(null); // Clear "Tuning in..." toast
              const dur = event.target.getDuration();
              if (dur && typeof dur === 'number') {
                setDuration(dur);
              }
            } else if (event.data === 2) { // PAUSED
              setIsPlaying(false);
            } else if (event.data === 3) { // BUFFERING
              setErrorMessage('Tuning in...');
            } else if (event.data === 0) { // ENDED
              if (repeatModeRef.current === 'one') {
                event.target.seekTo(0, true);
                event.target.playVideo();
              } else {
                nextSongRef.current();
              }
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player error code:', event.data);
            setIsPlaying(false);
            setErrorMessage("This memory couldn't be played.");
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById('yt-iframe-api-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'yt-iframe-api-script';
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
      }

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };

      checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player && !ytPlayerRef.current) {
          initPlayer();
          clearInterval(checkInterval);
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // Update YouTube Video when currentSong changes
  useEffect(() => {
    if (!currentSong) return;
    setCurrentTime(0);

    if (ytPlayerRef.current && isPlayerReadyRef.current) {
      if (isPlaying) {
        setErrorMessage('Tuning in...');
        ytPlayerRef.current.loadVideoById(currentSong.youtubeId);
      } else {
        setErrorMessage(null);
        ytPlayerRef.current.cueVideoById(currentSong.youtubeId);
      }
    }
  }, [currentQueueIndex, currentSong.youtubeId]);

  // Volume & Mute Sync with YouTube Player
  useEffect(() => {
    if (ytPlayerRef.current && isPlayerReadyRef.current) {
      if (isMuted) {
        ytPlayerRef.current.mute();
      } else {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(volume);
      }
    }
  }, [volume, isMuted]);

  // Time Updates while playing
  useEffect(() => {
    let interval: any = null;

    if (isPlaying) {
      interval = setInterval(() => {
        if (ytPlayerRef.current && isPlayerReadyRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
          const curTime = ytPlayerRef.current.getCurrentTime();
          if (typeof curTime === 'number' && !isNaN(curTime)) {
            setCurrentTime(curTime);
          }
          const dur = ytPlayerRef.current.getDuration();
          if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
            setDuration(dur);
          }
        }
      }, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Controls Implementation
  const togglePlay = useCallback(() => {
    if (!ytPlayerRef.current || !isPlayerReadyRef.current) {
      pendingPlayRef.current = !isPlaying;
      setIsPlaying((prev) => !prev);
      return;
    }

    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      setErrorMessage('Tuning in...');
      ytPlayerRef.current.playVideo();
    }
  }, [isPlaying]);

  const pause = useCallback(() => {
    if (ytPlayerRef.current && isPlayerReadyRef.current) {
      ytPlayerRef.current.pauseVideo();
    } else {
      setIsPlaying(false);
    }
  }, []);

  const playSong = useCallback((index?: number) => {
    const newIndex = index !== undefined ? index : currentQueueIndex;
    if (newIndex !== currentQueueIndex) {
      setCurrentQueueIndex(newIndex);
    }
    setIsPlaying(true);
    if (ytPlayerRef.current && isPlayerReadyRef.current) {
      setErrorMessage('Tuning in...');
      const targetSong = currentQueue[newIndex];
      if (targetSong) {
        ytPlayerRef.current.loadVideoById(targetSong.youtubeId);
      }
    } else {
      pendingPlayRef.current = true;
    }
  }, [currentQueueIndex, currentQueue]);

  const playQueue = useCallback((queue: Song[], startIndex = 0, playlistId?: string) => {
    if (queue.length === 0) return;
    setCurrentQueue(queue);
    setCurrentQueueIndex(startIndex);
    setActivePlaylistId(playlistId || null);
    setIsPlaying(true);

    const targetSong = queue[startIndex];
    if (targetSong && ytPlayerRef.current && isPlayerReadyRef.current) {
      setErrorMessage('Tuning in...');
      ytPlayerRef.current.loadVideoById(targetSong.youtubeId);
    } else {
      pendingPlayRef.current = true;
    }
  }, []);

  const playSongInQueue = useCallback((song: Song, queue?: Song[], playlistId?: string) => {
    const targetQueue = queue && queue.length > 0 ? queue : currentQueue;
    const songIdx = targetQueue.findIndex((s) => s.id === song.id);

    if (queue && queue.length > 0) {
      setCurrentQueue(queue);
      setActivePlaylistId(playlistId || null);
    }

    const idxToPlay = songIdx !== -1 ? songIdx : 0;
    setCurrentQueueIndex(idxToPlay);
    setIsPlaying(true);

    if (ytPlayerRef.current && isPlayerReadyRef.current) {
      setErrorMessage('Tuning in...');
      ytPlayerRef.current.loadVideoById(song.youtubeId);
    } else {
      pendingPlayRef.current = true;
    }
  }, [currentQueue]);

  const seek = useCallback((timeInSeconds: number) => {
    const clampedTime = Math.max(0, Math.min(timeInSeconds, duration || 100));
    setCurrentTime(clampedTime);
    if (ytPlayerRef.current && isPlayerReadyRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      ytPlayerRef.current.seekTo(clampedTime, true);
    }
  }, [duration]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(100, vol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    if (ytPlayerRef.current && isPlayerReadyRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      ytPlayerRef.current.setVolume(clamped);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMute = !prev;
      if (ytPlayerRef.current && isPlayerReadyRef.current) {
        if (nextMute) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
        }
      }
      return nextMute;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => (prev === 'off' ? 'one' : 'off'));
  }, []);

  const saveFavsToLocalStorage = (favs: number[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVS_KEY, JSON.stringify(favs));
    } catch (err) {
      console.warn('Failed to save favorites to localStorage:', err);
    }
  };

  const toggleFavorite = useCallback((songId: number) => {
    setFavorites((prevFavs) => {
      let updated: number[];
      if (prevFavs.includes(songId)) {
        updated = prevFavs.filter((id) => id !== songId);
      } else {
        updated = [...prevFavs, songId];
      }
      saveFavsToLocalStorage(updated);
      return updated;
    });
  }, []);

  const addFavourite = useCallback((songId: number) => {
    setFavorites((prevFavs) => {
      if (prevFavs.includes(songId)) return prevFavs;
      const updated = [...prevFavs, songId];
      saveFavsToLocalStorage(updated);
      return updated;
    });
  }, []);

  const removeFavourite = useCallback((songId: number) => {
    setFavorites((prevFavs) => {
      if (!prevFavs.includes(songId)) return prevFavs;
      const updated = prevFavs.filter((id) => id !== songId);
      saveFavsToLocalStorage(updated);
      return updated;
    });
  }, []);

  const clearFavourites = useCallback(() => {
    setFavorites([]);
    saveFavsToLocalStorage([]);
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
        toggleFavourite: toggleFavorite,
        addFavourite,
        removeFavourite,
        clearFavourites,
        clearError,
        isFavorite,
        isFavourite: isFavorite,
      }}
    >
      {children}
      {/* Off-screen Youtube Player Iframe container */}
      <div
        id="youtube-player-container"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '1px',
          height: '1px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      >
        <div id="nostalgia-yt-iframe" />
      </div>
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
