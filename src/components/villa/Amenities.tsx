import { amenities } from "@/lib/villa-data";
import { Reveal } from "./Reveal";

export function Amenities() {
  return (
    <section style={{ background: "#F7F4EF" }}>
      <div className="amenities-section" style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal
          className="section-header-row"
          style={{
            justifyContent: "space-between",
            gap: 40,
            paddingBottom: 46,
            borderBottom: "1px solid #E3D9C6",
          }}
        >
          <div>
            <span style={{ fontSize: 9.5, letterSpacing: "0.42em", color: "#A98A54" }}>
              04 — INCLUDED
            </span>
            <h2
              className="heading-xl"
              style={{
                margin: "24px 0 0",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                lineHeight: 1.12,
              }}
            >
              Everything, quietly handled.
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: 300, fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: "#6B6459" }}>
            No add-ons, no resort fees. What follows arrives with the keys.
          </p>
        </Reveal>

        <div
          className="amenities-grid"
          style={{
            background: "#E3D9C6",
            border: "1px solid #E3D9C6",
            marginTop: 56,
          }}
        >
          {amenities.map((a) => (
            <div
              key={a.title}
              className="amenity-card"
              style={{
                background: "#F7F4EF",
                padding: "40px 34px 44px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transition: "background 400ms ease",
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  border: "1px solid #A98A54",
                  borderRadius: a.radius,
                  transform: `rotate(${a.rotate})`,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{a.title}</span>
                <span style={{ fontSize: 13.5, fontWeight: 300, lineHeight: 1.7, color: "#6B6459" }}>
                  {a.body}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
