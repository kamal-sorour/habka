// ---------------------------------------------------------------------------
// Zod Schemas & TypeScript Types — OMDb Movie Data
// ---------------------------------------------------------------------------
// Every shape that crosses the network boundary is validated here.
// Components never touch raw JSON — they consume the inferred types below.
// ---------------------------------------------------------------------------

import { z } from "zod";

// ========================== Shared / Reusable =========================== //

/** A single rating entry (e.g. "Rotten Tomatoes" → "85%"). */
export const RatingSchema = z.object({
  Source: z.string(),
  Value: z.string(),
});

/** The three content types OMDb can return. */
export const MediaTypeSchema = z.string();

// ======================== Search Results (`s=`) ========================= //

/**
 * One item inside the `Search` array returned by `?s=...`.
 *
 * OMDb returns "N/A" for missing posters, so we normalise that to `null`
 * via `.transform()` for cleaner UI handling.
 */
export const MovieSearchItemSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: MediaTypeSchema,
  Poster: z.string(),
});

/** Successful search response (`Response === "True"`). */
export const MovieSearchSuccessSchema = z.object({
  Search: z.array(MovieSearchItemSchema),
  totalResults: z.string(),
  Response: z.literal("True"),
});

// ======================= Single Movie (`i=`/`t=`) ======================= //

/**
 * Full movie details returned by `?i=...` or `?t=...`.
 *
 * Fields that OMDb may omit or set to "N/A" are marked `.optional()` or use
 * a transform to normalize "N/A" → `null`.
 */
export const MovieDetailSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  Rated: z.string().optional(),
  Released: z.string().optional(),
  Runtime: z.string().optional(),
  Genre: z.string().optional(),
  Director: z.string().optional(),
  Writer: z.string().optional(),
  Actors: z.string().optional(),
  Plot: z.string().optional(),
  Language: z.string().optional(),
  Country: z.string().optional(),
  Awards: z.string().optional(),
  Poster: z
    .string()
    .transform((val) => (val === "N/A" ? null : val)),
  Ratings: z.array(RatingSchema).optional(),
  Metascore: z.string().optional(),
  imdbRating: z.string().optional(),
  imdbVotes: z.string().optional(),
  imdbID: z.string(),
  Type: MediaTypeSchema,
  DVD: z.string().optional(),
  BoxOffice: z.string().optional(),
  Production: z.string().optional(),
  Website: z.string().optional(),
  Response: z.literal("True"),
});

// ============================== Errors ================================== //

/** Shape returned by OMDb when a request fails (e.g. movie not found). */
export const OmdbErrorSchema = z.object({
  Response: z.literal("False"),
  Error: z.string(),
});

// ===================== Discriminated Union Schemas ====================== //

/**
 * The raw OMDb payload is always one of two shapes:
 *   • `{ Response: "True",  ... }` — success
 *   • `{ Response: "False", Error: "..." }` — failure
 *
 * We use `z.union` so `safeParse` handles both cases in a single pass.
 */
export const SearchResponseSchema = z.union([
  MovieSearchSuccessSchema,
  OmdbErrorSchema,
]);

export const DetailResponseSchema = z.union([
  MovieDetailSchema,
  OmdbErrorSchema,
]);

// ======================== Inferred TS Types ============================= //
// Zod 4 uses `z.$output` / `z.$input` symbols for type inference.
// ---------------------------------------------------------------------------

export type Rating = z.output<typeof RatingSchema>;
export type MediaType = z.output<typeof MediaTypeSchema>;
export type MovieSearchItem = z.output<typeof MovieSearchItemSchema>;
export type MovieSearchSuccess = z.output<typeof MovieSearchSuccessSchema>;
export type MovieDetail = z.output<typeof MovieDetailSchema>;
export type OmdbError = z.output<typeof OmdbErrorSchema>;
export type SearchResponse = z.output<typeof SearchResponseSchema>;
export type DetailResponse = z.output<typeof DetailResponseSchema>;
