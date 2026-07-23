"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { RatingDTO } from "@/types";

export function RatingForm({ movieId, existing }: { movieId: string; existing: RatingDTO | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(!existing);
  const [score, setScore] = useState(existing?.score ?? 7.5);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(existing ? `/api/ratings/${existing.id}` : "/api/ratings", {
        method: existing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existing ? { score, comment } : { movieId, score, comment }),
      });
      if (!res.ok) throw new Error();
      toast.success("Avaliação salva!");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Não foi possível salvar a avaliação.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!existing) return;
    if (!confirm("Excluir esta avaliação?")) return;
    try {
      const res = await fetch(`/api/ratings/${existing.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Avaliação removida.");
      setEditing(true);
      setScore(7.5);
      setComment("");
      router.refresh();
    } catch {
      toast.error("Não foi possível remover a avaliação.");
    }
  }

  if (!editing && existing) {
    return (
      <div className="rounded-2xl border border-base-800 bg-base-900 p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
            <span className="text-2xl font-semibold text-base-100">{existing.score.toFixed(1)}</span>
            <span className="text-sm text-base-500">minha nota</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setEditing(true)}
              className="rounded-full p-2 text-base-400 transition-colors hover:bg-base-800 hover:text-gold-400"
              aria-label="Editar avaliação"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={remove}
              className="rounded-full p-2 text-base-400 transition-colors hover:bg-base-800 hover:text-crimson-400"
              aria-label="Excluir avaliação"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {existing.comment && <p className="mt-3 text-sm leading-relaxed text-base-300">{existing.comment}</p>}
        <p className="mt-3 text-xs text-base-500">
          Avaliado em {new Date(existing.createdAt).toLocaleDateString("pt-BR")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-base-800 bg-base-900 p-5 shadow-card">
      <h3 className="text-sm font-medium text-base-200">Minha avaliação</h3>

      <div className="mt-4 flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-base-700 accent-gold-500"
        />
        <div className="flex w-16 shrink-0 items-center justify-center gap-1 rounded-full bg-base-800 py-1.5 text-sm font-semibold text-gold-400">
          <Star className="h-3.5 w-3.5 fill-gold-400" />
          {score.toFixed(1)}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escreva um comentário ou crítica (opcional)"
        rows={4}
        className="mt-4 w-full resize-none rounded-xl border border-base-700 bg-base-950/60 p-3 text-sm text-base-200 placeholder:text-base-500 focus:border-gold-600/60"
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-base-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar avaliação
        </button>
        {existing && (
          <button
            onClick={() => setEditing(false)}
            className="rounded-full px-4 py-2 text-sm text-base-400 transition-colors hover:text-base-200"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
