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
  title: "Compras Facilite",
  description: "Facilite suas compras de mercado com listas inteligentes e controle em tempo real.",
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
