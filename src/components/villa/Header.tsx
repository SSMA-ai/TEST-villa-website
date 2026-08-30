"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/villa-data";

export function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = solid ? "#1C1A17" : "#FFFFFF";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 24,
        padding: solid ? "16px 48px" : "26px 48px",
        background: solid ? "rgba(247,244,239,0.94)" : "transparent",
        backdropFilter: solid ? "blur(16px)" : "none",
        WebkitBackdropFilter: solid ? "blur(16px)" : "none",
        borderBottom: `1px solid ${solid ? "rgba(28,26,23,0.10)" : "rgba(255,255,255,0)"}`,
        boxShadow: solid ? "0 18px 40px -34px rgba(28,26,23,0.5)" : "none",
        transition:
          "background 600ms ease, padding 600ms ease, border-color 600ms ease, box-shadow 600ms ease",
      }}
    >
      <a
        href="#top"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          color: textColor,
          transition: "color 500ms ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 21,
            letterSpacing: "0.34em",
            lineHeight: 1,
          }}
        >
          AURORA
        </span>
        <span style={{ fontSize: 8.5, letterSpacing: "0.42em", opacity: 0.62 }}>
          PRIVATE ESTATE
        </span>
      </a>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 38,
          color: textColor,
          transition: "color 500ms ease",
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav-link"
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              color: "inherit",
              opacity: 0.82,
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <a
          href="#booking"
          className="btn-gold-solid"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 26px",
            border: "1px solid #A98A54",
            background: "#A98A54",
            color: "#FFFFFF",
            fontSize: 10.5,
            letterSpacing: "0.26em",
            transition: "background 350ms ease, color 350ms ease",
          }}
        >
          BOOK NOW
        </a>
      </div>
    </header>
  );
}
