// Camada de acesso à API do TMDb.
// Toda chamada externa passa por aqui — se um dia trocar de provedor de dados,
// só este arquivo muda.

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

function apiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY não configurada. Crie um arquivo .env com sua chave (veja .env.example)."
    );
  }
  return key;
}

async function tmdbFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("language", "pt-BR");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 12 } });
  if (!res.ok) {
    throw new Error(`Erro TMDb (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export function posterUrl(path: string | null | undefined, size: "w342" | "w500" | "w780" = "w500") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null | undefined, size: "w780" | "w1280" = "w1280") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export type TmdbSearchResult = {
  id: number;
  title: string;
  release_date?: string;
  poster_path: string | null;
};

export async function searchMovies(query: string): Promise<TmdbSearchResult[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch("/search/movie", { query, include_adult: "false" });
  return (data.results ?? []).slice(0, 8);
}

export async function getPopularMovies() {
  const data = await tmdbFetch("/movie/popular");
  return data.results ?? [];
}

export async function getMovieDetails(tmdbId: number) {
  const [details, credits, videos] = await Promise.all([
    tmdbFetch(`/movie/${tmdbId}`),
    tmdbFetch(`/movie/${tmdbId}/credits`),
    tmdbFetch(`/movie/${tmdbId}/videos`),
  ]);

  const director = (credits.crew ?? []).find((c: any) => c.job === "Director")?.name ?? null;
  const cast = (credits.cast ?? []).slice(0, 8).map((c: any) => c.name);
  const trailer = (videos.results ?? []).find(
    (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  return {
    tmdbId,
    title: details.title,
    originalTitle: details.original_title,
    year: details.release_date ? Number(details.release_date.slice(0, 4)) : null,
    overview: details.overview || "Sinopse não disponível.",
    posterPath: details.poster_path,
    backdropPath: details.backdrop_path,
    director,
    cast,
    genres: (details.genres ?? []).map((g: any) => g.name),
    runtime: details.runtime ?? null,
    trailerKey: trailer?.key ?? null,
  };
}
