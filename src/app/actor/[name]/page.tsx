import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { searchMovies } from "@/features/movies/services/api";
import { getActorBySlug, FEATURED_ACTORS } from "@/core/actors.config";
import { ActorClient } from "./ActorClient";

interface ActorPageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string; type?: "movie" | "series" | "episode" }>;
}

export async function generateMetadata({
  params,
}: ActorPageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).replace(/-/g, " ");
  const actor = getActorBySlug(name);
  const displayName = actor ? actor.name : decodedName;

  return {
    title: `${displayName} — Complete Filmography & Works | Habka Cinema`,
    description: `Explore all movies, series, and cinematic roles by ${displayName} in stunning Apple Vision glass interface.`,
  };
}

export default async function ActorPage({
  params,
  searchParams,
}: ActorPageProps) {
  const { name } = await params;
  const sParams = await searchParams;

  const page = Math.max(1, parseInt(sParams.page ?? "1", 10) || 1);
  const type = sParams.type;

  // Format actor name for search query
  const actor = getActorBySlug(name);
  const decodedRaw = decodeURIComponent(name).replace(/-/g, " ");
  const displayName = actor ? actor.name : decodedRaw;

  // Fetch actor filmography from OMDb search
  const result = await searchMovies(displayName, page, type);

  const movies = result.success ? result.data.Search : [];
  const totalResults = result.success ? parseInt(result.data.totalResults, 10) : 0;
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <ActorClient
      actorSlug={name}
      actorName={displayName}
      actorProfile={actor}
      movies={movies}
      totalResults={totalResults}
      currentPage={page}
      totalPages={totalPages}
      currentType={type}
      featuredStars={FEATURED_ACTORS}
    />
  );
}
