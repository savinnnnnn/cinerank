import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE } from "@/lib/auth";

// Login "simples": digitou um nome que já existe -> entra nesse perfil.
// Digitou um nome novo -> cria o perfil na hora. Sem senha, de propósito.
export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    const clean = (username ?? "").trim();

    if (clean.length < 2 || clean.length > 24) {
      return NextResponse.json(
        { error: "O nome de usuário deve ter entre 2 e 24 caracteres." },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({ where: { username: clean } });
    if (!user) {
      user = await prisma.user.create({ data: { username: clean } });
    }

    cookies().set(AUTH_COOKIE, user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return NextResponse.json({ id: user.id, username: user.username });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
