"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Film, ListVideo, Heart } from "lucide-react";
import { posterUrl } from "@/lib/tmdb";
import { formatScore } from "@/lib/utils";

type Profile = {
  moviesRated: number;
  averageScoreGiven: number;
  listsCount: number;
  favoriteMovie: { title: string; posterPath: string | null; score: number } | null;
  recentRatings: { movieId: string; tmdbId: number; title: string; posterPath: string | null; score: number }[];
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  if (!profile) return <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-base-500">Carregando...</div>;

  const stats = [
    { icon: Film, label: "Filmes avaliados", value: profile.moviesRated },
    { icon: Star, label: "Nota média dada", value: formatScore(profile.averageScoreGiven) },
    { icon: ListVideo, label: "Listas criadas", value: profile.listsCount },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold text-base-100">Meu perfil</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-base-800 bg-base-900 p-5 shadow-card">
            <s.icon className="h-5 w-5 text-gold-500" />
            <p className="mt-3 text-2xl font-semibold text-base-100">{s.value}</p>
            <p className="text-xs text-base-500">{s.label}</p>
          </div>
        ))}
      </div>

      {profile.favoriteMovie && (
        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-base-800 bg-base-900 p-5 shadow-card">
          <Heart className="h-5 w-5 shrink-0 text-crimson-400" />
          <div className="flex items-center gap-3">
            {posterUrl(profile.favoriteMovie.posterPath, "w342") && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterUrl(profile.favoriteMovie.posterPath, "w342")!}
                alt=""
                className="h-16 w-11 rounded-md object-cover"
              />
            )}
            <div>
              <p className="text-xs text-base-500">Filme favorito</p>
              <p className="font-medium text-base-200">{profile.favoriteMovie.title}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="mb-4 mt-12 text-lg font-semibold text-base-100">Últimos filmes avaliados</h2>
      {profile.recentRatings.length === 0 ? (
        <p className="text-sm text-base-500">Você ainda não avaliou nenhum filme.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {profile.recentRatings.map((r) => (
            <Link
              key={r.movieId}
              href={`/filme/${r.tmdbId}`}
              className="group overflow-hidden rounded-xl border border-base-800 bg-base-900 transition-colors hover:border-base-700"
            >
              <div className="aspect-[2/3] overflow-hidden bg-base-800">
                {posterUrl(r.posterPath, "w342") && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={posterUrl(r.posterPath, "w342")!} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                <span className="truncate text-base-300">{r.title}</span>
                <span className="flex shrink-0 items-center gap-0.5 text-gold-400">
                  <Star className="h-3 w-3 fill-gold-400" /> {r.score.toFixed(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
