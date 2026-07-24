"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clapperboard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type User = { id: string; username: string };

export function AuthGate({ user, children }: { user: User | null; children: React.ReactNode }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <>{children}</>;

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-base-800 bg-base-900 p-8 shadow-card">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Clapperboard className="h-6 w-6 text-gold-500" />
          <span className="text-xl font-semibold text-base-100">
            Cine<span className="text-gold-500">Rank</span>
          </span>
        </div>

        <p className="mb-5 text-center text-sm text-base-400">
          Escolha um nome de perfil pra separar suas avaliações do ranking
          público. Se o nome já existir, você entra nesse perfil.
        </p>

        <form onSubmit={login} className="flex flex-col gap-3">
          <input
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Seu nome de usuário"
            maxLength={24}
            className="rounded-full border border-base-700 bg-base-950/60 px-4 py-2.5 text-center text-sm text-base-200 placeholder:text-base-500 focus:border-gold-600/60"
          />
          <button
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-full bg-gold-500 px-4 py-2.5 text-sm font-medium text-base-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-base-600">
          Sem senha — este é um perfil simples para uso pessoal.
        </p>
      </div>
    </div>
  );
}
