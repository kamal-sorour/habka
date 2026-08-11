import { Clapperboard, Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060709]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber text-black font-bold">
            <Clapperboard className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            hab<span className="text-amber">ka</span>
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              — Next-Gen Cinema Experience
            </span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Powered by{" "}
            <a
              href="https://www.omdbapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/80 underline underline-offset-4 hover:text-amber transition-colors"
            >
              OMDb Open API
            </a>
          </span>
          <span className="text-white/20">•</span>
          <span>Ultra-High Performance Next.js 16</span>
        </div>
      </div>
    </footer>
  );
}
