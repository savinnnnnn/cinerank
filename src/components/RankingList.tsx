import Link from "next/link";
import { Star } from "lucide-react";
import { posterUrl } from "@/lib/tmdb";
import { formatScore, medalFor } from "@/lib/utils";

type RankedMovie = {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  averageScore: number;
  ratingsCount: number;
};

export function RankingList({ ranking }: { ranking: RankedMovie[] }) {
  if (ranking.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-base-800 p-10 text-center text-sm text-base-500">
        Avalie um filme para começar seu ranking.
      </div>
    );
  }

  return (
    <ol className="divide-y divide-base-800 overflow-hidden rounded-2xl border border-base-800 bg-base-900">
      {ranking.map((movie, i) => {
        const poster = posterUrl(movie.posterPath, "w342");
        const medal = medalFor(i);
        return (
          <li key={movie.tmdbId}>
            <Link
              href={`/filme/${movie.tmdbId}`}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-base-800/60"
            >
              <span className="w-7 shrink-0 text-center text-sm font-semibold text-base-500">
                {medal ?? i + 1}
              </span>
              <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-base-800">
                {poster && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={poster} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-base-200">{movie.title}</p>
                <p className="text-xs text-base-500">
                  {movie.ratingsCount} avaliação{movie.ratingsCount > 1 ? "ões" : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-gold-400">
                <Star className="h-3.5 w-3.5 fill-gold-400" />
                {formatScore(movie.averageScore)}
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
