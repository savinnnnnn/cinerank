import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/Toaster";
import { AuthGate } from "@/components/AuthGate";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FishCine — seu catálogo pessoal de filmes",
  description: "Avalie filmes de 0 a 10 e acompanhe seu ranking pessoal, atualizado automaticamente.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <ToastProvider>
          <AuthGate user={user ? { id: user.id, username: user.username } : null}>
            <Header user={user ? { username: user.username } : null} />
            <main className="min-h-screen">{children}</main>
            <footer className="border-t border-base-800 py-10 mt-24 text-center text-sm text-base-500">
              FishCine — catálogo pessoal de avaliações de filmes.
            </footer>
          </AuthGate>
        </ToastProvider>
      </body>
    </html>
  );
}
