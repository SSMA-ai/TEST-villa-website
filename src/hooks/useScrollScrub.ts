"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Same breakpoint the CSS layout and the video-source choice use. */
const MOBILE_QUERY = "(max-width: 767px)";

type UseScrollScrubOptions = {
  trigger: RefObject<HTMLElement | null>;
  video: RefObject<HTMLVideoElement | null>;
  /** ScrollTrigger start position relative to `trigger`. */
  start?: string;
  /** ScrollTrigger end position relative to `trigger`. */
  end?: string;
  /** Whether GSAP should pin `trigger` itself (leave false if it's already CSS `position: sticky`). */
  pin?: boolean;
  /**
   * Called with 0-1 progress (smoothed, when `smoothing` is set) on the same
   * rAF-batched tick as the video seek.
   */
  onProgress?: (progress: number) => void;
  /**
   * Hold off creating the ScrollTrigger until true (e.g. while a preloader
   * covers the page), so the pin/scrub measurements are taken against the
   * final, unlocked layout. Defaults to true.
   */
  enabled?: boolean;
  /**
   * Seconds of catch-up lag between scroll and video (a number, or one per
   * viewport class). GSAP only smooths a scrub that drives an *animation*, so
   * when this is set progress comes from a proxy tween linked to the
   * ScrollTrigger and everything downstream uses that smoothed value. Leave
   * unset for 1:1 tracking.
   */
  smoothing?: number | { desktop: number; mobile: number };
  /** Maps (smoothed) progress to a 0-1 position in the video. Defaults to identity. */
  mapProgress?: (progress: number) => number;
};

export function useScrollScrub({
  trigger,
  video,
  start = "top top",
  end = "bottom bottom",
  pin = false,
  onProgress,
  enabled = true,
  smoothing,
  mapProgress,
}: UseScrollScrubOptions) {
  // Primitives, so an inline `{desktop, mobile}` object can't re-run the effect.
  const smoothDesktop = typeof smoothing === "object" ? smoothing.desktop : smoothing;
  const smoothMobile = typeof smoothing === "object" ? smoothing.mobile : smoothing;

  useEffect(() => {
    if (!enabled) return;
    const triggerEl = trigger.current;
    const videoEl = video.current;
    if (!triggerEl || !videoEl) return;

    let scrollTrigger: ScrollTrigger | undefined;
    let proxyTween: gsap.core.Tween | undefined;
    let cancelled = false;
    // Pin/layout engage on schedule regardless, but actual seeking is held
    // off until the browser thinks it can play through without further
    // buffering — on a real network (unlike localhost) a large video isn't
    // fully downloaded yet when scroll starts, and seeking into unbuffered
    // ranges just stalls on whatever frame was last decoded. Until ready,
    // the video holds its primed first frame instead of looking broken.
    let bufferedEnough = false;
    let readyTimeout: number | undefined;
    const markReady = () => {
      if (bufferedEnough) return;
      bufferedEnough = true;
      window.clearTimeout(readyTimeout);
      videoEl.removeEventListener("canplaythrough", markReady);
    };

    // Imperative DOM control via ref.current — the intended use of refs, not
    // React state — so these mutations are intentional despite the lint rule.
    const startScrub = () => {
      if (cancelled) return;
      // A tiny nonzero currentTime forces the browser to decode and paint a
      // frame immediately, instead of showing a blank video before scrolling starts.
      videoEl.currentTime = 0.01;

      if (videoEl.readyState >= 4) {
        markReady(); // HAVE_ENOUGH_DATA already
      } else {
        videoEl.addEventListener("canplaythrough", markReady);
        // canplaythrough can be inconsistent across browsers/hosts for large
        // files — don't leave scrubbing permanently frozen if it never fires.
        readyTimeout = window.setTimeout(markReady, 6000);
      }

      const apply = (progress: number) => {
        if (!bufferedEnough || !videoEl.duration) return;
        const fraction = mapProgress ? mapProgress(progress) : progress;
        const targetTime = fraction * videoEl.duration;
        // Skip the seek if the target frame hasn't meaningfully changed
        // since the last tick — avoids redundant no-op seeks.
        if (Math.abs(videoEl.currentTime - targetTime) > 1 / 48) {
          videoEl.currentTime = targetTime;
        }
        onProgress?.(progress);
      };

      const smooth = window.matchMedia(MOBILE_QUERY).matches ? smoothMobile : smoothDesktop;

      if (smooth) {
        // Damped path: a numeric `scrub` only smooths an attached animation,
        // so tween a proxy 0 -> 1 (linear) under the ScrollTrigger and read
        // the eased value from it. scrub batches updates through GSAP's own
        // requestAnimationFrame ticker rather than raw scroll events.
        const proxy = { p: 0 };
        proxyTween = gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => apply(proxy.p),
          scrollTrigger: { trigger: triggerEl, start, end, pin, scrub: smooth },
        });
        scrollTrigger = proxyTween.scrollTrigger;
      } else {
        scrollTrigger = ScrollTrigger.create({
          trigger: triggerEl,
          start,
          end,
          pin,
          scrub: true, // 1:1 with the scrollbar
          onUpdate: (self) => apply(self.progress),
        });
      }

      // The video's metadata is ready by now (setup waits for loadeddata), so
      // re-measure every trigger against the settled layout; again once web
      // fonts are in, since late font swaps can shift positions.
      ScrollTrigger.refresh();
      void document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
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
      window.clearTimeout(readyTimeout);
      videoEl.removeEventListener("loadeddata", setup);
      videoEl.removeEventListener("canplaythrough", markReady);
      proxyTween?.kill();
      scrollTrigger?.kill();
    };
  }, [
    trigger,
    video,
    start,
    end,
    pin,
    onProgress,
    enabled,
    smoothDesktop,
    smoothMobile,
    mapProgress,
  ]);
}
