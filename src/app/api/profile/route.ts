import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { average } from "@/lib/utils";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Faça login." }, { status: 401 });

    const [ratings, listsCount] = await Promise.all([
      prisma.rating.findMany({
        where: { userId },
        include: { movie: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.movieList.count({ where: { userId } }),
    ]);

    const favorite = [...ratings].sort((a, b) => b.score - a.score)[0] ?? null;

    return NextResponse.json({
      moviesRated: ratings.length,
      averageScoreGiven: average(ratings.map((r) => r.score)),
      recentRatings: ratings.slice(0, 6).map((r) => ({
        movieId: r.movie.id,
        tmdbId: r.movie.tmdbId,
        title: r.movie.title,
        posterPath: r.movie.posterPath,
        score: r.score,
        createdAt: r.createdAt,
      })),
      favoriteMovie: favorite
        ? { title: favorite.movie.title, posterPath: favorite.movie.posterPath, score: favorite.score }
        : null,
      listsCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
