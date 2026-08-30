"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useScrollScrub } from "@/hooks/useScrollScrub";

const HERO_STAGES: {
  heading: string;
  subtitle: string;
  position: CSSProperties;
  align: "left" | "right" | "center";
  maxWidth: number | string;
  slideAxis: "x" | "y";
  /** Signed pixel distance the stage slides in from (and back out to). */
  slideDistance: number;
}[] = [
  {
    heading: "Villa Aurora",
    subtitle:
      "A private clifftop estate on the Côte d'Azur — infinity pool, six suites, uninterrupted sea views.",
    position: { left: "6%", top: "50%" },
    align: "left",
    maxWidth: "min(400px, 40vw)",
    slideAxis: "x",
    slideDistance: -70,
  },
  {
    heading: "Living, Reimagined",
    subtitle:
      "Floor-to-ceiling glass, oak-beamed ceilings, and a kitchen built for entertaining — all facing the Mediterranean.",
    position: { right: "6%", top: "50%" },
    align: "right",
    maxWidth: "min(400px, 40vw)",
    slideAxis: "x",
    slideDistance: 70,
  },
  {
    heading: "Stone, Light, Silence",
    subtitle:
      "A freestanding travertine bath, brass fittings, and a horizon that never leaves your view.",
    position: { left: "50%", bottom: "12%" },
    align: "center",
    maxWidth: "min(560px, 86vw)",
    slideAxis: "y",
    slideDistance: 60,
  },
];

// Fades a stage in over the first 10% of its slice of scroll progress, holds,
// then fades out over the last 10% before the next stage's fade-in begins.
function stageOpacity(progress: number, index: number) {
  const stageLength = 1 / HERO_STAGES.length;
  const start = index * stageLength;
  const end = start + stageLength;
  const fade = stageLength * 0.1;

  if (progress <= start || progress >= end) return 0;
  if (progress < start + fade) return (progress - start) / fade;
  if (progress > end - fade) return (end - progress) / fade;
  return 1;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useScrollScrub({ trigger: sectionRef, video: videoRef, onProgress: setProgress });

  return (
    <section
      id="top"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100vw",
        maxWidth: "100%",
        height: "300vh",
        margin: 0,
        padding: 0,
        background: "#2E2B26",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          src="/videos/hero-full.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#2E2B26",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(20,19,16,0.42) 0%, rgba(20,19,16,0.08) 34%, rgba(20,19,16,0.55) 100%)",
            opacity: 0.45,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <div style={{ width: "min(720px, 100%)", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 30,
              }}
            >
              <span style={{ width: 34, height: 1, background: "rgba(255,255,255,0.45)" }} />
              <span
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.42em",
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                CÔTE D&apos;AZUR · FRANCE
              </span>
              <span style={{ width: 34, height: 1, background: "rgba(255,255,255,0.45)" }} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginTop: 38,
              }}
            >
              <a
                href="#booking"
                className="btn-hero-primary"
                style={{
                  padding: "15px 34px",
                  background: "rgba(255,255,255,0.94)",
                  color: "#1C1A17",
                  fontSize: 10.5,
                  letterSpacing: "0.26em",
                  transition: "background 350ms ease",
                }}
              >
                RESERVE THE VILLA
              </a>
              <a
                href="#rooms"
                className="btn-hero-secondary"
                style={{
                  padding: "15px 30px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#FFFFFF",
                  fontSize: 10.5,
                  letterSpacing: "0.26em",
                  transition: "border-color 350ms ease",
                }}
              >
                VIEW THE HOUSE
              </a>
            </div>
          </div>
        </div>

        {HERO_STAGES.map((stage, index) => {
          const opacity = stageOpacity(progress, index);
          // At the start/end of a stage's range opacity is 0, so this is at
          // full displacement; it eases to 0 offset as opacity reaches 1.
          const slideOffset = (1 - opacity) * stage.slideDistance;
          const centering = stage.align === "center" ? "translateX(-50%)" : "translateY(-50%)";
          const slide =
            stage.slideAxis === "x" ? `translateX(${slideOffset}px)` : `translateY(${slideOffset}px)`;

          return (
            <div
              key={stage.heading}
              style={{
                position: "absolute",
                ...stage.position,
                transform: `${centering} ${slide}`,
                opacity,
                width: stage.maxWidth,
                textAlign: stage.align,
                pointerEvents: "none",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(28px, 3.4vw, 44px)",
                  lineHeight: 1.15,
                  color: "#FFFFFF",
                  textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 10px 44px rgba(0,0,0,0.4)",
                }}
              >
                {stage.heading}
              </h2>
              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: 14.5,
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.92)",
                  textShadow: "0 1px 10px rgba(0,0,0,0.6), 0 6px 28px rgba(0,0,0,0.4)",
                }}
              >
                {stage.subtitle}
              </p>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            right: 42,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <span
            style={{
              writingMode: "vertical-rl",
              fontSize: 9.5,
              letterSpacing: "0.46em",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            SCROLL TO EXPLORE
          </span>
          <span
            style={{
              width: 1,
              height: 92,
              background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
