import { Reveal } from "./Reveal";

export function About() {
  return (
    <section
      id="about"
      style={{
        maxWidth: 1320,
        margin: "0 auto",
        padding: "148px 48px 130px",
        display: "grid",
        gridTemplateColumns: "0.85fr 1.15fr",
        gap: 90,
        alignItems: "start",
      }}
    >
      <Reveal durationMs={1000}>
        <span style={{ fontSize: 9.5, letterSpacing: "0.42em", color: "#A98A54" }}>
          01 — THE ESTATE
        </span>
        <h2
          style={{
            margin: "26px 0 0",
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: 44,
            lineHeight: 1.12,
          }}
        >
          A house built around the light.
        </h2>
      </Reveal>
      <Reveal
        durationMs={1000}
        delayMs={120}
        style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 620 }}
      >
        <p style={{ margin: 0, fontSize: 17, fontWeight: 300, lineHeight: 1.8, color: "#45403A" }}>
          Aurora sits on a limestone shelf twelve metres above a private cove. The architecture
          is deliberately quiet — travertine, oiled oak, linen — so that the water does the
          talking. Every room opens; nothing is corridor.
        </p>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 300, lineHeight: 1.85, color: "#6B6459" }}>
          Stays include a resident housekeeper, daily provisioning, and a chef on request. The
          gate closes behind one party at a time.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
            marginTop: 14,
            paddingTop: 30,
            borderTop: "1px solid #E3D9C6",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <span style={{ fontSize: 9.5, letterSpacing: "0.3em", color: "#A98A54" }}>
              CAPACITY
            </span>
            <span style={{ fontSize: 15, fontWeight: 300, color: "#45403A" }}>12 guests</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <span style={{ fontSize: 9.5, letterSpacing: "0.3em", color: "#A98A54" }}>
              MINIMUM
            </span>
            <span style={{ fontSize: 15, fontWeight: 300, color: "#45403A" }}>5 nights</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <span style={{ fontSize: 9.5, letterSpacing: "0.3em", color: "#A98A54" }}>FROM</span>
            <span style={{ fontSize: 15, fontWeight: 300, color: "#45403A" }}>
              €4,800 / night
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
