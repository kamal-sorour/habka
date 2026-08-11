"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const POPULAR_SUGGESTIONS = [
  "Inception",
  "Oppenheimer",
  "The Dark Knight",
  "Interstellar",
  "Stranger Things",
  "Breaking Bad",
];

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  // Keyboard shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const pushSearch = useCallback(
    (value: string) => {
      startTransition(() => {
        const trimmed = value.trim();
        router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}&page=1` : "/");
      });
    },
    [router]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushSearch(value), 450);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    pushSearch(suggestion);
  };

  const handleClear = () => {
    setQuery("");
    pushSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* ── Apple Spotlight Frosted Search Bar ── */}
      <div className="relative group">
        {/* Soft Ambient Halo */}
        <motion.div
          animate={{
            opacity: isFocused ? 0.25 : 0.08,
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber to-orange-500 blur-xl pointer-events-none"
        />

        <div
          className={`relative flex items-center w-full rounded-2xl bg-white/[0.04] backdrop-blur-2xl border transition-all duration-300 shadow-2xl ${
            isFocused
              ? "border-amber/40 bg-white/[0.07] ring-2 ring-amber/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
              : "border-white/[0.09] hover:border-white/[0.18]"
          }`}
        >
          {/* Search Icon */}
          <div className="pl-4.5 pr-2 text-muted-foreground transition-colors group-focus-within:text-amber">
            <Search className="size-5 stroke-[1.8]" />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search movies, TV series, actors..."
            autoComplete="off"
            className="w-full bg-transparent py-4 text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground/50 outline-none"
          />

          {/* Controls Right */}
          <div className="pr-3.5 flex items-center gap-2">
            {isPending && (
              <Loader2 className="size-4.5 animate-spin text-amber" />
            )}

            <AnimatePresence>
              {query && !isPending && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={handleClear}
                  className="rounded-full bg-white/10 p-1.5 text-muted-foreground hover:text-white hover:bg-white/20 transition-all"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Apple Shortcut Pill (Cmd+K) */}
            {!query && (
              <div className="hidden sm:flex items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70">
                <Command className="size-2.5" />
                <span>K</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Suggestions Pills ── */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mr-1">
          Trending:
        </span>
        {POPULAR_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-foreground/80 backdrop-blur-md transition-all hover:border-amber/30 hover:bg-amber/10 hover:text-amber"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}