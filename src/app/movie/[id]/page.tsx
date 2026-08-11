import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovieById } from "@/features/movies/services/api";
import { MovieDetailClient } from "./MovieDetailClient";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getMovieById(id, "short");

  if (!result.success) {
    return { title: "Movie Not Found" };
  }

  return {
    title: result.data.Title,
    description: result.data.Plot ?? `Details for ${result.data.Title}`,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const result = await getMovieById(id, "full");

  if (!result.success) {
    notFound();
  }

  return <MovieDetailClient movie={result.data} />;
}
