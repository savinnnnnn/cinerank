import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { average } from "@/lib/utils";

// Ranking geral: recalculado a cada chamada a partir das notas atuais,
// então nunca fica desatualizado — não existe estado de ranking salvo.
export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: { ratings: true },
    });

    const ranked = movies
      .filter((m) => m.ratings.length > 0)
      .map((m) => ({
        id: m.id,
        tmdbId: m.tmdbId,
        title: m.title,
        posterPath: m.posterPath,
        averageScore: average(m.ratings.map((r) => r.score)),
        ratingsCount: m.ratings.length,
      }))
      .sort((a, b) => b.averageScore - a.averageScore);

    return NextResponse.json({ ranking: ranked });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
