import { prisma } from "@/lib/prisma";
import { getPopularMovies } from "@/lib/tmdb";
import { average } from "@/lib/utils";
import Link from "next/link";
import { Banner } from "@/components/Banner";
import { MovieCard } from "@/components/MovieCard";
import { RankingList } from "@/components/RankingList";
import { Sparkles, TrendingUp } from "lucide-react";

export const revalidate = 0;

async function getRecentlyAdded() {
  const movies = await prisma.movie.findMany({
    include: { ratings: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return movies.map((m) => ({
    tmdbId: m.tmdbId,
    title: m.title,
    year: m.year,
    posterPath: m.posterPath,
    averageScore: average(m.ratings.map((r) => r.score)),
    ratingsCount: m.ratings.length,
  }));
}

async function getRanking() {
  const movies = await prisma.movie.findMany({ include: { ratings: true } });
  return movies
    .filter((m) => m.ratings.length > 0)
    .map((m) => ({
      tmdbId: m.tmdbId,
      title: m.title,
      posterPath: m.posterPath,
      averageScore: average(m.ratings.map((r) => r.score)),
      ratingsCount: m.ratings.length,
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 10);
}

export default async function HomePage() {
  const [popular, recent, ranking] = await Promise.all([
    getPopularMovies().catch(() => []),
    getRecentlyAdded(),
    getRanking(),
  ]);

  return (
    <div>
      <Banner movies={popular} />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <section>
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-500" />
            <h2 className="text-lg font-semibold text-base-100">Adicionados recentemente</h2>
          </div>

          {recent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-base-800 p-10 text-center text-sm text-base-500">
              Nenhum filme por aqui ainda. Busque um filme acima para começar.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {recent.map((m) => (
                <MovieCard key={m.tmdbId} {...m} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold-500" />
            <h2 className="text-lg font-semibold text-base-100">Ranking público</h2>
          </div>
          <p className="mb-5 -mt-3 text-sm text-base-500">
            Média de todas as avaliações, de todos os perfis. Quer ver só as suas? Acesse{" "}
            <Link href="/meu-ranking" className="text-gold-400 hover:underline">
              Meu ranking
            </Link>
            .
          </p>
          <RankingList ranking={ranking} />
        </section>
      </div>
    </div>
  );
}
