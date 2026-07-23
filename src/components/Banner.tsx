"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play } from "lucide-react";
import { backdropUrl } from "@/lib/tmdb";

type Item = { id: number; title: string; overview: string; backdrop_path: string | null; vote_average: number };

export function Banner({ movies }: { movies: Item[] }) {
  const [index, setIndex] = useState(0);
  const items = movies.slice(0, 5);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[index];
  const backdrop = backdropUrl(current.backdrop_path);

  return (
    <div className="relative h-[52vh] min-h-[380px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {backdrop && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={backdrop} alt="" className="h-full w-full object-cover object-top" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/60 to-base-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-base-950/90 via-base-950/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative flex h-full max-w-6xl flex-col justify-end gap-4 px-6 pb-12 mx-auto">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-500">
          <Play className="h-3.5 w-3.5" /> Em alta esta semana
        </div>
        <motion.h1
          key={`title-${current.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-xl text-3xl font-semibold leading-tight text-base-100 sm:text-4xl"
        >
          {current.title}
        </motion.h1>
        <p className="max-w-lg text-sm text-base-300 line-clamp-2">{current.overview}</p>
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-sm text-gold-400">
            <Star className="h-4 w-4 fill-gold-400" />
            {current.vote_average.toFixed(1)} no TMDb
          </div>
          <Link
            href={`/filme/${current.id}`}
            className="rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-base-950 transition-colors hover:bg-gold-400"
          >
            Ver detalhes
          </Link>
        </div>

        <div className="flex gap-1.5 pt-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all ${i === index ? "w-6 bg-gold-500" : "w-3 bg-base-700"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
