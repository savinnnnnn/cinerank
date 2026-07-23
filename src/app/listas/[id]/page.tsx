"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";

type ListItem = { movie: { id: string; tmdbId: number; title: string; year: number | null; posterPath: string | null } };
type List = { id: string; name: string; items: ListItem[] };

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/lists")
      .then((r) => r.json())
      .then((data) => setList((data.lists ?? []).find((l: List) => l.id === id) ?? null))
      .finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  async function removeMovie(movieId: string) {
    try {
      const res = await fetch(`/api/lists/${id}?movieId=${movieId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Filme removido da lista.");
      load();
    } catch {
      toast.error("Não foi possível remover o filme.");
    }
  }

  async function deleteList() {
    if (!confirm("Excluir esta lista inteira?")) return;
    try {
      const res = await fetch(`/api/lists/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Lista excluída.");
      router.push("/listas");
    } catch {
      toast.error("Não foi possível excluir a lista.");
    }
  }

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-base-500">Carregando...</div>;
  if (!list) return <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-base-500">Lista não encontrada.</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/listas" className="mb-6 flex items-center gap-1.5 text-sm text-base-400 hover:text-base-200">
        <ArrowLeft className="h-4 w-4" /> Minhas listas
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-base-100">{list.name}</h1>
        <button
          onClick={deleteList}
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-crimson-400 hover:bg-base-800"
        >
          <Trash2 className="h-4 w-4" /> Excluir lista
        </button>
      </div>

      <p className="mb-3 text-sm text-base-500">
        Busque um filme acima e, na página dele, adicione à lista pela API — ou use a busca abaixo para navegar até um filme.
      </p>
      <div className="mb-10 max-w-md">
        <SearchBar />
      </div>

      {list.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-800 p-10 text-center text-sm text-base-500">
          Essa lista ainda não tem filmes.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {list.items.map(({ movie }) => (
            <div key={movie.id} className="relative">
              <MovieCard tmdbId={movie.tmdbId} title={movie.title} year={movie.year} posterPath={movie.posterPath} />
              <button
                onClick={() => removeMovie(movie.id)}
                className="absolute right-2 top-2 rounded-full bg-base-950/85 p-1.5 text-base-300 backdrop-blur-sm hover:text-crimson-400"
                aria-label="Remover da lista"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
