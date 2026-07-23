import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMovieDetails } from "@/lib/tmdb";
import { average } from "@/lib/utils";
import type { MovieWithStats } from "@/types";

// Busca o filme no banco. Se ainda não existir, cria automaticamente
// a partir dos dados da TMDb (essa é a regra central do produto:
// nada é cadastrado manualmente).
export async function GET(
  req: NextRequest,
  { params }: { params: { tmdbId: string } }
) {
  const tmdbId = Number(params.tmdbId);
  if (Number.isNaN(tmdbId)) {
    return NextResponse.json({ error: "tmdbId inválido" }, { status: 400 });
  }

  try {
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
      // Projeto pessoal, sem login: assume-se a avaliação mais recente como "minha avaliação".
      myRating: movie.ratings[0]
        ? {
            id: movie.ratings[0].id,
            score: movie.ratings[0].score,
            comment: movie.ratings[0].comment,
            createdAt: movie.ratings[0].createdAt.toISOString(),
            updatedAt: movie.ratings[0].updatedAt.toISOString(),
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
