import Link from "next/link";
import Image from "next/image";
import { Sparkles, Users, Award, Film, ArrowRight } from "lucide-react";
import { FEATURED_ACTORS } from "@/core/actors.config";

export const metadata = {
  title: "Celebrity & Director Filmographies — Habka Cinema",
  description:
    "Explore the complete works of top Hollywood actors and visionary directors in Apple-grade cinematic glass.",
};

export default function ActorsDirectoryPage() {
  return (
    <div className="relative min-h-screen pb-24">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 ambient-glow opacity-80" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="text-center space-y-4 pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-4 py-1 text-xs font-semibold text-amber backdrop-blur-xl">
            <Users className="size-3.5" />
            <span>Star Gallery & Filmographies</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Legendary <span className="amber-gradient-text">Actors & Directors</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground">
            Explore dedicated portfolios, blockbusters, and complete filmographies of your favorite cinema icons.
          </p>
        </div>

        {/* Actor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_ACTORS.map((actor) => (
            <Link
              key={actor.slug}
              href={`/actor/${actor.slug}`}
              className="group relative overflow-hidden rounded-3xl apple-glass-card p-5 transition-all duration-300 hover:-translate-y-2 hover:border-amber/30"
            >
              {/* Avatar */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-lg">
                <Image
                  src={actor.avatar}
                  alt={actor.name}
                  fill
                  sizes="300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Role Pill */}
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md border border-white/10">
                  {actor.role}
                </span>
              </div>

              {/* Info */}
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-amber transition-colors">
                  {actor.name}
                </h3>

                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {actor.bio}
                </p>

                {/* Notable Works */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {actor.notableWorks.slice(0, 2).map((w) => (
                    <span
                      key={w}
                      className="rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/70"
                    >
                      {w}
                    </span>
                  ))}
                </div>

                <div className="pt-3 flex items-center justify-between text-xs font-semibold text-amber">
                  <span>View All Works</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
