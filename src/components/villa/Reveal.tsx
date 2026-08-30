"use client";

import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

type RevealProps = {
  children: ReactNode;
  delayMs?: number;
  durationMs?: number;
  translateY?: number;
  style?: CSSProperties;
};

export function Reveal({
  children,
  delayMs = 0,
  durationMs = 1000,
  translateY = 26,
  style,
}: RevealProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: `opacity ${durationMs}ms ease ${delayMs}ms, transform ${durationMs}ms ease ${delayMs}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
