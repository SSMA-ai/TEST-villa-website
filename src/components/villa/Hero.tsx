"use client";

import { useRef, useState } from "react";
import { useScrollScrub } from "@/hooks/useScrollScrub";

const HERO_STAGES = [
  {
    heading: "Villa Aurora",
    subtitle:
      "A private clifftop estate on the Côte d'Azur — infinity pool, six suites, uninterrupted sea views.",
  },
  {
    heading: "Living, Reimagined",
    subtitle:
      "Floor-to-ceiling glass, oak-beamed ceilings, and a kitchen built for entertaining — all facing the Mediterranean.",
  },
  {
    heading: "Stone, Light, Silence",
    subtitle:
      "A freestanding travertine bath, brass fittings, and a horizon that never leaves your view.",
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

        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "10%",
            transform: "translateX(-50%)",
            width: "min(640px, 88%)",
            height: 210,
            padding: "0 24px",
          }}
        >
          {HERO_STAGES.map((stage, index) => (
            <div
              key={stage.heading}
              style={{
                position: "absolute",
                inset: "0 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "32px 40px",
                background: "rgba(255,255,255,0.09)",
                backdropFilter: "blur(20px) saturate(1.2)",
                WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                border: "1px solid rgba(255,255,255,0.2)",
                opacity: stageOpacity(progress, index),
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(26px, 3.2vw, 38px)",
                  lineHeight: 1.15,
                  color: "#FFFFFF",
                }}
              >
                {stage.heading}
              </h2>
              <p
                style={{
                  margin: "14px 0 0",
                  maxWidth: 440,
                  fontSize: 14.5,
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {stage.subtitle}
              </p>
            </div>
          ))}
        </div>

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
