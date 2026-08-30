export function Footer() {
  return (
    <footer id="contact" style={{ background: "#1C1A17", color: "#F7F4EF" }}>
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "110px 48px 44px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr 0.9fr",
          gap: 70,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "0.32em" }}>
              AURORA
            </span>
            <span style={{ fontSize: 8.5, letterSpacing: "0.42em", color: "rgba(247,244,239,0.45)" }}>
              PRIVATE ESTATE
            </span>
          </div>
          <p style={{ margin: 0, maxWidth: 300, fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: "rgba(247,244,239,0.6)" }}>
            Chemin des Cyprès 14
            <br />
            06230 Saint-Jean-Cap-Ferrat
            <br />
            France
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a href="mailto:stay@villa-aurora.com" className="footer-link" style={{ fontSize: 14.5, fontWeight: 300, color: "#F7F4EF" }}>
              stay@villa-aurora.com
            </a>
            <a href="tel:+33493000000" className="footer-link" style={{ fontSize: 14.5, fontWeight: 300, color: "rgba(247,244,239,0.72)" }}>
              +33 4 93 00 00 00
            </a>
          </div>
        </div>

        <div id="location" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.32em", color: "rgba(247,244,239,0.45)" }}>
            LOCATION
          </span>
          <div
            style={{
              position: "relative",
              aspectRatio: "4 / 3",
              backgroundColor: "#24211C",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(247,244,239,0.06) 0 1px, transparent 1px 46px), repeating-linear-gradient(0deg, rgba(247,244,239,0.06) 0 1px, transparent 1px 46px)",
              border: "1px solid rgba(247,244,239,0.12)",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                width: 9,
                height: 9,
                background: "#A98A54",
                borderRadius: "50%",
              }}
            />
          </div>
          <a href="#location" className="directions-link" style={{ fontSize: 12.5, letterSpacing: "0.2em", color: "#A98A54" }}>
            GET DIRECTIONS →
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 9, letterSpacing: "0.32em", color: "rgba(247,244,239,0.45)" }}>
              EXPLORE
            </span>
            <a href="#about" className="footer-link" style={{ fontSize: 14, fontWeight: 300, color: "rgba(247,244,239,0.78)" }}>
              About
            </a>
            <a href="#rooms" className="footer-link" style={{ fontSize: 14, fontWeight: 300, color: "rgba(247,244,239,0.78)" }}>
              Rooms
            </a>
            <a href="#gallery" className="footer-link" style={{ fontSize: 14, fontWeight: 300, color: "rgba(247,244,239,0.78)" }}>
              Gallery
            </a>
            <a href="#booking" className="footer-link" style={{ fontSize: 14, fontWeight: 300, color: "rgba(247,244,239,0.78)" }}>
              Reserve
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 9, letterSpacing: "0.32em", color: "rgba(247,244,239,0.45)" }}>
              FOLLOW
            </span>
            <a href="#contact" className="footer-link" style={{ fontSize: 14, fontWeight: 300, color: "rgba(247,244,239,0.78)" }}>
              Instagram
            </a>
            <a href="#contact" className="footer-link" style={{ fontSize: 14, fontWeight: 300, color: "rgba(247,244,239,0.78)" }}>
              Pinterest
            </a>
            <a href="#contact" className="footer-link" style={{ fontSize: 14, fontWeight: 300, color: "rgba(247,244,239,0.78)" }}>
              Journal
            </a>
          </div>
        </div>
      </div>
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "26px 48px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          borderTop: "1px solid rgba(247,244,239,0.1)",
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(247,244,239,0.38)" }}>
          © 2026 VILLA AURORA
        </span>
        <span style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(247,244,239,0.38)" }}>
          PRIVACY · TERMS · REGISTRATION FR-06-04412
        </span>
      </div>
    </footer>
  );
}
