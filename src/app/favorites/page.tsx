"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Sparkles, Film, Clapperboard } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { MovieGrid } from "@/features/movies/components/MovieGrid";
import Link from "next/link";

export default function FavoritesPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const clearAll = useFavoritesStore((s) => s.clearAll);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredFavorites = favorites.filter((item) => {
    if (activeFilter === "all") return true;
    return item.Type.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="relative min-h-screen pb-20">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 ambient-glow opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* ── Apple-style Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.07] pb-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-0.5 text-xs font-semibold text-red-400">
              <Heart className="size-3 fill-red-500" />
              <span>Personal Collection</span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Your <span className="amber-gradient-text">Favorites</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {favorites.length === 0
                ? "Your library is waiting for great stories."
                : `Saved ${favorites.length} cinematic title${
                    favorites.length === 1 ? "" : "s"
                  } to your offline store`}
            </p>
          </div>

          {/* Actions & Filters */}
          {favorites.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter Pills */}
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs font-semibold backdrop-blur-md">
                {["all", "movie", "series"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveFilter(type)}
                    className={`rounded-full px-3 py-1 capitalize transition-all ${
                      activeFilter === type
                        ? "bg-amber text-black font-bold"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Clear All Button */}
              <button
                onClick={() => {
                  if (window.confirm("Remove all saved movies from your favorites?")) {
                    clearAll();
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-400 backdrop-blur-md transition-all hover:bg-red-500/20"
              >
                <Trash2 className="size-3.5" />
                Clear All
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Content Grid or Empty State ── */}
        <div className="pt-8">
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-5 py-24 text-center rounded-3xl apple-glass p-8 max-w-lg mx-auto border border-white/5"
            >
              <div className="relative flex size-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-2xl shadow-red-500/10">
                <Heart className="size-10 fill-red-500/20 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Watchlist is Empty</h3>
                <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
                  Click the heart icon on any movie or series card to add it to your personal Apple-style collection.
                </p>
              </div>
              <Link
                href="/"
                className="mt-2 inline-flex items-center gap-2 rounded-xl apple-button-primary px-5 py-2.5 text-xs font-bold"
              >
                <Sparkles className="size-4" />
                Explore Movies Now
              </Link>
            </motion.div>
          ) : (
            <MovieGrid
              movies={filteredFavorites}
              emptyMessage={`No ${activeFilter} found in your favorites.`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
