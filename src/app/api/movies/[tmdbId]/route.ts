import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMovieDetails } from "@/lib/tmdb";
import { average } from "@/lib/utils";
import { getCurrentUserId } from "@/lib/auth";
import type { MovieWithStats } from "@/types";

// Busca o filme no banco. Se ainda não existir, cria automaticamente
// a partir dos dados da TMDb. A nota média e o total de avaliações são
// públicos (somam todos os usuários); "myRating" é só a do usuário logado.
export async function GET(
  req: NextRequest,
  { params }: { params: { tmdbId: string } }
) {
  const tmdbId = Number(params.tmdbId);
  if (Number.isNaN(tmdbId)) {
    return NextResponse.json({ error: "tmdbId inválido" }, { status: 400 });
  }

  try {
    const userId = await getCurrentUserId();

    let movie = await prisma.movie.findUnique({
      where: { tmdbId },
      include: { ratings: true },
    });

    if (!movie) {
      const details = await getMovieDetails(tmdbId);
      movie = await prisma.movie.create({
        data: { ...details },
        include: { ratings: true },
      });
    }

    const myRatingRecord = userId ? movie.ratings.find((r) => r.userId === userId) ?? null : null;

    const response: MovieWithStats = {
      id: movie.id,
      tmdbId: movie.tmdbId,
      title: movie.title,
      originalTitle: movie.originalTitle,
      year: movie.year,
      overview: movie.overview,
      posterPath: movie.posterPath,
      backdropPath: movie.backdropPath,
      director: movie.director,
      cast: movie.cast,
      genres: movie.genres,
      runtime: movie.runtime,
      trailerKey: movie.trailerKey,
      averageScore: average(movie.ratings.map((r) => r.score)),
      ratingsCount: movie.ratings.length,
      myRating: myRatingRecord
        ? {
            id: myRatingRecord.id,
            score: myRatingRecord.score,
            comment: myRatingRecord.comment,
            createdAt: myRatingRecord.createdAt.toISOString(),
            updatedAt: myRatingRecord.updatedAt.toISOString(),
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
