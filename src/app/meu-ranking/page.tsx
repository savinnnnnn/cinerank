import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { RankingList } from "@/components/RankingList";
import { Trophy } from "lucide-react";

export const revalidate = 0;

export default async function MyRankingPage() {
  const userId = await getCurrentUserId();

  const ratings = userId
    ? await prisma.rating.findMany({
        where: { userId },
        include: { movie: true },
        orderBy: { score: "desc" },
      })
    : [];

  const ranking = ratings.map((r) => ({
    tmdbId: r.movie.tmdbId,
    title: r.movie.title,
    posterPath: r.movie.posterPath,
    averageScore: r.score,
    ratingsCount: 1,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-2 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-gold-500" />
        <h1 className="text-2xl font-semibold text-base-100">Meu ranking</h1>
      </div>
      <p className="mb-8 text-sm text-base-500">
        Só os filmes que você avaliou, ordenados pela sua própria nota — diferente
        do ranking público da home, que mistura as avaliações de todo mundo.
      </p>

      <RankingList ranking={ranking} />
    </div>
  );
}
