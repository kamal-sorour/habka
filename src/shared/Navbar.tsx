"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Sparkles, Clapperboard, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavoritesStore } from "@/store/useFavoritesStore";

export function Navbar() {
  const pathname = usePathname();
  const favoritesCount = useFavoritesStore((s) => s.favorites.length);

  const links = [
    { href: "/", label: "Discover", icon: Sparkles },
    { href: "/actors", label: "Stars", icon: Users },
    { href: "/favorites", label: "Favorites", icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#060709]/75 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/25 transition-transform duration-300 group-hover:scale-105">
            <Clapperboard className="size-5" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center">
            hab<span className="text-amber">ka</span>
            <span className="ml-2 rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber">
              Cinema
            </span>
          </span>
        </Link>

        {/* ── Apple-style Floating Nav Pills ── */}
        <nav className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] p-1 shadow-inner backdrop-blur-xl">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href === "/actors" && pathname.startsWith("/actor"));
            const isFav = href === "/favorites";

            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="apple-nav-active"
                    className="absolute inset-0 rounded-full bg-white/[0.12] border border-white/[0.15] shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon
                    className={`size-3.5 ${
                      isActive ? "text-amber" : "text-muted-foreground"
                    }`}
                  />
                  <span>{label}</span>

                  {isFav && favoritesCount > 0 && (
                    <AnimatePresence>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-[9px] font-bold text-white shadow-sm"
                      >
                        {favoritesCount > 99 ? "99+" : favoritesCount}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}