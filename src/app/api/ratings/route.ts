import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// Cria (ou atualiza, se já existir) a avaliação do usuário logado para um filme.
// Cada usuário só pode ter uma nota por filme — dar uma nota de novo substitui a antiga.
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Faça login para avaliar." }, { status: 401 });
    }

    const body = await req.json();
    const { movieId, score, comment } = body as {
      movieId: string;
      score: number;
      comment?: string;
    };

    if (!movieId || typeof score !== "number" || score < 0 || score > 10) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const rating = await prisma.rating.upsert({
      where: { userId_movieId: { userId, movieId } },
      update: { score, comment: comment?.trim() || null },
      create: { userId, movieId, score, comment: comment?.trim() || null },
    });

    return NextResponse.json(rating, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
