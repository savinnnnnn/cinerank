import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/Toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CineRank — seu catálogo pessoal de filmes",
  description: "Avalie filmes de 0 a 10 e acompanhe seu ranking pessoal, atualizado automaticamente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <ToastProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-base-800 py-10 mt-24 text-center text-sm text-base-500">
            CineRank — catálogo pessoal de avaliações de filmes.
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
