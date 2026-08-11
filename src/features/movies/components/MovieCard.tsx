"use client";

import React, { useState, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Film,
  Tv,
  Video,
  ChevronRight,
  Play,
  Star,
  Sparkles,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  useFavoritesStore,
  type FavoriteMovie,
} from "@/store/useFavoritesStore";

// ==========================================
// 1. Types & Interfaces
// ==========================================
interface MovieCardProps {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string | null;
  Type: string;
  index?: number;
}

// ==========================================
// 2. Premium Noise Texture Component
// ==========================================
const GlassNoise = () => (
  <div className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

// ==========================================
// 3. Dynamic Interactive Button Component
// ==========================================
const PremiumFavoriteBtn = ({
  isFavorite,
  onClick,
}: {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      className={`relative z-30 flex size-9 items-center justify-center rounded-full backdrop-blur-2xl transition-all duration-500 overflow-hidden ${
        isFavorite
          ? "bg-red-500/20 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          : "bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20"
      }`}
      aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
    >
      <AnimatePresence>
        {isFavorite && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 bg-gradient-to-tr from-red-500/40 to-orange-500/40 rounded-full"
          />
        )}
      </AnimatePresence>
      <Heart
        className={`relative z-10 size-[18px] transition-all duration-500 ${
          isFavorite
            ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            : "fill-transparent text-white/80"
        }`}
      />
    </motion.button>
  );
};

// ==========================================
// 4. Main Card Component (The Ultimate Glass)
// ==========================================
export function MovieCard({
  imdbID,
  Title,
  Year,
  Poster,
  Type,
  index = 0,
}: MovieCardProps) {
  // Store & States
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(imdbID));
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Refs for 3D Math
  const cardRef = useRef<HTMLAnchorElement>(null);

  // Framer Motion Values for 3D Tilt & Glare
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth springs for fluid Apple-like physics
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  // Map mouse position to rotation degrees (Tilt effect)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Map mouse position to glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  // Handlers
  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ imdbID, Title, Year, Poster, Type } as FavoriteMovie);
  };

  // Helpers
  const hasValidPoster = Poster && Poster !== "N/A" && !imageError;
  const normalizedType = Type.toLowerCase();
  const TypeIcon =
    normalizedType === "series" ? Tv : normalizedType === "episode" ? Video : Film;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: Math.min(index * 0.05, 0.5),
        ease: [0.16, 1, 0.3, 1], // Perfect Spring Easing
      }}
      className="group relative w-full perspective-[1500px]"
      style={{ perspective: "1500px" }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full"
      >
        <Link
          ref={cardRef}
          href={`/movie/${imdbID}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative block h-full w-full overflow-hidden rounded-[32px] bg-white/[0.01] outline-none ring-1 ring-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-[40px] transition-all duration-500 hover:bg-white/[0.03] hover:ring-white/[0.15] hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] will-change-transform"
        >
          {/* ========================================== */}
          {/* BACKGROUND AMBIENT GLOW                      */}
          {/* ========================================== */}
          {hasValidPoster && (
            <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 blur-3xl saturate-200 transition-opacity duration-700 group-hover:opacity-60">
              <Image src={Poster} alt="" fill sizes="200px" className="object-cover" unoptimized />
            </div>
          )}

          {/* Noise Texture for Premium Feel */}
          <GlassNoise />

          {/* ========================================== */}
          {/* DYNAMIC GLARE EFFECT (Tracks Mouse)          */}
          {/* ========================================== */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
            }}
          />

          {/* ========================================== */}
          {/* INNER PADDING WRAPPER (The Apple Shell)      */}
          {/* ========================================== */}
          <div className="relative flex h-full flex-col p-2.5 z-10" style={{ transform: "translateZ(30px)" }}>
            
            {/* ========================================== */}
            {/* POSTER CONTAINER                           */}
            {/* ========================================== */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[24px] bg-black/40 shadow-inner border border-white/5">
              
              {/* Image Loading State & Error Handling */}
              {hasValidPoster ? (
                <div className="relative h-full w-full">
                  <Image
                    src={Poster}
                    alt={`${Title} poster`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.08] group-hover:saturate-[1.1]"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                  
                  {/* Subtle Dark Gradient at bottom for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-white/[0.05] to-black/50 text-white/20">
                  <Film className="size-12 stroke-[1] mb-2" />
                  <span className="text-[10px] uppercase tracking-widest opacity-50 font-medium">No Visuals</span>
                </div>
              )}

              {/* ========================================== */}
              {/* FLOATING HEADER: BADGES & BUTTONS            */}
              {/* ========================================== */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 z-20">
                
                {/* Type Badge */}
                <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-105">
                  <TypeIcon className="size-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold tracking-widest text-white/95 uppercase">
                    {Type}
                  </span>
                </div>

                {/* Favorite Button (Premium Component) */}
                <PremiumFavoriteBtn isFavorite={isFavorite} onClick={handleFavorite} />
              </div>

              {/* ========================================== */}
              {/* HOVER PLAY OVERLAY (Cinematic Feel)          */}
              {/* ========================================== */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex size-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <Play className="size-5 fill-white text-white ml-1" />
                </motion.div>
              </div>
            </div>

            {/* ========================================== */}
            {/* BOTTOM INFO PANEL (Frosted Glass Panel)      */}
            {/* ========================================== */}
            <div 
              className="mt-2.5 flex flex-col justify-between overflow-hidden rounded-[20px] bg-white/[0.03] p-4 backdrop-blur-md border border-white/5 transition-colors duration-500 group-hover:bg-white/[0.06] group-hover:border-white/10"
              style={{ transform: "translateZ(10px)" }}
            >
              {/* Title Section */}
              <div className="flex flex-col gap-1">
                <h3 className="line-clamp-1 text-[16px] font-bold tracking-tight text-white/90 transition-colors group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {Title}
                </h3>
                
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/60">
                    <Star className="size-3 text-amber-500 fill-amber-500" />
                    Pro
                  </span>
                  <span className="text-[13px] font-medium text-white/40">
                    {Year}
                  </span>
                </div>
              </div>

              {/* Decorative Line */}
              <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

              {/* Action Footer */}
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-white/40 transition-colors group-hover:text-amber-400">
                  <Sparkles className="size-3.5" />
                  View Details
                </span>
                
                {/* Arrow pops in on hover */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex size-6 items-center justify-center rounded-full bg-white/10"
                >
                  <ChevronRight className="size-3 text-white" />
                </motion.div>
              </div>
            </div>

          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}