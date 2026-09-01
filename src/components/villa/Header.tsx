"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/villa-data";

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const textColor = solid ? "#1C1A17" : "#FFFFFF";
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className="header-padding-x"
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
          paddingTop: solid ? 16 : 26,
          paddingBottom: solid ? 16 : 26,
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
          className="desktop-nav"
          style={{
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

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
          <a
            href="#booking"
            className="btn-gold-solid header-cta"
            style={{
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
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              flexDirection: "column",
              justifyContent: "center",
              gap: 5,
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span style={{ width: 24, height: 1, background: textColor, transition: "background 500ms ease" }} />
            <span style={{ width: 24, height: 1, background: textColor, transition: "background 500ms ease" }} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu-overlay">
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: 26,
              right: 24,
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#F7F4EF",
              fontSize: 24,
              lineHeight: 1,
            }}
          >
            &times;
          </button>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 21,
              letterSpacing: "0.34em",
              color: "#F7F4EF",
              opacity: 0.6,
            }}
          >
            AURORA
          </span>

          <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="footer-link"
                style={{ fontSize: 20, letterSpacing: "0.1em", color: "#F7F4EF" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#booking"
            onClick={closeMenu}
            className="btn-gold-solid"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "15px 34px",
              border: "1px solid #A98A54",
              background: "#A98A54",
              color: "#FFFFFF",
              fontSize: 10.5,
              letterSpacing: "0.26em",
            }}
          >
            BOOK NOW
          </a>
        </div>
      )}
    </>
  );
}
