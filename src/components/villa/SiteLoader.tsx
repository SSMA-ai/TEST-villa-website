"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Preloader } from "./Preloader";

/** The preloader never flashes by faster than this, even on a warm cache. */
const MIN_MS = 2500;
/** Safety cap: after this the site opens anyway and the video falls back to its normal src. */
const MAX_MS = 15000;
/** Same breakpoint the CSS layout uses, so the video choice matches the layout. */
const MOBILE_QUERY = "(max-width: 767px)";
const VIDEO_DESKTOP = "/videos/hero-full.mp4";
const VIDEO_MOBILE = "/videos/hero-full-mobile.mp4";
const IMAGES = ["/images/exterior.jpg", "/images/living-kitchen.jpg", "/images/bathroom.jpg"];
/** Share of the progress bar owned by the video; the images take the rest. */
const VIDEO_WEIGHT = 0.85;
/** Used for the bar only when the server sends no Content-Length. */
const UNKNOWN_SIZE_GUESS = 5_000_000;
/** Exponential catch-up rate of the displayed value toward the real one, per second. */
const SMOOTHING_RATE = 5;

type Phase = "loading" | "exiting" | "done";

type SiteLoaderValue = {
  /** Blob URL once downloaded (or the plain URL on fallback). Undefined while loading. */
  heroSrc: string | undefined;
  /** True once the preloader is fully gone and scroll is unlocked. */
  ready: boolean;
  /** The hero <video> calls this when it has data (loadeddata / canplaythrough). */
  notifyVideoReady: () => void;
};

const SiteLoaderContext = createContext<SiteLoaderValue>({
  heroSrc: undefined,
  ready: true,
  notifyVideoReady: () => {},
});

export function useSiteLoader() {
  return useContext(SiteLoaderContext);
}

export function SiteLoader({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [heroSrc, setHeroSrc] = useState<string | undefined>(undefined);

  // Everything the animation loop reads lives in refs so progress updates
  // never trigger React renders.
  const target = useRef({ video: 0, images: 0 }); // real progress, 0..1 each
  const shown = useRef(0); // displayed progress, 0..1
  const flags = useRef({ videoReady: false, forceOpen: false });
  const startedAt = useRef(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const notifyVideoReady = useCallback(() => {
    flags.current.videoReady = true;
  }, []);

  // 1) Real loading: stream the hero video into memory, warm the key images.
  useEffect(() => {
    startedAt.current = performance.now();
    target.current = { video: 0, images: 0 };
    shown.current = 0;
    flags.current = { videoReady: false, forceOpen: false };
    const controller = new AbortController();
    const videoUrl = window.matchMedia(MOBILE_QUERY).matches ? VIDEO_MOBILE : VIDEO_DESKTOP;
    let disposed = false;
    let blobUrl: string | undefined;

    const fallbackToNormalSrc = () => {
      if (disposed) return;
      target.current.video = 1;
      setHeroSrc((current) => current ?? videoUrl);
    };

    const loadVideo = async () => {
      try {
        const response = await fetch(videoUrl, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const total = Number(response.headers.get("Content-Length")) || 0;
        const type = response.headers.get("Content-Type") || "video/mp4";
        const reader = response.body?.getReader();

        let blob: Blob;
        if (reader) {
          const chunks: BlobPart[] = [];
          let received = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.byteLength;
            target.current.video = total
              ? Math.min(received / total, 1)
              : Math.min(received / UNKNOWN_SIZE_GUESS, 0.95);
          }
          blob = new Blob(chunks, { type });
        } else {
          blob = await response.blob(); // no streaming support: bar jumps at the end
        }

        if (disposed) return;
        // Every currentTime seek is now served from memory, not the network.
        blobUrl = URL.createObjectURL(blob);
        target.current.video = 1;
        setHeroSrc(blobUrl);
      } catch {
        // Network error (or our own abort): fall back to the normal src.
        if (!disposed) fallbackToNormalSrc();
      }
    };
    void loadVideo();

    // Warm the key images. Progress counts load OR error, so one broken image
    // can't hold the loader hostage. (Deliberately not gated on decode(): it can
    // stall on a detached image, and the preloader must never wait on that.)
    let imagesDone = 0;
    const warmed = IMAGES.map((src) => {
      const img = new Image();
      img.decoding = "async";
      const mark = () => {
        imagesDone += 1;
        target.current.images = imagesDone / IMAGES.length;
      };
      img.onload = () => {
        mark();
        img.decode?.().catch(() => {}); // best effort, never awaited
      };
      img.onerror = mark;
      img.src = src;
      return img;
    });

    const safetyTimeout = window.setTimeout(() => {
      controller.abort();
      target.current.images = 1;
      flags.current.forceOpen = true;
      shown.current = 1;
      fallbackToNormalSrc();
    }, MAX_MS);

    return () => {
      disposed = true;
      window.clearTimeout(safetyTimeout);
      controller.abort();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      warmed.length = 0;
    };
  }, []);

  // 2) Drive the bar + counter and decide when to open. Ticks on rAF for
  //    smoothness and on an interval as well, so a backgrounded tab (where
  //    rAF is paused) still opens on time.
  useEffect(() => {
    if (phase !== "loading") return;
    let raf = 0;
    let last = performance.now();

    const step = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 1);
      last = now;

      const { video, images } = target.current;
      const goal = flags.current.forceOpen ? 1 : video * VIDEO_WEIGHT + images * (1 - VIDEO_WEIGHT);
      let next = goal - (goal - shown.current) * Math.exp(-SMOOTHING_RATE * dt);
      if (goal - next < 0.002) next = goal;
      shown.current = next;

      if (fillRef.current) fillRef.current.style.transform = `scaleX(${next})`;
      if (percentRef.current) percentRef.current.textContent = `${Math.round(next * 100)}%`;

      const elapsed = now - startedAt.current;
      const videoOk = flags.current.videoReady || flags.current.forceOpen;
      if (next >= 1 && elapsed >= MIN_MS && videoOk) {
        setPhase("exiting");
        return false;
      }
      return true;
    };

    const loop = () => {
      if (step()) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const interval = window.setInterval(() => {
      if (!step()) window.clearInterval(interval);
    }, 250);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
    };
  }, [phase]);

  // 3) Lock scrolling while the preloader is on screen (wheel/touch too, since
  //    overflow:hidden alone doesn't stop touch scrolling on iOS).
  useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [phase]);

  // 4) Exit finishes on the panel's transitionend; the timer is a backstop for
  //    when transitions don't run (hidden tab, reduced-motion overrides).
  const finishExit = useCallback(() => setPhase("done"), []);
  useEffect(() => {
    if (phase !== "exiting") return;
    const backstop = window.setTimeout(finishExit, 1800);
    return () => window.clearTimeout(backstop);
  }, [phase, finishExit]);

  const value = useMemo<SiteLoaderValue>(
    () => ({ heroSrc, ready: phase === "done", notifyVideoReady }),
    [heroSrc, phase, notifyVideoReady]
  );

  return (
    <SiteLoaderContext.Provider value={value}>
      {children}
      {phase !== "done" && (
        <Preloader
          fillRef={fillRef}
          percentRef={percentRef}
          exiting={phase === "exiting"}
          onExited={finishExit}
        />
      )}
    </SiteLoaderContext.Provider>
  );
}
