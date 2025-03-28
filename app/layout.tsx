// Supprime "use client" du composant racine
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import ApiStatusChecker from "@/components/ApiStatusChecker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Ces métadonnées doivent être dans un composant serveur
export const metadata: Metadata = {
  title: "Librairie d'occasion - Achetez et vendez vos livres",
  description: "Plateforme de vente de livres d'occasion entre particuliers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ApiStatusChecker />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}