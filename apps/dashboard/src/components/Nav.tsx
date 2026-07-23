"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Command" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/matrix", label: "Feature Matrix" },
  { href: "/gaps", label: "Gaps" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/timeline", label: "Timeline" },
  { href: "/chinese", label: "Chinese Velocity" },
  { href: "/financial", label: "Financial" },
  { href: "/products", label: "Products" },
  { href: "/sources", label: "Sources" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav" aria-label="Primary navigation">
      <div className="nav-shell">
        <Link href="/" className="nav-brand">
          <span className="brand-mark">F</span>
          <span>Frontier Feature Tracker</span>
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-links"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <div className={`nav-links ${open ? "is-open" : ""}`} id="primary-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={pathname === l.href ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
