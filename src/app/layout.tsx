import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SITE_NAME } from "@/lib/constants";

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
    default: `${SITE_NAME} — Peças para Máquinas de Construção em Moçambique`,
    template: `%s · ${SITE_NAME}`,
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
      <body className="flex min-h-full flex-col bg-white text-ink-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
