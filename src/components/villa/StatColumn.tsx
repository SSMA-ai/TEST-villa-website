"use client";

import { useReveal } from "@/hooks/useReveal";
import { useCountUp } from "@/hooks/useCountUp";

type Stat = { key: string; value: string; label: string };

const NUMERIC_PATTERN = /^[\d,]+$/;

export function StatColumn({ stat, delayMs }: { stat: Stat; delayMs: number }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  const isNumeric = NUMERIC_PATTERN.test(stat.value);
  const target = isNumeric ? Number(stat.value.replace(/,/g, "")) : 0;
  const count = useCountUp(target, revealed && isNumeric, 1200, delayMs);
  const displayValue = isNumeric ? count.toLocaleString("en-GB") : stat.value;

  return (
    <div
      ref={ref}
      style={{
        padding: "44px 0 42px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderLeft: "1px solid rgba(247,244,239,0.12)",
        paddingLeft: 32,
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 700ms ease ${delayMs}ms, transform 700ms ease ${delayMs}ms`,
      }}
    >
      <span style={{ fontFamily: "var(--font-display)", fontSize: 34, lineHeight: 1 }}>
        {displayValue}
      </span>
      <span style={{ fontSize: 9.5, letterSpacing: "0.32em", color: "rgba(247,244,239,0.5)" }}>
        {stat.label}
      </span>
    </div>
  );
}
