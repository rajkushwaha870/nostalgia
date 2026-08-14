import { useMusicPlayer } from '../context/MusicPlayerContext';

export interface UseFavouritesReturn {
  favorites: number[];
  isFavourite: (songId: number) => boolean;
  addFavourite: (songId: number) => void;
  removeFavourite: (songId: number) => void;
  toggleFavourite: (songId: number) => void;
  clearFavourites: () => void;
}

export const useFavourites = (): UseFavouritesReturn => {
  const {
    favorites,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    clearFavourites,
  } = useMusicPlayer();

  return {
    favorites,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    clearFavourites,
  };
};
