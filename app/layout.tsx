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
  title: "備品管理",
  description: "QRコードで備品の貸出・返却を管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-background">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <a href="/" className="text-base font-semibold tracking-tight">
              備品管理
            </a>
            <a href="/items" className="text-sm text-muted-foreground hover:text-foreground">
              備品マスタ
            </a>
            <a href="/members" className="text-sm text-muted-foreground hover:text-foreground">
              メンバー
            </a>
            <a href="/scan" className="text-sm text-muted-foreground hover:text-foreground">
              QRスキャン
            </a>
            <a href="/loans" className="text-sm text-muted-foreground hover:text-foreground">
              履歴
            </a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
