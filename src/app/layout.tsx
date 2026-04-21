import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { buildClassSuffix } from "@/lib/obfuscate";
import { getDomSeed } from "@/lib/data";

export const metadata: Metadata = {
  title: "Alto & Oak — A small catalog of well-made things",
  description:
    "A curated shop of honest goods from independent makers. Electronics, apparel, and home goods with prices that move with the market.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const suffix = buildClassSuffix();
  const buildCss = `
  .pc-${suffix} { display: inline-block; }
  .pcd-${suffix} {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0,0,0,0) !important;
    white-space: nowrap !important;
    border: 0 !important;
    left: -9999px !important;
    top: auto !important;
  }
`;
  return (
    <html lang="en">
      <head>
        <meta name="x-build" content={getDomSeed().buildId} />
        <style dangerouslySetInnerHTML={{ __html: buildCss }} />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900">
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
