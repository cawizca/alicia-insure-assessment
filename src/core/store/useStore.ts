import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Favourite, StoreState } from '../types';

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      favourites: [],

      addFavourite: (favourite: Favourite) => {
        const { isFavourite } = get();
        if (!isFavourite(favourite.trackName, favourite.artistName)) {
          set((state) => ({
            favourites: [...state.favourites, favourite],
          }));
        }
      },

      removeFavourite: (trackName: string, artistName: string) => {
        set((state) => ({
          favourites: state.favourites.filter(
            (fav) =>
              !(fav.trackName === trackName && fav.artistName === artistName)
          ),
        }));
      },

      isFavourite: (trackName: string, artistName: string) => {
        const { favourites } = get();
        return favourites.some(
          (fav) => fav.trackName === trackName && fav.artistName === artistName
        );
      },
    }),
    {
      name: 'artist-showcase-storage',
    }
  )
);
