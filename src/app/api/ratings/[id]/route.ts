import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

async function assertOwnership(ratingId: string, userId: string) {
  const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
  return rating && rating.userId === userId ? rating : null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Faça login." }, { status: 401 });

    const owned = await assertOwnership(params.id, userId);
    if (!owned) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

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
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Faça login." }, { status: 401 });

    const owned = await assertOwnership(params.id, userId);
    if (!owned) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

    await prisma.rating.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
