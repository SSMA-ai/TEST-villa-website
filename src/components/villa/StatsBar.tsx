import { stats } from "@/lib/villa-data";

export function StatsBar() {
  return (
    <section style={{ background: "#1C1A17", color: "#F7F4EF" }}>
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 48px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.key}
            style={{
              padding: "44px 0 42px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              borderLeft: "1px solid rgba(247,244,239,0.12)",
              paddingLeft: 32,
            }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: 34, lineHeight: 1 }}>
              {stat.value}
            </span>
            <span style={{ fontSize: 9.5, letterSpacing: "0.32em", color: "rgba(247,244,239,0.5)" }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
