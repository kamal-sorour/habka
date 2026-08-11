"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  Share2,
  Check,
  Maximize2,
  Sparkles,
  Server,
  Play,
  RotateCcw,
  Film,
  Tv,
  CheckCircle2,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import type { MovieDetail, MovieSearchItem } from "@/features/movies/types/schemas";
import { MovieCard } from "@/features/movies/components/MovieCard";
import { formatActorSlug } from "@/core/actors.config";

interface WatchPlayerClientProps {
  movie: MovieDetail;
  recommendations: MovieSearchItem[];
  initialSeason?: number;
  initialEpisode?: number;
}

type ServerType =
  | "vidlink"
  | "embed-su"
  | "vidsrc-icu"
  | "vidsrc-cc"
  | "autoembed"
  | "smashystream"
  | "two-embed"
  | "vidsrc-xyz"
  | "trailer";

interface ServerConfig {
  id: ServerType;
  label: string;
  badge?: string;
  description: string;
}

const STREAMING_SERVERS: ServerConfig[] = [
  { id: "vidlink", label: "Server 1 (VidLink Pro)", badge: "Fast 1080p", description: "Ultra-fast CDN with multi-language subtitle selector." },
  { id: "embed-su", label: "Server 2 (Embed.su)", badge: "4K / Ultra", description: "High-bitrate cinema quality stream with low latency." },
  { id: "vidsrc-icu", label: "Server 3 (VidSrc ICU)", badge: "Multi-Audio", description: "Reliable HD stream with multiple audio track support." },
  { id: "vidsrc-cc", label: "Server 4 (VidSrc CC)", badge: "HD Clean", description: "Optimized buffer-free streaming server." },
  { id: "autoembed", label: "Server 5 (AutoEmbed)", badge: "Multi-Sub", description: "Comprehensive multilingual captions and alternate mirrors." },
  { id: "smashystream", label: "Server 6 (SmashyStream)", badge: "VIP CDN", description: "Multi-player streaming source with automatic failover." },
  { id: "two-embed", label: "Server 7 (2Embed)", badge: "Fast Mirror", description: "Alternate high-speed mirror for instant playback." },
  { id: "vidsrc-xyz", label: "Server 8 (VidSrc Global)", badge: "Global", description: "International streaming mirror." },
  { id: "trailer", label: "Official 4K Trailer", badge: "YouTube", description: "Official 4K YouTube theatrical trailer." },
];

export function WatchPlayerClient({
  movie,
  recommendations,
  initialSeason = 1,
  initialEpisode = 1,
}: WatchPlayerClientProps) {
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(movie.imdbID));

  const [currentServer, setCurrentServer] = useState<ServerType>("vidlink");
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [lightsDimmed, setLightsDimmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isSeries = movie.Type?.toLowerCase() === "series";

  // Build embed stream URL based on active server
  const getEmbedUrl = () => {
    if (currentServer === "trailer") {
      const query = encodeURIComponent(`${movie.Title} ${movie.Year} official trailer`);
      return `https://www.youtube-nocookie.com/embed?listType=search&list=${query}&autoplay=1`;
    }

    if (isSeries) {
      switch (currentServer) {
        case "vidlink":
          return `https://vidlink.pro/tv/${movie.imdbID}/${season}/${episode}`;
        case "embed-su":
          return `https://embed.su/embed/tv/${movie.imdbID}/${season}/${episode}`;
        case "vidsrc-icu":
          return `https://vidsrc.icu/embed/tv/${movie.imdbID}/${season}/${episode}`;
        case "vidsrc-cc":
          return `https://vidsrc.cc/v2/embed/tv/${movie.imdbID}/${season}/${episode}`;
        case "autoembed":
          return `https://autoembed.co/tv/imdb/${movie.imdbID}-${season}-${episode}`;
        case "smashystream":
          return `https://player.smashy.stream/tv/${movie.imdbID}?s=${season}&e=${episode}`;
        case "two-embed":
          return `https://www.2embed.cc/embedtv/${movie.imdbID}&s=${season}&e=${episode}`;
        case "vidsrc-xyz":
        default:
          return `https://vidsrc.xyz/embed/tv/${movie.imdbID}/${season}-${episode}`;
      }
    } else {
      switch (currentServer) {
        case "vidlink":
          return `https://vidlink.pro/movie/${movie.imdbID}`;
        case "embed-su":
          return `https://embed.su/embed/movie/${movie.imdbID}`;
        case "vidsrc-icu":
          return `https://vidsrc.icu/embed/movie/${movie.imdbID}`;
        case "vidsrc-cc":
          return `https://vidsrc.cc/v2/embed/movie/${movie.imdbID}`;
        case "autoembed":
          return `https://autoembed.co/movie/imdb/${movie.imdbID}`;
        case "smashystream":
          return `https://player.smashy.stream/movie/${movie.imdbID}`;
        case "two-embed":
          return `https://www.2embed.cc/embed/${movie.imdbID}`;
        case "vidsrc-xyz":
        default:
          return `https://vidsrc.xyz/embed/movie/${movie.imdbID}`;
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReloadPlayer = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const castList =
    movie.Actors && movie.Actors !== "N/A"
      ? movie.Actors.split(",").map((a) => a.trim())
      : [];

  const activeServerInfo = STREAMING_SERVERS.find((s) => s.id === currentServer);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 ${
        lightsDimmed ? "bg-black" : "bg-[#060709]"
      }`}
    >
      {/* ── Ambient Reactive Glow Behind Theater ── */}
      {movie.Poster && (
        <div
          className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-700 ${
            lightsDimmed ? "opacity-10" : "opacity-30"
          }`}
        >
          <Image
            src={movie.Poster}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-[120px] scale-150"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060709]/80 via-[#060709]/95 to-[#060709]" />
        </div>
      )}

      {/* Dim Overlay when Lights Dimmed */}
      <AnimatePresence>
        {lightsDimmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/90 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 transition-all duration-500 ${
          isTheaterMode ? "max-w-[1700px]" : "max-w-7xl"
        }`}
      >
        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/movie/${movie.imdbID}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-xl transition-all hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="size-4" />
              <span>Movie Info</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-white/30">•</span>
              <span className="text-sm font-bold text-white line-clamp-1">
                {movie.Title}
              </span>
              <span className="text-xs text-muted-foreground">({movie.Year})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reload Player Button */}
            <button
              onClick={handleReloadPlayer}
              title="Reload video stream"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-xl transition-all hover:bg-white/[0.08] hover:text-white"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Lights Dim Toggle */}
            <button
              onClick={() => setLightsDimmed(!lightsDimmed)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl transition-all ${
                lightsDimmed
                  ? "border-amber/40 bg-amber/20 text-amber"
                  : "border-white/[0.08] bg-white/[0.04] text-muted-foreground hover:text-white"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span className="hidden sm:inline">
                {lightsDimmed ? "Lights On" : "Cinema Lights"}
              </span>
            </button>

            {/* Theater Mode Toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl transition-all ${
                isTheaterMode
                  ? "border-amber/40 bg-amber/20 text-amber"
                  : "border-white/[0.08] bg-white/[0.04] text-muted-foreground hover:text-white"
              }`}
            >
              <Maximize2 className="size-3.5" />
              <span className="hidden sm:inline">
                {isTheaterMode ? "Standard" : "Theater"}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-xl transition-all hover:text-white"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Share2 className="size-3.5" />
              )}
            </button>

            {/* Favorite Button */}
            <button
              onClick={() =>
                toggleFavorite({
                  imdbID: movie.imdbID,
                  Title: movie.Title,
                  Year: movie.Year,
                  Poster: movie.Poster,
                  Type: movie.Type,
                })
              }
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl transition-all ${
                isFavorite
                  ? "border-red-500/40 bg-red-500/20 text-red-400"
                  : "border-white/[0.08] bg-white/[0.04] text-muted-foreground hover:text-white"
              }`}
            >
              <Heart
                className={`size-3.5 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Apple Vision Player Stage (Unrestricted Iframe for Instant Playback) ── */}
        <div
          className={`relative z-30 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_20px_70px_rgba(0,0,0,0.95)] ${
            isTheaterMode
              ? "aspect-[21/9] sm:aspect-[2.2/1] min-h-[420px]"
              : "aspect-video min-h-[320px] sm:min-h-[480px]"
          }`}
        >
          <iframe
            key={`${currentServer}-${season}-${episode}-${refreshKey}`}
            src={getEmbedUrl()}
            className="h-full w-full border-0 bg-black"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            title={`${movie.Title} Video Stream`}
          />
        </div>

        {/* ── Active Server Status & Instructions ── */}
        <div className="relative z-30 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span className="text-white/90">
              Active: <strong className="text-amber">{activeServerInfo?.label}</strong> —{" "}
              <span className="text-muted-foreground">{activeServerInfo?.description}</span>
            </span>
          </div>
          <div className="text-[11px] text-white/50 flex items-center gap-1">
            <Info className="size-3 text-amber" />
            <span>إذا واجهت بطء أو توقف، جرب التبديل لأي سيرفر آخر من القائمة بالأسفل</span>
          </div>
        </div>

        {/* ── Expanded Multi-Server Switcher Bar ── */}
        <div className="relative z-30 mt-4 space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <Server className="size-4 text-amber" />
              <span>Available Streaming Servers ({STREAMING_SERVERS.length} Sources):</span>
            </div>

            {/* Series Season & Episode Picker */}
            {isSeries && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">
                  <span className="text-muted-foreground">Season:</span>
                  <select
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="bg-transparent font-bold text-white outline-none cursor-pointer"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((s) => (
                      <option
                        key={s}
                        value={s}
                        className="bg-zinc-900 text-white"
                      >
                        Season {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">
                  <span className="text-muted-foreground">Episode:</span>
                  <select
                    value={episode}
                    onChange={(e) => setEpisode(Number(e.target.value))}
                    className="bg-transparent font-bold text-white outline-none cursor-pointer"
                  >
                    {Array.from({ length: 40 }, (_, i) => i + 1).map((ep) => (
                      <option
                        key={ep}
                        value={ep}
                        className="bg-zinc-900 text-white"
                      >
                        Episode {ep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Grid of Streaming Server Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
            {STREAMING_SERVERS.map((server) => {
              const isActive = currentServer === server.id;
              return (
                <button
                  key={server.id}
                  type="button"
                  onClick={() => setCurrentServer(server.id)}
                  className={`flex flex-col items-start rounded-xl p-2.5 text-left transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-lg shadow-amber-500/20 scale-[1.02]"
                      : "border border-white/5 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className={`text-xs font-bold line-clamp-1 ${isActive ? "text-black" : "text-white"}`}>
                      {server.label}
                    </span>
                  </div>
                  {server.badge && (
                    <span
                      className={`mt-1 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                        isActive
                          ? "bg-black/20 text-black"
                          : "bg-white/10 text-amber"
                      }`}
                    >
                      {server.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Movie Information Under Player ── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
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

              <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {movie.Title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{movie.Year}</span>
                {movie.imdbRating && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber font-bold">
                      <Star className="size-3.5 fill-amber" />
                      {movie.imdbRating} / 10
                    </span>
                  </>
                )}
                {movie.Genre && (
                  <>
                    <span>•</span>
                    <span>{movie.Genre}</span>
                  </>
                )}
              </div>
            </div>

            {/* Synopsis */}
            {movie.Plot && movie.Plot !== "N/A" && (
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                  Overview
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 font-normal">
                  {movie.Plot}
                </p>
              </div>
            )}

            {/* Cast with clickable links to Actor Pages */}
            {castList.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                  Starring Cast (Click to Explore Actor Filmography)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {castList.map((actor) => (
                    <Link
                      key={actor}
                      href={`/actor/${formatActorSlug(actor)}`}
                      className="group flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/90 backdrop-blur-xl transition-all hover:border-amber/40 hover:bg-amber/10 hover:text-amber"
                    >
                      <span>{actor}</span>
                      <Sparkles className="size-3 text-amber opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Metadata */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Film Details
              </h3>

              <div className="space-y-3 text-xs">
                {movie.Director && movie.Director !== "N/A" && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Director
                    </span>
                    <Link
                      href={`/actor/${formatActorSlug(
                        movie.Director.split(",")[0]
                      )}`}
                      className="font-bold text-white hover:text-amber transition-colors"
                    >
                      {movie.Director}
                    </Link>
                  </div>
                )}

                {movie.Writer && movie.Writer !== "N/A" && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Writer
                    </span>
                    <span className="font-semibold text-white/90">
                      {movie.Writer}
                    </span>
                  </div>
                )}

                {movie.Awards && movie.Awards !== "N/A" && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Accolades
                    </span>
                    <span className="font-semibold text-amber">
                      {movie.Awards}
                    </span>
                  </div>
                )}

                {movie.Language && movie.Language !== "N/A" && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Language
                    </span>
                    <span className="font-semibold text-white/90">
                      {movie.Language}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommendations / Up Next ── */}
        {recommendations.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber" />
                <h2 className="text-lg font-bold tracking-tight text-white">
                  More Like This
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-5">
              {recommendations.map((rec, i) => (
                <MovieCard key={rec.imdbID} index={i} {...rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
