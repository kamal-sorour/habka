"use client";

import { motion } from "framer-motion";
import { MovieCard } from "./MovieCard";
import { Film, Search } from "lucide-react";
import Link from "next/link";

interface MovieGridMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string | null;
  Type: string;
}

interface MovieGridProps {
  movies: MovieGridMovie[];
  emptyMessage?: string;
}

export function MovieGrid({
  movies,
  emptyMessage = "No movies found. Try exploring with different keywords.",
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-4 py-20 text-center rounded-3xl apple-glass p-8 border border-white/5 max-w-lg mx-auto"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber/10 text-amber border border-amber/20 shadow-lg shadow-amber/5">
          <Film className="size-8 stroke-[1.5]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">No Results Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-xl apple-button-secondary px-4 py-2 text-xs font-semibold"
        >
          <Search className="size-3.5" />
          Clear Search
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-5">
      {movies.map((movie, i) => (
        <MovieCard key={`${movie.imdbID}-${i}`} index={i} {...movie} />
      ))}
    </div>
  );
}
