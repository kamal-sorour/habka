"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  Calendar,
  Globe,
  Award,
  DollarSign,
  Clapperboard,
  Users,
  Share2,
  Check,
  ExternalLink,
  Play,
  Sparkles,
  Tv,
  Film,
} from "lucide-react";
import { motion } from "framer-motion";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import type { MovieDetail } from "@/features/movies/types/schemas";
import { formatActorSlug } from "@/core/actors.config";

interface MovieDetailClientProps {
  movie: MovieDetail;
}

export function MovieDetailClient({ movie }: MovieDetailClientProps) {
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(movie.imdbID));
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleToggle = () => {
    toggleFavorite({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Type: movie.Type,
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const imdbScore = movie.imdbRating ? parseFloat(movie.imdbRating) : null;
  const hasValidPoster =
    movie.Poster &&
    movie.Poster !== "N/A" &&
    movie.Poster.trim().length > 0 &&
    !imageError;

  const actorsList =
    movie.Actors && movie.Actors !== "N/A"
      ? movie.Actors.split(",").map((a) => a.trim())
      : [];

  const isSeries = movie.Type?.toLowerCase() === "series";

  return (
    <div className="relative min-h-screen pb-24">
      {/* ── Immersive Blurred Ambient Backdrop ── */}
      {hasValidPoster && (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <Image
            src={movie.Poster!}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-[110px] opacity-30 scale-125"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060709]/75 via-[#060709]/90 to-[#060709]" />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* ── Top Navigation Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-xl transition-all hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Explore
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Direct Watch Now CTA */}
            <Link
              href={`/watch/${movie.imdbID}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="size-3.5 fill-black" />
              <span>Watch Now</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-xl transition-all hover:bg-white/[0.08] hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {movie.imdbID && (
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-amber/30 bg-amber/10 px-3.5 py-2 text-xs font-semibold text-amber backdrop-blur-xl transition-all hover:bg-amber/20"
              >
                <span>IMDb</span>
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* ── Main Movie Showcase ── */}
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:gap-14">
          {/* ── Left: Floating 3D Poster ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[280px] sm:max-w-[300px] lg:mx-0 flex-shrink-0"
          >
            <div className="group relative aspect-[2/3] overflow-hidden rounded-3xl apple-glass p-2.5 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              {hasValidPoster ? (
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <Image
                    src={movie.Poster!}
                    alt={`${movie.Title} poster`}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                  {/* Subtle specular shine reflection */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent" />

                  {/* Play overlay on poster hover */}
                  <Link
                    href={`/watch/${movie.imdbID}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <div className="flex size-16 items-center justify-center rounded-full bg-amber text-black shadow-2xl shadow-amber/50 transition-transform group-hover:scale-110">
                      <Play className="size-7 fill-black ml-1" />
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-white/[0.02] text-muted-foreground/40 gap-3">
                  <Clapperboard className="size-12 stroke-[1.2]" />
                  <span className="text-xs font-medium">No Poster Available</span>
                </div>
              )}
            </div>

            {/* ── Big Primary Watch CTA Button ── */}
            <Link
              href={`/watch/${movie.imdbID}`}
              className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_auto] py-3.5 text-sm font-extrabold text-black shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="size-5 fill-black text-black" />
              <span>تشغيل الفيلم / Watch {isSeries ? "Series" : "Movie"}</span>
            </Link>

            {/* Quick Favorite Button */}
            <motion.button
              onClick={handleToggle}
              whileTap={{ scale: 0.96 }}
              className={`mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition-all ${
                isFavorite
                  ? "border border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25 shadow-lg shadow-red-500/10"
                  : "apple-button-secondary"
              }`}
            >
              <Heart
                className={`size-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
              <span>{isFavorite ? "Saved in Favorites" : "Add to Watchlist"}</span>
            </motion.button>
          </motion.div>

          {/* ── Right: Comprehensive Info & Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 space-y-6"
          >
            {/* Header Title + Metadata Pills */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber/30 bg-amber/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber">
                  {movie.Type}
                </span>
                {movie.Rated && movie.Rated !== "N/A" && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/80">
                    {movie.Rated}
                  </span>
                )}
                {movie.Runtime && movie.Runtime !== "N/A" && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3 text-muted-foreground/70" />
                    {movie.Runtime}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {movie.Title}
              </h1>

              <p className="text-sm font-medium text-muted-foreground">
                Released in {movie.Year}{" "}
                {movie.Released && movie.Released !== "N/A"
                  ? `• ${movie.Released}`
                  : ""}
              </p>
            </div>

            {/* Genre Pills */}
            {movie.Genre && movie.Genre !== "N/A" && (
              <div className="flex flex-wrap gap-2">
                {movie.Genre.split(", ").map((genre) => (
                  <span
                    key={genre}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Apple-style Ratings Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imdbScore !== null && (
                <div className="flex items-center gap-3 rounded-2xl apple-glass p-3.5 border border-white/[0.08]">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber/15 text-amber">
                    <Star className="size-5 fill-amber text-amber" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-white">
                      {movie.imdbRating}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        / 10
                      </span>
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground">
                      IMDb ({movie.imdbVotes ?? "N/A"})
                    </div>
                  </div>
                </div>
              )}

              {movie.Metascore && movie.Metascore !== "N/A" && (
                <div className="flex items-center gap-3 rounded-2xl apple-glass p-3.5 border border-white/[0.08]">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-sm">
                    {movie.Metascore}
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-white">
                      Metascore
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground">
                      Critic Consensus
                    </div>
                  </div>
                </div>
              )}

              {movie.Ratings?.filter((r) =>
                r.Source.includes("Rotten Tomatoes")
              ).map((r) => (
                <div
                  key={r.Source}
                  className="flex items-center gap-3 rounded-2xl apple-glass p-3.5 border border-white/[0.08]"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 font-bold text-xs">
                    🍅
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-white">
                      {r.Value}
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground">
                      Rotten Tomatoes
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Plot Summary */}
            {movie.Plot && movie.Plot !== "N/A" && (
              <div className="rounded-2xl apple-glass p-5 border border-white/[0.08] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                  Synopsis
                </h3>
                <p className="text-sm leading-relaxed text-foreground/90 font-normal">
                  {movie.Plot}
                </p>
              </div>
            )}

            {/* Bento Grid Metadata Details with Clickable Cast & Crew */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {movie.Director && movie.Director !== "N/A" && (
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80">
                    <Clapperboard className="size-4 text-amber" />
                    <span>Director</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.Director.split(",").map((d) => {
                      const dirName = d.trim();
                      return (
                        <Link
                          key={dirName}
                          href={`/actor/${formatActorSlug(dirName)}`}
                          className="group inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-amber transition-colors"
                        >
                          <span className="underline underline-offset-2">
                            {dirName}
                          </span>
                          <Sparkles className="size-2.5 opacity-0 group-hover:opacity-100 text-amber transition-opacity" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {movie.Writer && movie.Writer !== "N/A" && (
                <BentoItem
                  icon={<Clapperboard className="size-4 text-sky-400" />}
                  label="Writer"
                  value={movie.Writer}
                />
              )}

              {actorsList.length > 0 && (
                <div className="sm:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80">
                      <Users className="size-4 text-purple-400" />
                      <span>Leading Cast (Click to view full filmography)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {actorsList.map((actor) => (
                      <Link
                        key={actor}
                        href={`/actor/${formatActorSlug(actor)}`}
                        className="group flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:border-amber/40 hover:bg-amber/10 hover:text-amber hover:scale-105"
                      >
                        <span>{actor}</span>
                        <Sparkles className="size-3 text-amber opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {movie.Awards && movie.Awards !== "N/A" && (
                <BentoItem
                  icon={<Award className="size-4 text-amber" />}
                  label="Awards"
                  value={movie.Awards}
                />
              )}
              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <BentoItem
                  icon={<DollarSign className="size-4 text-emerald-400" />}
                  label="Box Office"
                  value={movie.BoxOffice}
                />
              )}
              {movie.Language && movie.Language !== "N/A" && (
                <BentoItem
                  icon={<Globe className="size-4 text-blue-400" />}
                  label="Language & Country"
                  value={`${movie.Language} (${movie.Country ?? "Global"})`}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BentoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-xl space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-xs sm:text-sm font-medium text-white/90 leading-snug">
        {value}
      </p>
    </div>
  );
}
