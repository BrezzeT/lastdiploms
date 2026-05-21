import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopFlow",
  description: "Система електронної комерції з модулем аналітики продажів",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body
        className={`${outfit.className} bg-slate-50 text-zinc-800 min-h-screen antialiased relative selection:bg-violet-500/10 selection:text-violet-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
