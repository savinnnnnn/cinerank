"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Film, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { posterUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

type Result = { id: number; title: string; release_date?: string; poster_path: string | null };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 350);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setResults(data.results ?? []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  function goToMovie(id: number) {
    setOpen(false);
    setQuery("");
    router.push(`/filme/${id}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-500" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar um filme..."
          className="w-full rounded-full border border-base-700 bg-base-900/80 py-2.5 pl-10 pr-9 text-sm text-base-200 placeholder:text-base-500 transition-colors focus:border-gold-600/60"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-base-500" />
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-base-700 bg-base-900 shadow-card animate-fade-up">
          {results.length === 0 && !loading && (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-base-500">
              <Film className="h-4 w-4" /> Nenhum filme encontrado.
            </div>
          )}
          <ul className="max-h-96 overflow-y-auto">
            {results.map((r) => {
              const poster = posterUrl(r.poster_path, "w342");
              const year = r.release_date ? r.release_date.slice(0, 4) : "—";
              return (
                <li key={r.id}>
                  <button
                    onClick={() => goToMovie(r.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-base-800"
                    )}
                  >
                    <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-base-800">
                      {poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={poster} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Film className="h-4 w-4 text-base-600" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-base-200">{r.title}</p>
                      <p className="text-xs text-base-500">{year}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
