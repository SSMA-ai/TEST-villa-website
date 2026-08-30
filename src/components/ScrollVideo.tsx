"use client";

import { useRef } from "react";
import { useScrollScrub } from "@/hooks/useScrollScrub";

type ScrollVideoProps = {
  src: string;
  className?: string;
  /** How long the video stays pinned while scrolling, e.g. "+=200%". */
  scrollLength?: string;
};

export function ScrollVideo({
  src,
  className,
  scrollLength = "+=200%",
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useScrollScrub({
    trigger: containerRef,
    video: videoRef,
    start: "top top",
    end: scrollLength,
    pin: true,
  });

  return (
    <div ref={containerRef} className={className}>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
