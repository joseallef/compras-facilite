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
  metadataBase: new URL("https://compras-facilite.vercel.app"),
  title: {
    default: "Compras Facilite | Sua Lista de Mercado Inteligente",
    template: "%s | Compras Facilite",
  },
  description: "Organize suas compras de mercado com facilidade. Crie listas inteligentes, controle gastos em tempo real e economize tempo e dinheiro. A ferramenta ideal para o seu dia a dia.",
  keywords: ["lista de compras", "mercado", "organização", "planejamento", "compras facilite", "lista inteligente", "controle de gastos", "compras online"],
  authors: [{ name: "José Allef" }],
  creator: "José Allef",
  publisher: "Compras Facilite",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://compras-facilite.vercel.app",
    title: "Compras Facilite | Sua Lista de Mercado Inteligente",
    description: "Organize suas compras com facilidade. Crie listas, controle gastos e economize tempo.",
    siteName: "Compras Facilite",
    images: [
      {
        url: "https://compras-facilite.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Compras Facilite - Organize suas compras com facilidade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compras Facilite | Sua Lista de Mercado Inteligente",
    description: "Organize suas compras com facilidade. Crie listas, controle gastos e economize tempo.",
    images: ["https://compras-facilite.vercel.app/og-image.png"],
    creator: "@joseallef",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#059669", // emerald-600
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Compras Facilite",
              "url": "https://compras-facilite.vercel.app",
              "description": "Organize suas compras de mercado com facilidade. Crie listas inteligentes e controle gastos em tempo real.",
              "applicationCategory": "ShoppingApplication",
              "operatingSystem": "All",
              "author": {
                "@type": "Person",
                "name": "José Allef"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              }
            }),
          }}
        />
      </head>
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
