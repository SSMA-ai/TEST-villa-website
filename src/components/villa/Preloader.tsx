"use client";

import type { RefObject } from "react";

type PreloaderProps = {
  /** Fill element of the progress line; the loader drives its scaleX directly. */
  fillRef: RefObject<HTMLDivElement | null>;
  /** Percentage text node; the loader writes to it directly (no per-frame re-render). */
  percentRef: RefObject<HTMLSpanElement | null>;
  exiting: boolean;
  onExited: () => void;
};

export function Preloader({ fillRef, percentRef, exiting, onExited }: PreloaderProps) {
  return (
    <div
      className="preloader"
      data-exiting={exiting ? "true" : "false"}
      role="progressbar"
      aria-label="Loading Villa Aurora"
      aria-valuemin={0}
      aria-valuemax={100}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "transform") onExited();
      }}
    >
      <div className="preloader-content">
        <div className="preloader-logo">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              letterSpacing: "0.34em",
              lineHeight: 1,
              // trailing letter-spacing would otherwise push the word off-centre
              paddingLeft: "0.34em",
            }}
          >
            AURORA
          </span>
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.42em",
              paddingLeft: "0.42em",
              opacity: 0.55,
            }}
          >
            PRIVATE ESTATE
          </span>
        </div>

        <div className="preloader-progress">
          <div className="preloader-track">
            <div ref={fillRef} className="preloader-fill" />
          </div>
          <span ref={percentRef} className="preloader-percent">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
