"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Award,
  Film,
  Tv,
  Globe,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Clapperboard,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ActorProfile } from "@/core/actors.config";
import type { MovieSearchItem } from "@/features/movies/types/schemas";
import { MovieGrid } from "@/features/movies/components/MovieGrid";

interface ActorClientProps {
  actorSlug: string;
  actorName: string;
  actorProfile?: ActorProfile;
  movies: MovieSearchItem[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  currentType?: "movie" | "series" | "episode";
  featuredStars: ActorProfile[];
}

export function ActorClient({
  actorSlug,
  actorName,
  actorProfile,
  movies,
  totalResults,
  currentPage,
  totalPages,
  currentType,
  featuredStars,
}: ActorClientProps) {
  return (
    <div className="relative min-h-screen pb-24">
      {/* ── Ambient Background Glow ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 ambient-glow opacity-80" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* ── Quick Star Switcher Carousel / Pill Bar ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/[0.06]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap mr-1">
            Top Stars:
          </span>
          {featuredStars.map((star) => {
            const isCurrent = star.slug === actorSlug || star.name.toLowerCase() === actorName.toLowerCase();
            return (
              <Link
                key={star.slug}
                href={`/actor/${star.slug}`}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold scale-105"
                    : "border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <div className="relative size-5 overflow-hidden rounded-full border border-white/20 bg-zinc-800">
                  <Image
                    src={star.avatar}
                    alt={star.name}
                    fill
                    sizes="20px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span>{star.name}</span>
              </Link>
            );
          })}
        </div>

        {/* ── Apple-Grade Star Profile Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mt-8 overflow-hidden rounded-3xl apple-glass p-6 sm:p-10 border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Star Avatar */}
            <div className="relative size-36 sm:size-44 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl bg-zinc-900">
              {actorProfile?.avatar ? (
                <Image
                  src={actorProfile.avatar}
                  alt={actorName}
                  fill
                  sizes="200px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/[0.02] text-white/30">
                  <User className="size-16 stroke-[1]" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="rounded-full border border-amber/30 bg-amber/10 px-3 py-0.5 text-xs font-bold text-amber">
                  {actorProfile?.role ?? "Film Star"}
                </span>

                {actorProfile?.nationality && (
                  <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/80">
                    <Globe className="size-3 text-muted-foreground" />
                    {actorProfile.nationality}
                  </span>
                )}

                {actorProfile?.awardsCount && (
                  <span className="flex items-center gap-1 rounded-full border border-amber/20 bg-amber/5 px-2.5 py-0.5 text-xs font-medium text-amber">
                    <Award className="size-3 text-amber" />
                    {actorProfile.awardsCount}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {actorName}
              </h1>

              {actorProfile?.bio ? (
                <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                  {actorProfile.bio}
                </p>
              ) : (
                <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                  Explore all cinematic releases, TV series appearances, and full filmography of {actorName}.
                </p>
              )}

              {/* Notable Works Chips */}
              {actorProfile?.notableWorks && (
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/50 mr-1">
                    Notable Works:
                  </span>
                  {actorProfile.notableWorks.map((work) => (
                    <span
                      key={work}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/90"
                    >
                      {work}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Filmography Section ── */}
        <div className="mt-12 space-y-8">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/70">
                Filmography & Roles
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Found <span className="text-amber">{totalResults}</span> works featuring {actorName}
              </h2>
            </div>

            {/* Type Filter Pills */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs font-semibold backdrop-blur-md">
              <Link
                href={`/actor/${actorSlug}?page=1`}
                className={`rounded-full px-3 py-1 transition-colors ${
                  !currentType ? "bg-amber text-black font-bold" : "text-muted-foreground hover:text-white"
                }`}
              >
                All Works
              </Link>
              <Link
                href={`/actor/${actorSlug}?page=1&type=movie`}
                className={`rounded-full px-3 py-1 transition-colors ${
                  currentType === "movie" ? "bg-amber text-black font-bold" : "text-muted-foreground hover:text-white"
                }`}
              >
                Movies
              </Link>
              <Link
                href={`/actor/${actorSlug}?page=1&type=series`}
                className={`rounded-full px-3 py-1 transition-colors ${
                  currentType === "series" ? "bg-amber text-black font-bold" : "text-muted-foreground hover:text-white"
                }`}
              >
                Series
              </Link>
            </div>
          </div>

          {/* Grid */}
          <MovieGrid
            movies={movies}
            emptyMessage={`No titles found for ${actorName} in this category.`}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              {currentPage > 1 ? (
                <Link
                  href={`/actor/${actorSlug}?page=${currentPage - 1}${currentType ? `&type=${currentType}` : ""}`}
                  className="flex items-center gap-1.5 rounded-xl apple-button-secondary px-4 py-2.5 text-xs font-semibold"
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-muted-foreground/30 cursor-not-allowed">
                  <ChevronLeft className="size-4" />
                  Previous
                </span>
              )}

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-md">
                Page <span className="font-bold text-white">{currentPage}</span> of{" "}
                <span className="font-bold text-white">{totalPages}</span>
              </div>

              {currentPage < totalPages ? (
                <Link
                  href={`/actor/${actorSlug}?page=${currentPage + 1}${currentType ? `&type=${currentType}` : ""}`}
                  className="flex items-center gap-1.5 rounded-xl apple-button-secondary px-4 py-2.5 text-xs font-semibold"
                >
                  Next
                  <ChevronRight className="size-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-muted-foreground/30 cursor-not-allowed">
                  Next
                  <ChevronRight className="size-4" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
