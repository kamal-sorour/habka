// ---------------------------------------------------------------------------
// Core API Configuration — OMDb
// ---------------------------------------------------------------------------
// Centralizes base URLs, keys, and default params so every service
// references a single source of truth.
// ---------------------------------------------------------------------------

/**
 * The OMDb API key.
 *
 * Reads from the `OMDB_API_KEY` environment variable at build/runtime.
 * In Next.js, server-only env vars do NOT need the `NEXT_PUBLIC_` prefix
 * because our fetch calls run exclusively on the server (RSC / route handlers).
 */
const OMDB_API_KEY = process.env.OMDB_API_KEY;

if (!OMDB_API_KEY) {
  throw new Error(
    "[api.config] Missing OMDB_API_KEY — add it to your .env.local file.\n" +
      "  Example:  OMDB_API_KEY=your_key_here"
  );
}

export const omdbConfig = {
  /** Base URL for all OMDb requests */
  baseUrl: "https://www.omdbapi.com",

  /** Authenticated API key */
  apiKey: OMDB_API_KEY,

  /**
   * Default `next.revalidate` value (in seconds).
   * OMDb data changes infrequently — 1 hour is a safe default.
   */
  defaultRevalidate: 3600,
} as const;
