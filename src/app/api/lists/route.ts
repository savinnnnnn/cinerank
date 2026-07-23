import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lists = await prisma.movieList.findMany({
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
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Nome da lista é obrigatório" }, { status: 400 });
    }
    const list = await prisma.movieList.create({ data: { name: name.trim() } });
    return NextResponse.json(list, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
