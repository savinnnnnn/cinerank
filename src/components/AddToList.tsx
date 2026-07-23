"use client";

import { useEffect, useState } from "react";
import { ListPlus, Check } from "lucide-react";
import toast from "react-hot-toast";

type List = { id: string; name: string; items: { movie: { id: string } }[] };

export function AddToList({ movieId }: { movieId: string }) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/lists")
      .then((r) => r.json())
      .then((data) => setLists(data.lists ?? []));
  }, [open]);

  async function toggle(listId: string, inList: boolean) {
    try {
      const res = await fetch(`/api/lists/${listId}${inList ? `?movieId=${movieId}` : ""}`, {
        method: inList ? "DELETE" : "POST",
        headers: inList ? undefined : { "Content-Type": "application/json" },
        body: inList ? undefined : JSON.stringify({ movieId }),
      });
      if (!res.ok) throw new Error();
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: inList
                  ? l.items.filter((i) => i.movie.id !== movieId)
                  : [...l.items, { movie: { id: movieId } }],
              }
            : l
        )
      );
    } catch {
      toast.error("Não foi possível atualizar a lista.");
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-base-700 px-3 py-1.5 text-xs text-base-300 transition-colors hover:border-gold-600/60 hover:text-gold-400"
      >
        <ListPlus className="h-3.5 w-3.5" /> Adicionar à lista
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-56 overflow-hidden rounded-xl border border-base-700 bg-base-900 shadow-card">
          {lists.length === 0 ? (
            <p className="px-3 py-3 text-xs text-base-500">
              Crie uma lista em &quot;Minhas listas&quot; primeiro.
            </p>
          ) : (
            lists.map((l) => {
              const inList = l.items.some((i) => i.movie.id === movieId);
              return (
                <button
                  key={l.id}
                  onClick={() => toggle(l.id, inList)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-base-300 hover:bg-base-800"
                >
                  {l.name}
                  {inList && <Check className="h-4 w-4 text-gold-400" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
