import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// Listas são pessoais: cada usuário só vê e cria as suas próprias.
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ lists: [] });

    const lists = await prisma.movieList.findMany({
      where: { userId },
      include: { items: { include: { movie: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ lists });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Faça login." }, { status: 401 });

    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Nome da lista é obrigatório" }, { status: 400 });
    }
    const list = await prisma.movieList.create({ data: { name: name.trim(), userId } });
    return NextResponse.json(list, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
