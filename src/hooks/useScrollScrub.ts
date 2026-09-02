"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";

type UseScrollScrubOptions = {
  trigger: RefObject<HTMLElement | null>;
  video: RefObject<HTMLVideoElement | null>;
  /** ScrollTrigger start position relative to `trigger`. */
  start?: string;
  /** ScrollTrigger end position relative to `trigger`. */
  end?: string;
  /** Whether GSAP should pin `trigger` itself (leave false if it's already CSS `position: sticky`). */
  pin?: boolean;
  /** Called with 0-1 scroll progress through the trigger on the same rAF-batched tick as the video seek. */
  onProgress?: (progress: number) => void;
};

export function useScrollScrub({
  trigger,
  video,
  start = "top top",
  end = "bottom bottom",
  pin = false,
  onProgress,
}: UseScrollScrubOptions) {
  useEffect(() => {
    const triggerEl = trigger.current;
    const videoEl = video.current;
    if (!triggerEl || !videoEl) return;

    let scrollTrigger: ScrollTrigger | undefined;
    let cancelled = false;

    // Imperative DOM control via ref.current — the intended use of refs, not
    // React state — so these mutations are intentional despite the lint rule.
    const startScrub = () => {
      if (cancelled) return;
      // A tiny nonzero currentTime forces the browser to decode and paint a
      // frame immediately, instead of showing a blank video before scrolling starts.
      videoEl.currentTime = 0.01;

      // On touch devices, a small amount of GSAP's built-in scrub smoothing
      // (lag in seconds, rather than 1:1 tracking) absorbs the bursty deltas
      // touch-momentum scrolling produces, instead of snapping to every one.
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      scrollTrigger = ScrollTrigger.create({
        trigger: triggerEl,
        start,
        end,
        pin,
        // scrub batches onUpdate through GSAP's own requestAnimationFrame
        // ticker rather than firing per raw scroll event.
        scrub: isMobile ? 0.35 : true,
        onUpdate: (self) => {
          if (!videoEl.duration) return;
          const targetTime = self.progress * videoEl.duration;
          // Skip the seek if the target frame hasn't meaningfully changed
          // since the last tick — avoids redundant no-op seeks.
          if (Math.abs(videoEl.currentTime - targetTime) > 1 / 48) {
            videoEl.currentTime = targetTime;
          }
          onProgress?.(self.progress);
        },
      });
    };

    const setup = () => {
      // Mobile Safari (and possibly others) won't decode/paint any frame in
      // response to a bare `currentTime` seek until the video has actually
      // entered the "playing" state once — it just stays black. A muted
      // video is allowed to autoplay via JS without a user gesture, so
      // play()-then-pause() "primes" the decoder before scroll takes over.
      const playResult = videoEl.play();
      if (playResult && typeof playResult.then === "function") {
        playResult.then(
          () => {
            videoEl.pause();
            startScrub();
          },
          () => {
            // play() can reject (e.g. blocked); the video was never actually
            // playing either way, so just proceed.
            startScrub();
          }
        );
      } else {
        videoEl.pause();
        startScrub();
      }
    };

    if (videoEl.readyState >= 2) {
      setup();
    } else {
      videoEl.addEventListener("loadeddata", setup, { once: true });
    }

    return () => {
      cancelled = true;
      videoEl.removeEventListener("loadeddata", setup);
      scrollTrigger?.kill();
    };
  }, [trigger, video, start, end, pin, onProgress]);
}
