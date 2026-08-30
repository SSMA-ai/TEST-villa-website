"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, active: boolean, durationMs = 1200, delayMs = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let raf: number | undefined;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [active, target, durationMs, delayMs]);

  return value;
}
