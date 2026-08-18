import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ALBIMAQ - Venda, Aluguer, Manutenção e Reparação",
    template: "%s - Albimaq Oficial",
  },
  description:
    "Peças originais e alternativas para escavadoras, retroescavadoras, pás carregadoras e equipamento pesado. Entrega em todo Moçambique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-MZ" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink-900">{children}</body>
    </html>
  );
}
