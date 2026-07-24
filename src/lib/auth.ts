import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Autenticação bem simples, de propósito: cada navegador/aparelho guarda
// um cookie apontando pra um usuário. Não existe senha — é só um "nome de
// perfil" pra separar as avaliações de cada pessoa que usa o site.
export const AUTH_COOKIE = "cinerank_uid";

export async function getCurrentUserId(): Promise<string | null> {
  return cookies().get(AUTH_COOKIE)?.value ?? null;
}

export async function getCurrentUser() {
  const id = await getCurrentUserId();
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
}
