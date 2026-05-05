import { auth } from "@/auth";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { CSSProperties } from "react";
import { Toaster } from "sonner";
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
    default: "Compras Facilite",
    template: "%s | Compras Facilite",
  },
  description: "Organize suas compras de mercado com facilidade. Crie listas, controle gastos e economize tempo.",
  keywords: ["lista de compras", "mercado", "organização", "planejamento", "compras facilite"],
  authors: [{ name: "José Allef" }],
  creator: "José Allef",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://compras-facilite.vercel.app",
    title: "Compras Facilite",
    description: "Sua lista de mercado inteligente e fácil de usar.",
    siteName: "Compras Facilite",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Compras Facilite - Sua lista de mercado inteligente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compras Facilite",
    description: "Sua lista de mercado inteligente e fácil de usar.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const toasterStyle: CSSProperties & Record<`--${string}`, string> = {
    "--toast-close-button-start": "unset",
    "--toast-close-button-end": "0",
    "--toast-close-button-transform": "translate(35%, -35%)",
  };

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider session={session}>
          {children}
          <ScrollToTop />
          <Toaster position="top-right" richColors closeButton style={toasterStyle} />
        </AuthProvider>
      </body>
    </html>
  );
}
