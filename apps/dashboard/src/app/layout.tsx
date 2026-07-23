import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grok Product Roadmap",
  description:
    "Director-level Grok product roadmap, competitive feature analysis, and market intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Nav />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
