"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap, refreshWhenAssetsLoad } from "@/lib/gsap";

/**
 * A paragraph whose words start dim and light up one by one, scrubbed to
 * scroll while the enclosing section moves through the viewport.
 *
 * Accessibility: the paragraph carries the full text as its aria-label and
 * the split word spans are aria-hidden; a visually hidden copy of the text
 * keeps it readable for assistive tech that ignores aria-label on a paragraph.
 *
 * Only opacity is animated. With prefers-reduced-motion nothing is animated
 * and the words stay at full opacity (see .scroll-fill-word in globals.css).
 */
export function ScrollFillText({ text, style }: { text: string; style?: CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const wordEls = el.querySelectorAll<HTMLElement>(".scroll-fill-word");
    const trigger = el.closest("section") ?? el;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // One tween per word, each lasting 1 unit and starting 1 unit after the
      // previous, so words light up strictly one at a time across the scroll.
      gsap.to(wordEls, {
        opacity: 1,
        ease: "none",
        duration: 1,
        stagger: 1,
        scrollTrigger: { trigger, start: "top 75%", end: "bottom 45%", scrub: true },
      });
    });

    const stopRefresh = refreshWhenAssetsLoad();
    return () => {
      stopRefresh();
      mm.revert();
    };
  }, []);

  return (
    <p ref={ref} aria-label={text} style={style}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="scroll-fill-word">{word}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}
