import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Re-measure every ScrollTrigger once web fonts and the page's images have
 * loaded (late font swaps and image decodes can shift positions). Returns a
 * cleanup function.
 */
export function refreshWhenAssetsLoad(): () => void {
  const refresh = () => ScrollTrigger.refresh();
  void document.fonts?.ready.then(refresh);
  if (document.readyState !== "complete") {
    window.addEventListener("load", refresh, { once: true });
  }
  return () => window.removeEventListener("load", refresh);
}

export { gsap, ScrollTrigger };
