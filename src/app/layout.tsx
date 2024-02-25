import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Time Sheet",
  description: "Manage Time Sheet",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="jp">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#b8e986" />
      </head>
      <body className="bg-white">{children}</body>
    </html>
  );
}
