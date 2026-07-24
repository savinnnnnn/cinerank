import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMovieDetails, posterUrl, backdropUrl } from "@/lib/tmdb";
import { average } from "@/lib/utils";
import { getCurrentUserId } from "@/lib/auth";
import { RatingForm } from "@/components/RatingForm";
import { AddToList } from "@/components/AddToList";
import { Star, Clock, Calendar, Film } from "lucide-react";

export const revalidate = 0;

async function getOrCreateMovie(tmdbId: number) {
  let movie = await prisma.movie.findUnique({
    where: { tmdbId },
    include: { ratings: { orderBy: { createdAt: "desc" } } },
  });

  if (!movie) {
    const details = await getMovieDetails(tmdbId);
    movie = await prisma.movie.create({
      data: { ...details },
      include: { ratings: true },
    });
  }

  return movie;
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const tmdbId = Number(params.id);
  if (Number.isNaN(tmdbId)) notFound();

  const movie = await getOrCreateMovie(tmdbId);
  const userId = await getCurrentUserId();
  const avg = average(movie.ratings.map((r) => r.score));
  const poster = posterUrl(movie.posterPath, "w500");
  const backdrop = backdropUrl(movie.backdropPath);
  const myRating = movie.ratings.find((r) => r.userId === userId) ?? null;

  return (
    <div>
      <div className="relative h-[38vh] min-h-[280px] w-full overflow-hidden">
        {backdrop && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={backdrop} alt="" className="h-full w-full object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/70 to-base-950/30" />
      </div>

      <div className="mx-auto -mt-32 max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
          <div className="mx-auto w-48 shrink-0 overflow-hidden rounded-2xl border border-base-800 shadow-card md:mx-0 md:w-full">
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt={movie.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center bg-base-800">
                <Film className="h-8 w-8 text-base-600" />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-base-100 sm:text-4xl">{movie.title}</h1>
            {movie.originalTitle !== movie.title && (
              <p className="mt-1 text-sm text-base-500">Título original: {movie.originalTitle}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-base-400">
              {movie.year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {movie.year}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {movie.runtime} min
                </span>
              )}
              {movie.ratings.length > 0 && (
                <span className="flex items-center gap-1.5 font-medium text-gold-400">
                  <Star className="h-4 w-4 fill-gold-400" /> {avg.toFixed(1)} público · {movie.ratings.length} avaliação
                  {movie.ratings.length > 1 ? "ões" : ""}
                </span>
              )}
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span key={g} className="rounded-full border border-base-700 px-3 py-1 text-xs text-base-300">
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-base-300">{movie.overview}</p>

            <div className="mt-6 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              {movie.director && (
                <p>
                  <span className="text-base-500">Diretor: </span>
                  <span className="text-base-200">{movie.director}</span>
                </p>
              )}
              {movie.cast.length > 0 && (
                <p className="sm:col-span-2">
                  <span className="text-base-500">Elenco: </span>
                  <span className="text-base-200">{movie.cast.join(", ")}</span>
                </p>
              )}
            </div>

            {movie.trailerKey && (
              <div className="mt-8 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-base-800">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${movie.trailerKey}`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="mt-6">
              <AddToList movieId={movie.id} />
            </div>

            <div className="mt-8 max-w-md">
              <RatingForm
                movieId={movie.id}
                existing={
                  myRating
                    ? {
                        id: myRating.id,
                        score: myRating.score,
                        comment: myRating.comment,
                        createdAt: myRating.createdAt.toISOString(),
                        updatedAt: myRating.updatedAt.toISOString(),
                      }
                    : null
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
