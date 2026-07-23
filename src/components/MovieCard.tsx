import Link from "next/link";
import { Star, Film } from "lucide-react";
import { posterUrl } from "@/lib/tmdb";
import { formatScore, medalFor } from "@/lib/utils";

export function MovieCard({
  tmdbId,
  title,
  year,
  posterPath,
  averageScore,
  ratingsCount,
  position,
}: {
  tmdbId: number;
  title: string;
  year?: number | null;
  posterPath: string | null;
  averageScore?: number;
  ratingsCount?: number;
  position?: number;
}) {
  const poster = posterUrl(posterPath, "w500");
  const medal = position !== undefined ? medalFor(position) : null;

  return (
    <Link
      href={`/filme/${tmdbId}`}
      className="group block overflow-hidden rounded-2xl border border-base-800 bg-base-900 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:border-base-700"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-base-800">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Film className="h-8 w-8 text-base-600" />
          </div>
        )}

        {position !== undefined && (
          <div className="absolute left-2 top-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-base-950/85 px-2 text-sm font-semibold text-gold-400 backdrop-blur-sm">
            {medal ?? `#${position + 1}`}
          </div>
        )}

        {averageScore !== undefined && ratingsCount !== undefined && ratingsCount > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-base-950/85 px-2 py-1 text-xs font-medium text-gold-400 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
            {formatScore(averageScore)}
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-medium text-base-200">{title}</p>
        <div className="mt-0.5 flex items-center justify-between text-xs text-base-500">
          <span>{year ?? "—"}</span>
          {ratingsCount !== undefined && (
            <span>{ratingsCount === 0 ? "sem notas" : `${ratingsCount} avaliação${ratingsCount > 1 ? "ões" : ""}`}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
