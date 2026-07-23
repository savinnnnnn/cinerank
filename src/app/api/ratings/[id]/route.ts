import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { score, comment } = await req.json();

    if (typeof score !== "number" || score < 0 || score > 10) {
      return NextResponse.json({ error: "Nota inválida" }, { status: 400 });
    }

    const rating = await prisma.rating.update({
      where: { id: params.id },
      data: { score, comment: comment?.trim() || null },
    });

    return NextResponse.json(rating);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.rating.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
