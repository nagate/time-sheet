import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Time Sheet",
  description: "Manage Time Sheet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="jp">
      {/* <body className={inter.className}>{children}</body> */}
      <body className="bg-white">{children}</body>
    </html>
  );
}
