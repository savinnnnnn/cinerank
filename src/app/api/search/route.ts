import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

// Busca em tempo real na TMDb — usada pela barra de pesquisa do header.
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchMovies(query);
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
