import { Suspense } from "react";
import { SearchBar } from "@/shared/SearchBar";
import { searchMovies, getMovieById } from "@/features/movies/services/api";
import { MovieGrid } from "@/features/movies/components/MovieGrid";
import { ChevronLeft, ChevronRight, Sparkles, Film, Flame, Star, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Habka Cinema — Discover Cinematic Masterpieces",
  description:
    "Explore thousands of movies, TV series, and cinematic gems in stunning clarity. Powered by OMDb.",
};

interface HomePageProps {
  searchParams: Promise<{ q?: string; page?: string; type?: "movie" | "series" | "episode" }>;
}

/** Featured Hero Spotlight for Default Landing View */
async function FeaturedSpotlight() {
  // Fetch a timeless classic for the Apple-style hero spotlight
  const spotlightMovie = await getMovieById("tt1375666", "short"); // Inception

  if (!spotlightMovie.success) return null;
  const m = spotlightMovie.data;

  return (
    <div className="relative mb-16 overflow-hidden rounded-3xl apple-glass border border-white/10 shadow-2xl">
      {/* Background Poster Ambience */}
      {m.Poster && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={m.Poster}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25 blur-3xl scale-125"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060709] via-[#060709]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent" />
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-8 p-6 sm:p-10">
        {/* Left Info */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold text-amber backdrop-blur-md">
            <Flame className="size-3.5" />
            <span>Featured Spotlight</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {m.Title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold text-white/90">{m.Year}</span>
            <span className="text-white/20">•</span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-medium text-white/80">
              {m.Rated}
            </span>
            <span className="text-white/20">•</span>
            <span>{m.Runtime}</span>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1 text-amber">
              <Star className="size-3.5 fill-amber" />
              <span className="font-bold">{m.imdbRating}</span>
            </div>
          </div>

          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground/90 line-clamp-3">
            {m.Plot}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/movie/${m.imdbID}`}
              className="inline-flex items-center gap-2 rounded-xl apple-button-primary px-5 py-2.5 text-xs font-bold"
            >
              <Play className="size-3.5 fill-black" />
              View Details
            </Link>
          </div>
        </div>

        {/* Right Poster */}
        {m.Poster && (
          <div className="relative w-44 sm:w-52 aspect-[2/3] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <Image
              src={m.Poster}
              alt={m.Title}
              fill
              sizes="220px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}

/** Curated Section for Default View */
async function DefaultTrendingSection() {
  const result = await searchMovies("Avengers", 1, "movie");
  if (!result.success) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber" />
          <h2 className="text-lg font-bold tracking-tight text-white">
            Trending Blockbusters
          </h2>
        </div>
      </div>
      <MovieGrid movies={result.data.Search} />
    </div>
  );
}

async function SearchResults({
  query,
  page,
  type,
}: {
  query: string;
  page: number;
  type?: "movie" | "series" | "episode";
}) {
  const result = await searchMovies(query, page, type);

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 max-w-md">
          <p className="text-sm font-medium text-muted-foreground">{result.error}</p>
        </div>
      </div>
    );
  }

  const totalResults = parseInt(result.data.totalResults, 10);
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/70">
            Search Results
          </p>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Found <span className="text-amber">{totalResults.toLocaleString()}</span> titles for &ldquo;{query}&rdquo;
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs font-semibold backdrop-blur-md">
          <Link
            href={`/?q=${encodeURIComponent(query)}&page=1`}
            className={`rounded-full px-3 py-1 transition-colors ${
              !type ? "bg-amber text-black font-bold" : "text-muted-foreground hover:text-white"
            }`}
          >
            All
          </Link>
          <Link
            href={`/?q=${encodeURIComponent(query)}&page=1&type=movie`}
            className={`rounded-full px-3 py-1 transition-colors ${
              type === "movie" ? "bg-amber text-black font-bold" : "text-muted-foreground hover:text-white"
            }`}
          >
            Movies
          </Link>
          <Link
            href={`/?q=${encodeURIComponent(query)}&page=1&type=series`}
            className={`rounded-full px-3 py-1 transition-colors ${
              type === "series" ? "bg-amber text-black font-bold" : "text-muted-foreground hover:text-white"
            }`}
          >
            Series
          </Link>
        </div>
      </div>

      {/* Grid */}
      <MovieGrid movies={result.data.Search} />

      {/* Apple-style Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          {page > 1 ? (
            <Link
              href={`/?q=${encodeURIComponent(query)}&page=${page - 1}${type ? `&type=${type}` : ""}`}
              id="pagination-prev"
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
            Page <span className="font-bold text-white">{page}</span> of{" "}
            <span className="font-bold text-white">{totalPages}</span>
          </div>

          {page < totalPages ? (
            <Link
              href={`/?q=${encodeURIComponent(query)}&page=${page + 1}${type ? `&type=${type}` : ""}`}
              id="pagination-next"
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
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const type = params.type;

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 ambient-glow opacity-80" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 pt-8">
        {/* ── Apple-style Hero Banner ── */}
        <section className="flex flex-col items-center gap-5 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.03] px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl">
            <span className="flex size-2 rounded-full bg-amber animate-pulse" />
            <span>Discover Cinema In Breathtaking Depth</span>
          </div>

          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The Ultimate{" "}
            <span className="amber-gradient-text">Movie Experience</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Search through millions of films, TV series, and behind-the-scenes data with high-speed performance and cinematic aesthetics.
          </p>

          {/* Search Bar */}
          <div className="w-full pt-2">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        </section>

        {/* ── Content Section ── */}
        <section className="pt-2">
          {query ? (
            <Suspense
              key={`${query}-${page}-${type}`}
              fallback={
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[280px] animate-pulse rounded-2xl border border-white/5 bg-white/[0.03]"
                    />
                  ))}
                </div>
              }
            >
              <SearchResults query={query} page={page} type={type} />
            </Suspense>
          ) : (
            <div className="space-y-12">
              <Suspense fallback={null}>
                <FeaturedSpotlight />
              </Suspense>
              <Suspense fallback={null}>
                <DefaultTrendingSection />
              </Suspense>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
