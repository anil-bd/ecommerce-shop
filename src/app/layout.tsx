import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BUILD_CLASS_SUFFIX } from "@/lib/obfuscate";
import { domSeed } from "@/lib/data";

export const metadata: Metadata = {
  title: "Alto & Oak — A small catalog of well-made things",
  description:
    "A curated shop of honest goods from independent makers. Electronics, apparel, and home goods with prices that move with the market.",
};

const buildCss = `
  .pc-${BUILD_CLASS_SUFFIX} { display: inline-block; }
  .pcd-${BUILD_CLASS_SUFFIX} {
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="x-build" content={domSeed.buildId} />
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
