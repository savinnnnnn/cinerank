import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Cria uma avaliação para um filme (o filme já deve existir no banco
// — a página do filme garante isso ao carregar via /api/movies/[tmdbId]).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { movieId, score, comment } = body as {
      movieId: string;
      score: number;
      comment?: string;
    };

    if (!movieId || typeof score !== "number" || score < 0 || score > 10) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const rating = await prisma.rating.create({
      data: { movieId, score, comment: comment?.trim() || null },
    });

    return NextResponse.json(rating, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
