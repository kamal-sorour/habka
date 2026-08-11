// ---------------------------------------------------------------------------
// Movie Data-Fetching Service — OMDb API
// ---------------------------------------------------------------------------
// Server-only. Every function:
//   1. Builds the URL from `omdbConfig`.
//   2. Fetches with Next.js `{ next: { revalidate } }` caching.
//   3. Validates the raw JSON through a Zod schema.
//   4. Returns a strongly-typed discriminated result — never raw `any`.
// ---------------------------------------------------------------------------

import { omdbConfig } from "@/core/api.config";
import {
  MovieSearchSuccessSchema,
  MovieDetailSchema,
  OmdbErrorSchema,
  type MovieSearchSuccess,
  type MovieDetail,
} from "@/features/movies/types/schemas";

// ========================= Internal Helpers ============================= //

/**
 * Discriminated result type used by every public function.
 *
 * Components / pages pattern-match on `success` to safely access the data
 * without `try/catch` boilerplate.
 */
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/** Build a full OMDb URL with the API key pre-attached. */
function buildUrl(params: Record<string, string | number>): string {
  const url = new URL(omdbConfig.baseUrl);
  url.searchParams.set("apikey", omdbConfig.apiKey);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/**
 * Low-level fetch wrapper.
 *
 * - Uses the native `fetch` API extended by Next.js.
 * - `next.revalidate` enables ISR-style caching at the data layer.
 * - `next.tags` enable on-demand revalidation via `revalidateTag()`.
 *
 * Returns the raw JSON as `unknown` so the caller can validate with the
 * appropriate Zod schema.
 */
async function rawFetch(
  url: string,
  options?: { revalidate?: number; tags?: string[] }
): Promise<ServiceResult<unknown>> {
  const revalidate = options?.revalidate ?? omdbConfig.defaultRevalidate;

  try {
    const response = await fetch(url, {
      next: {
        revalidate,
        ...(options?.tags ? { tags: options.tags } : {}),
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `OMDb request failed — HTTP ${response.status} ${response.statusText}`,
      };
    }

    const json: unknown = await response.json();
    return { success: true, data: json };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown network error";
    console.error("[movies/api] Fetch error:", message);
    return { success: false, error: message };
  }
}

/**
 * Check if raw JSON is an OMDb error (`{ Response: "False", Error: "..." }`).
 * If so, return a `ServiceResult` error. Otherwise return `null`.
 */
function checkOmdbError(json: unknown): ServiceResult<never> | null {
  const errorParsed = OmdbErrorSchema.safeParse(json);
  if (errorParsed.success) {
    return { success: false, error: errorParsed.data.Error };
  }
  return null;
}

// ========================= Public Functions ============================= //

/**
 * Search movies by keyword.
 *
 * @param query  - Search term (e.g. "batman").
 * @param page   - Page number (OMDb returns 10 results per page).
 * @param type   - Optional filter: "movie" | "series" | "episode".
 * @param year   - Optional release year filter.
 *
 * @example
 * ```ts
 * const result = await searchMovies("inception");
 * if (result.success) {
 *   console.log(result.data.Search); // MovieSearchItem[]
 * }
 * ```
 */
export async function searchMovies(
  query: string,
  page: number = 1,
  type?: "movie" | "series" | "episode",
  year?: string
): Promise<ServiceResult<MovieSearchSuccess>> {
  const params: Record<string, string | number> = { s: query, page };
  if (type) params.type = type;
  if (year) params.y = year;

  const url = buildUrl(params);
  const fetchResult = await rawFetch(url, {
    tags: ["movies", `search-${query}`],
  });

  if (!fetchResult.success) return fetchResult;

  // Check for OMDb-level error first
  const omdbError = checkOmdbError(fetchResult.data);
  if (omdbError) return omdbError;

  // Validate against the success schema
  const parsed = MovieSearchSuccessSchema.safeParse(fetchResult.data);
  if (!parsed.success) {
    console.error("[movies/api] Zod validation failed:", parsed.error);
    return {
      success: false,
      error: "Unexpected response shape from OMDb — validation failed.",
    };
  }

  return { success: true, data: parsed.data };
}

/**
 * Fetch full details for a single movie by its IMDb ID.
 *
 * @param imdbId - e.g. "tt1375666"
 * @param plot   - "short" (default) or "full"
 *
 * @example
 * ```ts
 * const result = await getMovieById("tt1375666");
 * if (result.success) {
 *   console.log(result.data.Title); // "Inception"
 * }
 * ```
 */
export async function getMovieById(
  imdbId: string,
  plot: "short" | "full" = "short"
): Promise<ServiceResult<MovieDetail>> {
  const url = buildUrl({ i: imdbId, plot });
  const fetchResult = await rawFetch(url, {
    // Movie details rarely change — cache for 24 hours.
    revalidate: 86_400,
    tags: ["movies", `movie-${imdbId}`],
  });

  if (!fetchResult.success) return fetchResult;

  const omdbError = checkOmdbError(fetchResult.data);
  if (omdbError) return omdbError;

  const parsed = MovieDetailSchema.safeParse(fetchResult.data);
  if (!parsed.success) {
    console.error("[movies/api] Zod validation failed:", parsed.error);
    return {
      success: false,
      error: "Unexpected response shape from OMDb — validation failed.",
    };
  }

  return { success: true, data: parsed.data };
}

/**
 * Fetch full details for a single movie by its exact title.
 *
 * @param title - Exact movie title (e.g. "Inception")
 * @param year  - Optional release year to disambiguate.
 * @param plot  - "short" (default) or "full"
 *
 * @example
 * ```ts
 * const result = await getMovieByTitle("Inception", "2010");
 * if (result.success) {
 *   console.log(result.data.imdbID); // "tt1375666"
 * }
 * ```
 */
export async function getMovieByTitle(
  title: string,
  year?: string,
  plot: "short" | "full" = "short"
): Promise<ServiceResult<MovieDetail>> {
  const params: Record<string, string | number> = { t: title, plot };
  if (year) params.y = year;

  const url = buildUrl(params);
  const fetchResult = await rawFetch(url, {
    revalidate: 86_400,
    tags: ["movies", `movie-title-${title}`],
  });

  if (!fetchResult.success) return fetchResult;

  const omdbError = checkOmdbError(fetchResult.data);
  if (omdbError) return omdbError;

  const parsed = MovieDetailSchema.safeParse(fetchResult.data);
  if (!parsed.success) {
    console.error("[movies/api] Zod validation failed:", parsed.error);
    return {
      success: false,
      error: "Unexpected response shape from OMDb — validation failed.",
    };
  }

  return { success: true, data: parsed.data };
}
