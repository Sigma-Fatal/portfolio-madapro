import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from './i18n';

export const metadata: Metadata = {
  title: "MadaPro | Portfolio",
  description: "Développeur Full Stack & Ingénieur IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-[#0a0a0a] text-gray-300 antialiased font-sans">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}