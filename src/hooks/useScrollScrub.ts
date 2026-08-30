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
};

export function useScrollScrub({
  trigger,
  video,
  start = "top top",
  end = "bottom bottom",
  pin = false,
}: UseScrollScrubOptions) {
  useEffect(() => {
    const triggerEl = trigger.current;
    const videoEl = video.current;
    if (!triggerEl || !videoEl) return;

    let scrollTrigger: ScrollTrigger | undefined;

    // Imperative DOM control via ref.current — the intended use of refs, not
    // React state — so these mutations are intentional despite the lint rule.
    const setup = () => {
      // eslint-disable-next-line react-hooks/immutability
      videoEl.pause();
      // A tiny nonzero currentTime forces the browser to decode and paint a
      // frame immediately, instead of showing a blank video before scrolling starts.
      videoEl.currentTime = 0.01;

      scrollTrigger = ScrollTrigger.create({
        trigger: triggerEl,
        start,
        end,
        pin,
        scrub: true,
        onUpdate: (self) => {
          if (videoEl.duration) {
            videoEl.currentTime = self.progress * videoEl.duration;
          }
        },
      });
    };

    if (videoEl.readyState >= 1) {
      setup();
    } else {
      videoEl.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => {
      videoEl.removeEventListener("loadedmetadata", setup);
      scrollTrigger?.kill();
    };
  }, [trigger, video, start, end, pin]);
}
