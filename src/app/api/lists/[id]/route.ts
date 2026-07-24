import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// POST { movieId } adiciona um filme à lista.
// DELETE ?movieId=... remove um filme da lista.
// DELETE sem query remove a lista inteira.
// Todas as operações checam se a lista pertence ao usuário logado.

async function assertOwnership(listId: string, userId: string) {
  const list = await prisma.movieList.findUnique({ where: { id: listId } });
  return list && list.userId === userId ? list : null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Faça login." }, { status: 401 });

    const owned = await assertOwnership(params.id, userId);
    if (!owned) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

    const { movieId } = await req.json();
    const item = await prisma.listItem.upsert({
      where: { listId_movieId: { listId: params.id, movieId } },
      update: {},
      create: { listId: params.id, movieId },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Faça login." }, { status: 401 });

    const owned = await assertOwnership(params.id, userId);
    if (!owned) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

    const movieId = req.nextUrl.searchParams.get("movieId");

    if (movieId) {
      await prisma.listItem.delete({
        where: { listId_movieId: { listId: params.id, movieId } },
      });
      return NextResponse.json({ ok: true });
    }

    await prisma.movieList.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
