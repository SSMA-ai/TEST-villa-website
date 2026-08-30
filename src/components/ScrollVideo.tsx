"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => setIsReady(true);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, [src]);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !isReady) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: scrollLength,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          video.currentTime = self.progress * video.duration;
        },
      });
    }, container);

    return () => ctx.revert();
  }, [isReady, scrollLength]);

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
