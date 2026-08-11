// ---------------------------------------------------------------------------
// Zustand Favorites Store — with localStorage persistence
// ---------------------------------------------------------------------------
// Manages the user's saved movies. Uses the `persist` middleware so
// favourites survive page reloads and browser restarts.
// ---------------------------------------------------------------------------

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ========================== Types ======================================== //

/**
 * Lightweight movie snapshot stored in favourites.
 * We intentionally keep this small to avoid bloating localStorage.
 */
export interface FavoriteMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string | null;
  Type: string;
}

interface FavoritesState {
  favorites: FavoriteMovie[];
}

interface FavoritesActions {
  /** Add a movie to favourites (no-op if already exists). */
  addFavorite: (movie: FavoriteMovie) => void;

  /** Remove a movie by its IMDb ID. */
  removeFavorite: (imdbID: string) => void;

  /** Check whether a movie is already saved. */
  isFavorite: (imdbID: string) => boolean;

  /** Add if not saved, remove if already saved. */
  toggleFavorite: (movie: FavoriteMovie) => void;

  /** Remove all favourites at once. */
  clearAll: () => void;
}

// ========================== Store ======================================= //

export const useFavoritesStore = create<FavoritesState & FavoritesActions>()(
  persist(
    (set, get) => ({
      // ---- State -------------------------------------------------------- //
      favorites: [],

      // ---- Actions ------------------------------------------------------ //
      addFavorite: (movie) => {
        const exists = get().favorites.some((f) => f.imdbID === movie.imdbID);
        if (exists) return;
        set((state) => ({ favorites: [...state.favorites, movie] }));
      },

      removeFavorite: (imdbID) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.imdbID !== imdbID),
        }));
      },

      isFavorite: (imdbID) => {
        return get().favorites.some((f) => f.imdbID === imdbID);
      },

      toggleFavorite: (movie) => {
        const exists = get().favorites.some((f) => f.imdbID === movie.imdbID);
        if (exists) {
          set((state) => ({
            favorites: state.favorites.filter(
              (f) => f.imdbID !== movie.imdbID
            ),
          }));
        } else {
          set((state) => ({ favorites: [...state.favorites, movie] }));
        }
      },

      clearAll: () => set({ favorites: [] }),
    }),
    {
      name: "habka-favorites",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
