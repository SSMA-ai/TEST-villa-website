"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { useScrollScrub } from "@/hooks/useScrollScrub";
import { Reveal } from "./Reveal";

type RoomStoryProps = {
  id?: string;
  video: string;
  bgColor: string;
  gradient: string;
  align: "left" | "right";
  kicker: string;
  heading: string;
  body: string;
  tags: string[];
};

export function RoomStory({
  id,
  video,
  bgColor,
  gradient,
  align,
  kicker,
  heading,
  body,
  tags,
}: RoomStoryProps) {
  const contentJustify: CSSProperties["justifyContent"] =
    align === "left" ? "flex-start" : "flex-end";

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useScrollScrub({ trigger: sectionRef, video: videoRef });

  return (
    <section
      id={id}
      ref={sectionRef}
      style={{ position: "relative", height: "168vh", background: "#141310" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: bgColor,
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 11px)",
          }}
        />
        <video
          ref={videoRef}
          src={video}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: gradient }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: contentJustify,
            padding: "0 clamp(32px, 8vw, 140px)",
          }}
        >
          <Reveal
            durationMs={1150}
            translateY={30}
            style={{
              width: "min(520px, 100%)",
              padding: "46px 44px",
              background: "rgba(255,255,255,0.09)",
              backdropFilter: "blur(20px) saturate(1.2)",
              WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span style={{ fontSize: 9.5, letterSpacing: "0.42em", color: "rgba(255,255,255,0.6)" }}>
              {kicker}
            </span>
            <h2
              style={{
                margin: "22px 0 0",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: 42,
                lineHeight: 1.1,
                color: "#FFFFFF",
              }}
            >
              {heading}
            </h2>
            <p
              style={{
                margin: "22px 0 0",
                fontSize: 15,
                fontWeight: 300,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {body}
            </p>
            <div
              style={{
                display: "flex",
                gap: 30,
                marginTop: 30,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{ fontSize: 10.5, letterSpacing: "0.2em", color: "rgba(255,255,255,0.72)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
