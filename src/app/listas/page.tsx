"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ListVideo, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type List = { id: string; name: string; items: { movie: { posterPath: string | null } }[] };

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/lists")
      .then((r) => r.json())
      .then((data) => setLists(data.lists ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function createList(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      toast.success("Lista criada!");
      setName("");
      load();
    } catch {
      toast.error("Não foi possível criar a lista.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center gap-2">
        <ListVideo className="h-5 w-5 text-gold-500" />
        <h1 className="text-2xl font-semibold text-base-100">Minhas listas</h1>
      </div>

      <form onSubmit={createList} className="mb-10 flex max-w-md gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da nova lista (ex.: Terror)"
          className="flex-1 rounded-full border border-base-700 bg-base-900 px-4 py-2 text-sm text-base-200 placeholder:text-base-500 focus:border-gold-600/60"
        />
        <button
          disabled={creating}
          className="flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-base-950 hover:bg-gold-400 disabled:opacity-60"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Criar
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-base-500">Carregando...</p>
      ) : lists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-800 p-10 text-center text-sm text-base-500">
          Você ainda não criou nenhuma lista.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {lists.map((list) => (
            <Link
              key={list.id}
              href={`/listas/${list.id}`}
              className="rounded-2xl border border-base-800 bg-base-900 p-5 shadow-card transition-colors hover:border-base-700"
            >
              <p className="font-medium text-base-200">{list.name}</p>
              <p className="mt-1 text-xs text-base-500">
                {list.items.length} filme{list.items.length !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
