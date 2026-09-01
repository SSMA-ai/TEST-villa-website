import { stats } from "@/lib/villa-data";
import { StatColumn } from "./StatColumn";

export function StatsBar() {
  return (
    <section style={{ background: "#1C1A17", color: "#F7F4EF" }}>
      <div
        className="stats-grid"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {stats.map((stat, i) => (
          <StatColumn key={stat.key} stat={stat} delayMs={i * 120} />
        ))}
      </div>
    </section>
  );
}
