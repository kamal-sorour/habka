import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovieById, searchMovies } from "@/features/movies/services/api";
import { WatchPlayerClient } from "./WatchPlayerClient";

interface WatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getMovieById(id, "short");

  if (!result.success) {
    return { title: "Watch Movie — Habka Cinema" };
  }

  return {
    title: `Watch ${result.data.Title} (${result.data.Year}) — Habka Cinema`,
    description: `Stream ${result.data.Title} in full cinematic HD with immersive Apple Vision theater mode.`,
  };
}

export default async function WatchPage({
  params,
  searchParams,
}: WatchPageProps) {
  const { id } = await params;
  const sParams = await searchParams;

  const movieResult = await getMovieById(id, "full");

  if (!movieResult.success) {
    notFound();
  }

  const movie = movieResult.data;

  // Fetch recommendations based on primary genre or search keyword
  const primaryGenre = movie.Genre ? movie.Genre.split(",")[0].trim() : "Action";
  const recommendedResult = await searchMovies(primaryGenre, 1, movie.Type === "series" ? "series" : "movie");

  const recommendations = recommendedResult.success
    ? recommendedResult.data.Search.filter((m) => m.imdbID !== movie.imdbID).slice(0, 6)
    : [];

  return (
    <WatchPlayerClient
      movie={movie}
      recommendations={recommendations}
      initialSeason={parseInt(sParams.season ?? "1", 10) || 1}
      initialEpisode={parseInt(sParams.episode ?? "1", 10) || 1}
    />
  );
}
