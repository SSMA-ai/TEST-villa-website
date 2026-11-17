"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useScrollScrub } from "@/hooks/useScrollScrub";
import { useSiteLoader } from "./SiteLoader";
import {
  HERO_CONFIG,
  captionOpacity,
  chapterIndexAt,
  chapterRanges,
  rangeOpacity,
  videoFractionAt,
} from "./heroTimeline";

// One text stage per chapter (same order as HERO_CONFIG.chapters). Each stage's
// scroll range comes from its chapter, so it follows the timeline mapping in
// heroTimeline.ts. `caption` is the small detail line that fades in mid-chapter.
const HERO_STAGES: {
  heading: string;
  subtitle: string;
  caption: string;
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
    caption: "Twelve metres above a private cove",
    position: { left: "6%", top: "50%" },
    align: "left",
    maxWidth: "min(400px, 78vw)",
    slideAxis: "x",
    slideDistance: -70,
  },
  {
    heading: "Living, Reimagined",
    subtitle:
      "Floor-to-ceiling glass, oak-beamed ceilings, and a kitchen built for entertaining — all facing the Mediterranean.",
    caption: "Glazing that slides fully away",
    position: { right: "6%", top: "50%" },
    align: "right",
    maxWidth: "min(400px, 78vw)",
    slideAxis: "x",
    slideDistance: 70,
  },
  {
    heading: "Stone, Light, Silence",
    subtitle:
      "A freestanding travertine bath, brass fittings, and a horizon that never leaves your view.",
    caption: "Pietra serena, cut from a single block",
    position: { left: "50%", bottom: "12%" },
    align: "center",
    maxWidth: "min(560px, 86vw)",
    slideAxis: "y",
    slideDistance: 60,
  },
];

const RANGES = chapterRanges();

function stageTransform(stage: (typeof HERO_STAGES)[number], opacity: number) {
  // At the edges of a stage's range opacity is 0, so it sits at full
  // displacement; it eases to 0 offset as opacity reaches 1.
  const offset = (1 - opacity) * stage.slideDistance;
  const centering = stage.align === "center" ? "translateX(-50%)" : "translateY(-50%)";
  const slide = stage.slideAxis === "x" ? `translateX(${offset}px)` : `translateY(${offset}px)`;
  return `${centering} ${slide}`;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeChapter = useRef(0);
  const reduceMotion = useRef(false);

  // The preloader streams the video into memory and hands over a blob URL, so
  // every currentTime seek below is served from RAM rather than the network.
  const { heroSrc, ready, notifyVideoReady } = useSiteLoader();

  // Runs on every smoothed scroll tick. Everything that moves is updated
  // straight on the DOM (transform/opacity only) — no React state in the
  // scroll path, so the hero never re-renders while scrolling.
  const handleProgress = useCallback((p: number) => {
    const wrap = videoWrapRef.current;
    if (wrap && !reduceMotion.current) {
      const { scaleEnd, driftEndPercent } = HERO_CONFIG.motion;
      wrap.style.transform = `translate3d(${driftEndPercent * p}%, 0, 0) scale(${
        1 + (scaleEnd - 1) * p
      })`;
    }

    HERO_STAGES.forEach((stage, i) => {
      const el = stageRefs.current[i];
      if (el) {
        const opacity = rangeOpacity(p, RANGES[i]);
        el.style.opacity = String(opacity);
        el.style.transform = stageTransform(stage, opacity);
      }
      const caption = captionRefs.current[i];
      if (caption) {
        const opacity = captionOpacity(p, RANGES[i]);
        caption.style.opacity = String(opacity);
        caption.style.transform = `translateY(${(1 - opacity) * 10}px)`;
      }
    });

    if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
    const active = chapterIndexAt(p, RANGES);
    if (active !== activeChapter.current) {
      activeChapter.current = active;
      labelRefs.current.forEach((label, i) => {
        if (label) label.dataset.active = i === active ? "true" : "false";
      });
    }
  }, []);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // The scroll trigger is only created once the preloader has fully exited and
  // scroll is unlocked, so the pin/scrub measurements are correct.
  useScrollScrub({
    trigger: sectionRef,
    video: videoRef,
    onProgress: handleProgress,
    enabled: ready,
    smoothing: HERO_CONFIG.smoothing,
    mapProgress: videoFractionAt,
  });

  // Some mobile browsers hold back video data until playback has been
  // initiated at least once; a muted play()-then-pause() lets the source load
  // (and fire loadeddata) while the preloader is still up.
  useEffect(() => {
    const video = videoRef.current;
    if (!heroSrc || !video) return;
    const played = video.play();
    if (played && typeof played.then === "function") {
      played.then(() => video.pause(), () => {});
    }
  }, [heroSrc]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-pin-section"
      style={
        {
          position: "relative",
          width: "100vw",
          maxWidth: "100%",
          margin: 0,
          padding: 0,
          background: "#2E2B26",
          // Section height comes from HERO_CONFIG via these (see globals.css).
          "--hero-scroll-desktop": `${HERO_CONFIG.scrollLengthVh.desktop}vh`,
          "--hero-scroll-mobile": `${HERO_CONFIG.scrollLengthVh.mobile}vh`,
        } as CSSProperties
      }
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* The wrapper takes the scale/drift so only the image moves, never the text. */}
        <div
          ref={videoWrapRef}
          style={{ position: "absolute", inset: 0, willChange: "transform" }}
        >
          <video
            ref={videoRef}
            src={heroSrc}
            muted
            playsInline
            preload="auto"
            poster="/images/hero-poster.jpg"
            onLoadedData={notifyVideoReady}
            onCanPlayThrough={notifyVideoReady}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#2E2B26",
            }}
          />
        </div>
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
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "128px 24px 0",
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
              className="hero-cta-row"
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

        {HERO_STAGES.map((stage, index) => (
          <div
            key={stage.heading}
            ref={(el) => {
              stageRefs.current[index] = el;
            }}
            style={{
              position: "absolute",
              ...stage.position,
              transform: stageTransform(stage, 0),
              opacity: 0,
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
            {/* Space is always reserved, so the caption fading in never shifts the layout. */}
            <span
              ref={(el) => {
                captionRefs.current[index] = el;
              }}
              style={{
                display: "block",
                margin: "20px 0 0",
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.78)",
                textShadow: "0 1px 10px rgba(0,0,0,0.6)",
                opacity: 0,
                transform: "translateY(10px)",
              }}
            >
              {stage.caption}
            </span>
          </div>
        ))}

        {/* Chapter indicator: thin vertical line with one segment per chapter,
            sized by how much scroll it gets. Labels hide on mobile. */}
        <div className="hero-chapters" aria-hidden="true">
          <div className="hero-chapters-track">
            <div ref={fillRef} className="hero-chapters-fill" />
            {RANGES.slice(1).map((range) => (
              <span
                key={range.start}
                className="hero-chapters-tick"
                style={{ top: `${range.start * 100}%` }}
              />
            ))}
          </div>
          <div className="hero-chapters-labels">
            {HERO_CONFIG.chapters.map((chapter, i) => (
              <span
                key={chapter.label}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="hero-chapter-label"
                data-active={i === 0 ? "true" : "false"}
                style={{ flexGrow: RANGES[i].end - RANGES[i].start, flexBasis: 0 }}
              >
                {chapter.label.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div
          className="scroll-hint"
          style={{
            position: "absolute",
            right: 42,
            top: "50%",
            transform: "translateY(-50%)",
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
