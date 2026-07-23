import Link from "next/link";
import { Clapperboard, ListVideo, User } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-800/80 bg-base-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Clapperboard className="h-5 w-5 text-gold-500" />
          <span className="text-lg font-semibold tracking-tight text-base-100">
            Cine<span className="text-gold-500">Rank</span>
          </span>
        </Link>

        <div className="flex-1">
          <SearchBar />
        </div>

        <nav className="hidden shrink-0 items-center gap-1 sm:flex">
          <Link
            href="/listas"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-base-300 transition-colors hover:bg-base-800 hover:text-base-100"
          >
            <ListVideo className="h-4 w-4" />
            Minhas listas
          </Link>
          <Link
            href="/perfil"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-base-300 transition-colors hover:bg-base-800 hover:text-base-100"
          >
            <User className="h-4 w-4" />
            Perfil
          </Link>
        </nav>
      </div>
    </header>
  );
}
