import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { songs } from '../data/songs';
import type { Song } from '../data/songs';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export const YOUTUBE_PLAYLIST_ID = 'PLafSq5UblCNWzrBiEOwBeIdoU8AFXfTqp';
export const YOUTUBE_80S_PLAYLIST_ID = YOUTUBE_PLAYLIST_ID;

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
  playFavouriteSong: (song: Song) => void;
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
  testYouTubePlayback: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

const LOCAL_STORAGE_FAVS_KEY = 'nostalgia_favourites';
const LOCAL_STORAGE_PLAYBACK_KEY = 'nostalgia_playback_state';

interface SavedPlaybackState {
  currentSong: Song;
  currentQueue: Song[];
  currentQueueIndex: number;
  activePlaylistId: string | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  timestamp?: number;
}

const loadSavedPlaybackState = (): SavedPlaybackState | null => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PLAYBACK_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load playback state from localStorage:', err);
  }
  return null;
};

// Helper to generate a stable positive number ID from a string
const generateNumericId = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) || 9999;
};

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedPlayback = useRef<SavedPlaybackState | null>(loadSavedPlaybackState()).current;

  const [currentQueue, setCurrentQueue] = useState<Song[]>(() => {
    if (savedPlayback?.currentQueue && Array.isArray(savedPlayback.currentQueue) && savedPlayback.currentQueue.length > 0) {
      if (savedPlayback.activePlaylistId === 'favourites') {
        return songs;
      }
      return savedPlayback.currentQueue;
    }
    return songs;
  });
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(() => {
    if (typeof savedPlayback?.currentQueueIndex === 'number' && savedPlayback.currentQueueIndex >= 0) {
      return savedPlayback.currentQueueIndex;
    }
    return 0;
  });
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(() => {
    if (savedPlayback?.activePlaylistId === 'favourites') {
      return YOUTUBE_PLAYLIST_ID;
    }
    return savedPlayback?.activePlaylistId ?? YOUTUBE_PLAYLIST_ID;
  });

  const [currentSong, setCurrentSong] = useState<Song>(() => {
    if (savedPlayback?.currentSong && savedPlayback.currentSong.youtubeId) {
      // If saved song exists in our playlist dataset, use it
      const matched = songs.find((s) => s.youtubeId === savedPlayback.currentSong.youtubeId || s.id === savedPlayback.currentSong.id);
      if (matched) return matched;
      return {
        ...savedPlayback.currentSong,
        artwork: savedPlayback.currentSong.artwork && !savedPlayback.currentSong.artwork.includes('.svg')
          ? savedPlayback.currentSong.artwork
          : `https://img.youtube.com/vi/${savedPlayback.currentSong.youtubeId}/hqdefault.jpg`,
      };
    }
    return songs[0];
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(() => {
    if (typeof savedPlayback?.currentTime === 'number' && !isNaN(savedPlayback.currentTime) && savedPlayback.currentTime > 0) {
      return savedPlayback.currentTime;
    }
    return 0;
  });
  const [duration, setDuration] = useState<number>(() => {
    if (typeof savedPlayback?.duration === 'number' && !isNaN(savedPlayback.duration) && savedPlayback.duration > 0) {
      return savedPlayback.duration;
    }
    return 0;
  });
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

  const currentIndex = currentQueueIndex;

  // Persistent YouTube Player instance ref & readiness flags
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isPlayerReadyRef = useRef<boolean>(false);
  const isInitializingRef = useRef<boolean>(false);


  // Track initial restore seek position so playback resumes from exact position when played
  const savedInitialTimeRef = useRef<number>(
    typeof savedPlayback?.currentTime === 'number' && !isNaN(savedPlayback.currentTime) && savedPlayback.currentTime > 0
      ? savedPlayback.currentTime
      : 0
  );
  const hasRestoredSeekRef = useRef<boolean>(false);

  // Pending play actions before player is fully ready
  const pendingActionRef = useRef<{
    type: 'playlist' | 'video' | 'play';
    playlistId?: string;
    startIndex?: number;
    videoId?: string;
  } | null>(null);

  // Error recovery & skipping tracking refs
  const skipCountRef = useRef<number>(0);
  const failedVideoIdsRef = useRef<Set<string>>(new Set());
  const isSkippingRef = useRef<boolean>(false);

  // Synchronized refs to prevent stale closures
  const currentSongRef = useRef(currentSong);
  currentSongRef.current = currentSong;
  const currentQueueRef = useRef(currentQueue);
  currentQueueRef.current = currentQueue;
  const currentQueueIndexRef = useRef(currentQueueIndex);
  currentQueueIndexRef.current = currentQueueIndex;
  const activePlaylistIdRef = useRef(activePlaylistId);
  activePlaylistIdRef.current = activePlaylistId;
  const isShuffleRef = useRef(isShuffle);
  isShuffleRef.current = isShuffle;
  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  // Persists current playback state immediately to localStorage
  const savePlaybackState = useCallback((overrideTime?: number, overridePlaying?: boolean) => {
    try {
      let latestTime = overrideTime !== undefined ? overrideTime : currentTimeRef.current;
      if (ytPlayerRef.current && isPlayerReadyRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const pTime = ytPlayerRef.current.getCurrentTime();
          if (typeof pTime === 'number' && !isNaN(pTime) && pTime >= 0) {
            latestTime = pTime;
          }
        } catch (e) {}
      }

      let latestDuration = durationRef.current;
      if (ytPlayerRef.current && isPlayerReadyRef.current && typeof ytPlayerRef.current.getDuration === 'function') {
        try {
          const pDur = ytPlayerRef.current.getDuration();
          if (typeof pDur === 'number' && !isNaN(pDur) && pDur > 0) {
            latestDuration = pDur;
          }
        } catch (e) {}
      }

      const stateToSave: SavedPlaybackState = {
        currentSong: currentSongRef.current,
        currentQueue: currentQueueRef.current,
        currentQueueIndex: currentQueueIndexRef.current,
        activePlaylistId: activePlaylistIdRef.current || YOUTUBE_PLAYLIST_ID,
        currentTime: latestTime,
        duration: latestDuration,
        isPlaying: overridePlaying !== undefined ? overridePlaying : isPlayingRef.current,
        timestamp: Date.now(),
      };

      localStorage.setItem(LOCAL_STORAGE_PLAYBACK_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.warn('Failed to save playback state to localStorage:', err);
    }
  }, []);

  // Save playback state immediately when user leaves / closes / pauses the page
  useEffect(() => {
    const handleUnload = () => {
      savePlaybackState();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        savePlaybackState();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [savePlaybackState]);

  // Updates current song metadata from the active YouTube Player instance
  const syncTrackFromPlayer = useCallback((player: any) => {
    if (!player) return;

    try {
      let videoData: any = null;
      if (typeof player.getVideoData === 'function') {
        videoData = player.getVideoData();
      }

      const videoId = videoData?.video_id || '';
      const rawTitle = videoData?.title || '';
      const rawAuthor = videoData?.author || '';

      // Check for duration
      if (typeof player.getDuration === 'function') {
        const d = player.getDuration();
        if (typeof d === 'number' && !isNaN(d) && d > 0) {
          setDuration(d);
        }
      }

      // If currentSong already matches this videoId, don't overwrite
      if (currentSongRef.current && currentSongRef.current.youtubeId === videoId) {
        savePlaybackState();
        return;
      }

      // If we find a matching song in currentQueue or master dataset, preserve rich metadata
      const matchedSong = videoId
        ? (currentQueueRef.current.find((s) => s.youtubeId === videoId) ||
           songs.find((s) => s.youtubeId === videoId))
        : null;

      if (matchedSong) {
        const queueIdx = currentQueueRef.current.findIndex((s) => s.id === matchedSong.id || s.youtubeId === matchedSong.youtubeId);
        if (queueIdx !== -1) {
          setCurrentQueueIndex(queueIdx);
        }
        setCurrentSong(matchedSong);
      } else if (rawTitle || videoId) {
        // Dynamic song fallback
        const dynamicSong: Song = {
          id: generateNumericId(videoId || rawTitle),
          title: rawTitle || 'Vintage Classic Melody',
          artist: rawAuthor || 'Nostalgia Collection',
          album: 'Golden Era',
          artwork: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/images/song-1.svg',
          youtubeId: videoId,
          category: 'vintage-classics',
          playlistIds: [YOUTUBE_PLAYLIST_ID, 'vintage-classics'],
        };
        setCurrentSong(dynamicSong);
      }
      savePlaybackState();
    } catch (err) {
      console.warn('Error syncing track metadata from player:', err);
    }
  }, [savePlaybackState]);

  // Next song definition
  const nextSong = useCallback(() => {
    const player = ytPlayerRef.current;
    const isReady = isPlayerReadyRef.current;

    isSkippingRef.current = false;
    hasRestoredSeekRef.current = true;

    const queue = currentQueueRef.current.length > 0 ? currentQueueRef.current : songs;
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

    const nextTrack = queue[nextIdx] || songs[nextIdx] || songs[0];
    if (nextTrack) {
      setCurrentQueueIndex(nextIdx);
      setCurrentSong(nextTrack);
      setCurrentTime(0);
      setIsPlaying(true);
      setErrorMessage(null);
      savePlaybackState(0, true);

      if (player && isReady) {
        try {
          if (nextTrack.youtubeId && typeof player.loadVideoById === 'function') {
            player.loadVideoById(nextTrack.youtubeId);
            player.playVideo();
            return;
          }
        } catch (err) {
          console.warn('Error playing next track:', err);
        }
      } else {
        pendingActionRef.current = { type: 'video', videoId: nextTrack.youtubeId, startIndex: nextIdx };
      }
    }
  }, [savePlaybackState]);

  const nextSongRef = useRef(nextSong);
  nextSongRef.current = nextSong;

  // Previous song definition
  const prevSong = useCallback(() => {
    const player = ytPlayerRef.current;
    const isReady = isPlayerReadyRef.current;
    hasRestoredSeekRef.current = true;

    // If past 3 seconds, restart current track
    if (player && isReady && typeof player.getCurrentTime === 'function') {
      const curTime = player.getCurrentTime();
      if (typeof curTime === 'number' && curTime > 3) {
        player.seekTo(0, true);
        setCurrentTime(0);
        savePlaybackState(0);
        return;
      }
    }

    const queue = currentQueueRef.current.length > 0 ? currentQueueRef.current : songs;
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

    const prevTrack = queue[prevIdx] || songs[prevIdx] || songs[0];
    if (prevTrack) {
      setCurrentQueueIndex(prevIdx);
      setCurrentSong(prevTrack);
      setCurrentTime(0);
      setIsPlaying(true);
      setErrorMessage(null);
      savePlaybackState(0, true);

      if (player && isReady) {
        try {
          if (prevTrack.youtubeId && typeof player.loadVideoById === 'function') {
            player.loadVideoById(prevTrack.youtubeId);
            player.playVideo();
            return;
          }
        } catch (err) {
          console.warn('Error playing previous track:', err);
        }
      } else {
        pendingActionRef.current = { type: 'video', videoId: prevTrack.youtubeId, startIndex: prevIdx };
      }
    }
  }, [savePlaybackState]);

  // Core Playback Error Handler: Automatically skips unplayable videos (errors 150, 101, 100, 2, 5, etc.) within THIS SAME PLAYLIST
  const handlePlaybackError = useCallback((errorCode: number) => {
    const player = ytPlayerRef.current;

    // Track failed video ID
    let currentVidId = '';
    try {
      if (player && typeof player.getVideoData === 'function') {
        currentVidId = player.getVideoData()?.video_id || '';
      }
    } catch (e) {}

    if (currentVidId) {
      failedVideoIdsRef.current.add(currentVidId);
    }

    // Determine total number of songs in playlist
    let totalItems = currentQueueRef.current.length || songs.length || 1;
    try {
      if (player && typeof player.getPlaylist === 'function') {
        const pl = player.getPlaylist();
        if (Array.isArray(pl) && pl.length > 0) {
          totalItems = pl.length;
        }
      }
    } catch (e) {}

    skipCountRef.current += 1;

    console.warn(
      `[Nostalgia Player] Playlist video unavailable for embedding (error ${errorCode}). Auto-skipping to next song in playlist (${skipCountRef.current}/${totalItems})...`
    );

    // If all videos in the playlist have been attempted and failed
    if (skipCountRef.current >= totalItems) {
      console.error('[Nostalgia Player] All videos in the playlist are unavailable.');
      setIsPlaying(false);
      setErrorMessage('Unable to play songs from the playlist.');
      skipCountRef.current = 0;
      isSkippingRef.current = false;
      return;
    }

    // Automatically skip to the next item in THIS SAME PLAYLIST
    if (isSkippingRef.current) return;
    isSkippingRef.current = true;

    setTimeout(() => {
      isSkippingRef.current = false;
      nextSongRef.current();
    }, 150);
  }, []);

  // Initialize ONE persistent YouTube IFrame Player Instance
  useEffect(() => {
    let checkInterval: any = null;

    const tryInitPlayer = () => {
      // 1. YouTube IFrame API availability check
      if (!window.YT || !window.YT.Player) {
        return;
      }

      // 2. DOM Container presence check
      const container = containerRef.current || document.getElementById('nostalgia-yt-iframe');
      if (!container) {
        return;
      }

      // 3. Prevent duplicate creation
      if (ytPlayerRef.current || isInitializingRef.current) {
        return;
      }
      isInitializingRef.current = true;

      try {
        const initialSong = currentSongRef.current || songs[0];
        ytPlayerRef.current = new window.YT.Player(container, {
          height: '240',
          width: '320',
          videoId: initialSong.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              isPlayerReadyRef.current = true;
              console.log('YT PLAYER ONREADY');

              try {
                if (isMutedRef.current) {
                  event.target.mute();
                } else {
                  event.target.unMute();
                  event.target.setVolume(volumeRef.current);
                }
              } catch (e) {
                console.warn('Error setting volume onReady:', e);
              }

              // Handle pending action if requested before player became ready
              if (pendingActionRef.current) {
                const action = pendingActionRef.current;
                pendingActionRef.current = null;

                if (action.videoId && typeof event.target.loadVideoById === 'function') {
                  event.target.loadVideoById(action.videoId);
                  event.target.playVideo();
                }
              } else {
                // Restoration on initial load: Cue current song and seek without auto-playing
                const initialTime = savedInitialTimeRef.current;
                const songToCue = currentSongRef.current || songs[0];
                if (songToCue?.youtubeId && typeof event.target.cueVideoById === 'function') {
                  event.target.cueVideoById({
                    videoId: songToCue.youtubeId,
                    startSeconds: initialTime,
                  });
                }
              }
            },
            onStateChange: (event: any) => {
              const state = event.data;

              if (state === 1) {
                // PLAYING
                setIsPlaying(true);
                setErrorMessage(null);
                skipCountRef.current = 0; // Reset skip count on successful playback
                isSkippingRef.current = false;

                syncTrackFromPlayer(event.target);
                savePlaybackState(undefined, true);
              } else if (state === 2) {
                // PAUSED
                setIsPlaying(false);
                savePlaybackState(undefined, false);
              } else if (state === 0) {
                // ENDED
                setIsPlaying(false);
                savePlaybackState(0, false);
                if (repeatModeRef.current === 'one') {
                  try {
                    event.target.seekTo(0, true);
                    event.target.playVideo();
                  } catch (e) {}
                } else {
                  nextSongRef.current();
                }
              }
            },
            onError: (event: any) => {
              const code = event.data;
              handlePlaybackError(code);
            },
          },
        });
      } catch (err) {
        console.error('Failed to create persistent YT.Player instance:', err);
        isInitializingRef.current = false;
      }
    };

    // Load YouTube IFrame API script if not already present
    if (!window.YT || !window.YT.Player) {
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      const prevHandler = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevHandler) prevHandler();
        tryInitPlayer();
      };
    }

    tryInitPlayer();

    checkInterval = setInterval(() => {
      if (ytPlayerRef.current) {
        clearInterval(checkInterval);
        return;
      }
      tryInitPlayer();
    }, 200);

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [handlePlaybackError, syncTrackFromPlayer, savePlaybackState]);

  // Volume & Mute Sync with YouTube Player
  useEffect(() => {
    if (ytPlayerRef.current && isPlayerReadyRef.current) {
      if (isMuted) {
        if (typeof ytPlayerRef.current.mute === 'function') ytPlayerRef.current.mute();
      } else {
        if (typeof ytPlayerRef.current.unMute === 'function') ytPlayerRef.current.unMute();
        if (typeof ytPlayerRef.current.setVolume === 'function') ytPlayerRef.current.setVolume(volume);
      }
    }
  }, [volume, isMuted]);

  // Time & Duration polling while playing + periodic persistence (every 1s)
  useEffect(() => {
    let interval: any = null;
    let tickCount = 0;

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

          // Persist playback state every 1 second (4 ticks * 250ms)
          tickCount++;
          if (tickCount % 4 === 0) {
            savePlaybackState(curTime, true);
          }
        }
      }, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, savePlaybackState]);

  // Controls Implementation
  const togglePlay = useCallback(() => {
    const player = ytPlayerRef.current;
    const isReady = isPlayerReadyRef.current;

    if (!player || !isReady) {
      pendingActionRef.current = { type: 'play' };
      setIsPlaying((prev) => !prev);
      return;
    }

    if (isPlayingRef.current) {
      if (typeof player.pauseVideo === 'function') player.pauseVideo();
      setIsPlaying(false);
      savePlaybackState(undefined, false);
    } else {
      // If we are resuming from a restored state, ensure seek to restored position
      if (!hasRestoredSeekRef.current && savedInitialTimeRef.current > 0) {
        hasRestoredSeekRef.current = true;
        try {
          if (typeof player.seekTo === 'function') {
            player.seekTo(savedInitialTimeRef.current, true);
          }
        } catch (e) {}
      }
      if (typeof player.playVideo === 'function') player.playVideo();
      setIsPlaying(true);
      savePlaybackState(undefined, true);
    }
  }, [savePlaybackState]);

  const pause = useCallback(() => {
    const player = ytPlayerRef.current;
    if (player && isPlayerReadyRef.current && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
    setIsPlaying(false);
    savePlaybackState(undefined, false);
  }, [savePlaybackState]);

  const playSong = useCallback((index?: number) => {
    const queue = currentQueueRef.current.length > 0 ? currentQueueRef.current : songs;
    if (queue.length === 0) return;
    const newIndex = index !== undefined ? Math.max(0, Math.min(index, queue.length - 1)) : currentQueueIndexRef.current;
    const targetSong = queue[newIndex] || songs[newIndex] || songs[0];
    if (!targetSong) return;

    hasRestoredSeekRef.current = true;
    setCurrentQueueIndex(newIndex);
    setCurrentSong(targetSong);
    setCurrentTime(0);
    setIsPlaying(true);
    setErrorMessage(null);
    skipCountRef.current = 0;
    savePlaybackState(0, true);

    const player = ytPlayerRef.current;
    if (player && isPlayerReadyRef.current) {
      try {
        if (targetSong.youtubeId && typeof player.loadVideoById === 'function') {
          player.loadVideoById(targetSong.youtubeId);
          player.playVideo();
        }
      } catch (e) {
        console.warn('Error playing track:', e);
      }
    } else {
      pendingActionRef.current = { type: 'video', videoId: targetSong.youtubeId, startIndex: newIndex };
    }
  }, [savePlaybackState]);

  const playQueue = useCallback((queue: Song[], startIndex = 0, playlistId?: string) => {
    hasRestoredSeekRef.current = true;
    setActivePlaylistId(playlistId || null);
    skipCountRef.current = 0;
    setErrorMessage(null);
    setCurrentTime(0);
    setIsPlaying(true);
    savePlaybackState(0, true);

    const targetQueue = queue && queue.length > 0 ? queue : songs;
    setCurrentQueue(targetQueue);
    const validIndex = Math.max(0, Math.min(startIndex, targetQueue.length - 1));
    setCurrentQueueIndex(validIndex);
    const targetSong = targetQueue[validIndex] || songs[0];
    if (targetSong) {
      setCurrentSong(targetSong);
    }

    const player = ytPlayerRef.current;
    if (player && isPlayerReadyRef.current) {
      try {
        if (targetSong?.youtubeId && typeof player.loadVideoById === 'function') {
          player.loadVideoById(targetSong.youtubeId);
          player.playVideo();
        }
      } catch (e) {
        console.warn('Error playing queue:', e);
      }
    } else {
      pendingActionRef.current = {
        type: 'video',
        videoId: targetSong?.youtubeId,
        startIndex: validIndex,
      };
    }
  }, [savePlaybackState]);

  const playSongInQueue = useCallback((song: Song, queue?: Song[], playlistId?: string) => {
    if (!song) return;

    const targetQueue = queue && queue.length > 0 ? queue : currentQueueRef.current;
    const songIdx = targetQueue.findIndex((s) => s.id === song.id || s.youtubeId === song.youtubeId);
    const idxToPlay = songIdx !== -1 ? songIdx : 0;

    if (queue && queue.length > 0) {
      setCurrentQueue(queue);
    }

    playQueue(targetQueue, idxToPlay, playlistId);
  }, [playQueue]);

  const playFavouriteSong = useCallback((song: Song) => {
    if (!song) return;

    hasRestoredSeekRef.current = true;
    // Keep or restore the master YouTube playlist queue
    const masterPlaylist = songs;
    setCurrentQueue(masterPlaylist);
    setActivePlaylistId(YOUTUBE_PLAYLIST_ID);

    // Locate the song index within the YouTube playlist
    const songIdx = masterPlaylist.findIndex((s) => s.id === song.id || s.youtubeId === song.youtubeId);
    const validIndex = songIdx !== -1 ? songIdx : 0;
    setCurrentQueueIndex(validIndex);

    const targetSong = songIdx !== -1 ? masterPlaylist[songIdx] : song;
    setCurrentSong(targetSong);
    setCurrentTime(0);
    setIsPlaying(true);
    setErrorMessage(null);
    skipCountRef.current = 0;
    savePlaybackState(0, true);

    const player = ytPlayerRef.current;
    if (player && isPlayerReadyRef.current) {
      try {
        if (targetSong?.youtubeId && typeof player.loadVideoById === 'function') {
          player.loadVideoById(targetSong.youtubeId);
          player.playVideo();
        }
      } catch (e) {
        console.warn('Error playing favourite song:', e);
      }
    } else {
      pendingActionRef.current = {
        type: 'video',
        videoId: targetSong?.youtubeId,
        startIndex: validIndex,
      };
    }
  }, [savePlaybackState]);

  const seek = useCallback((timeInSeconds: number) => {
    const clampedTime = Math.max(0, Math.min(timeInSeconds, duration || 100));
    setCurrentTime(clampedTime);
    hasRestoredSeekRef.current = true;
    if (ytPlayerRef.current && isPlayerReadyRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      ytPlayerRef.current.seekTo(clampedTime, true);
    }
    savePlaybackState(clampedTime);
  }, [duration, savePlaybackState]);

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
          if (typeof ytPlayerRef.current.mute === 'function') ytPlayerRef.current.mute();
        } else {
          if (typeof ytPlayerRef.current.unMute === 'function') ytPlayerRef.current.unMute();
        }
      }
      return nextMute;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const nextVal = !prev;
      if (ytPlayerRef.current && isPlayerReadyRef.current && typeof ytPlayerRef.current.setShuffle === 'function') {
        ytPlayerRef.current.setShuffle(nextVal);
      }
      return nextVal;
    });
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      const nextVal = prev === 'off' ? 'one' : 'off';
      if (ytPlayerRef.current && isPlayerReadyRef.current && typeof ytPlayerRef.current.setLoop === 'function') {
        ytPlayerRef.current.setLoop(nextVal === 'one');
      }
      return nextVal;
    });
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

  const testYouTubePlayback = useCallback(() => {
    console.log('[Nostalgia Player] Testing YouTube playlist playback for:', YOUTUBE_PLAYLIST_ID);
    playQueue(songs, 0, YOUTUBE_PLAYLIST_ID);
  }, [playQueue]);

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
        playFavouriteSong,
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
        testYouTubePlayback,
      }}
    >
      {children}

      {/* Persistent Off-Screen YouTube Player Iframe Container */}
      <div
        id="youtube-player-container"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '320px',
          height: '240px',
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      >
        <div ref={containerRef} id="nostalgia-yt-iframe" />
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
