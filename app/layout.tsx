import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopFlow",
  description: "Система електронної комерції з модулем аналітики продажів",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body
        className={`${outfit.className} bg-black text-zinc-100 min-h-screen antialiased relative selection:bg-violet-500/30`}
      >
        {/* <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"> */}
        {/* <div className="absolute top-0 left-0 right-0 h-full bg-linear-to-b from-violet-600/5 to-transparent" /> */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-full bg-linear-to-t from-indigo-600/5 to-transparent" /> */}
        {/* </div> */}
        {children}
      </body>
    </html>
  );
}
