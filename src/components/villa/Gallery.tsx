"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gallery } from "@/lib/villa-data";
import { gsap, refreshWhenAssetsLoad } from "@/lib/gsap";

const pad = (n: number) => String(n).padStart(2, "0");
const TOTAL = pad(gallery.length);

/**
 * Gallery, three ways (layout lives in globals.css, motion lives here):
 * - Desktop: the section pins while vertical scroll slides the track sideways;
 *   each frame is revealed with a clip-path and its image drifts slower than
 *   the frame (inner parallax).
 * - Mobile: no pinning, a native horizontal swipe carousel (scroll-snap).
 * - prefers-reduced-motion: a plain static grid, nothing animated.
 * Only transform, opacity and clip-path are animated.
 */
export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Counter + progress line, written straight to the DOM (no React state).
    let shown = 1;
    const setProgress = (p: number) => {
      const progress = Math.min(Math.max(p, 0), 1);
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${progress})`;
      const index = Math.round(progress * (gallery.length - 1)) + 1;
      if (index !== shown && counterRef.current) {
        shown = index;
        counterRef.current.textContent = pad(index);
      }
    };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

      // The pin + scrub: the track moves by its total width minus the viewport.
      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        // `this` is the tween: GSAP can fire onUpdate while the ScrollTrigger is
        // still being created, before `slide` below has been assigned.
        onUpdate: function (this: gsap.core.Tween) {
          setProgress(this.progress());
        },
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      track.querySelectorAll<HTMLElement>(".hgallery-item").forEach((item) => {
        const frame = item.querySelector<HTMLElement>(".hgallery-frame");
        const inner = item.querySelector<HTMLElement>(".hgallery-parallax");

        // Clip-path reveal as the frame enters from the right. Frames already
        // on screen at the start are past their range, so they begin revealed.
        if (frame) {
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 100% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: item,
                containerAnimation: slide,
                start: "left 92%",
                end: "left 58%",
                scrub: true,
              },
            }
          );
        }

        // Inner parallax: the image travels less than its frame. The inner
        // layer is 116% wide (CSS), so +/-6% of it never exposes an edge.
        if (inner) {
          gsap.fromTo(
            inner,
            { xPercent: 6 },
            {
              xPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    });

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      // Native swipe carousel: nothing to animate, just mirror its position.
      const onScroll = () => {
        const max = track.scrollWidth - track.clientWidth;
        setProgress(max > 0 ? track.scrollLeft / max : 0);
      };
      track.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => track.removeEventListener("scroll", onScroll);
    });

    const stopRefresh = refreshWhenAssetsLoad();
    return () => {
      stopRefresh();
      mm.revert();
    };
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="hgallery">
      <div className="hgallery-head">
        <div>
          <span style={{ fontSize: 9.5, letterSpacing: "0.42em", color: "#A98A54" }}>
            05 — GALLERY
          </span>
          <h2
            className="heading-xl"
            style={{
              margin: "24px 0 0",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              lineHeight: 1.12,
            }}
          >
            Twelve rooms, one horizon.
          </h2>
        </div>
        <div className="hgallery-counter" aria-hidden="true">
          <span ref={counterRef}>01</span> / {TOTAL}
        </div>
      </div>

      <div ref={trackRef} className="hgallery-track">
        {gallery.map((item, i) => (
          <figure key={item.file} className="hgallery-item">
            <div className="hgallery-frame">
              <div className="hgallery-parallax">
                <Image
                  src={item.file}
                  alt={item.alt}
                  fill
                  loading={i < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 767px) 84vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="hgallery-scrim" />
              <figcaption className="hgallery-caption">{item.label}</figcaption>
            </div>
          </figure>
        ))}
      </div>

      <div className="hgallery-progress" aria-hidden="true">
        <div ref={lineRef} className="hgallery-progress-fill" />
      </div>
    </section>
  );
}
