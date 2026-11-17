/**
 * Hero scroll timeline — everything you may want to tweak lives in HERO_CONFIG.
 *
 * How it works: the hero is a tall sticky section. Scroll progress p (0..1)
 * is first smoothed (see `smoothing`), then mapped to a position in the video
 * through the `segments` table below, so important moments get more scroll
 * distance than calm ones. Text, captions and the chapter indicator are all
 * driven from that same smoothed p.
 */
export const HERO_CONFIG = {
  /** Total height of the hero section; the scrub covers this minus one viewport. */
  scrollLengthVh: { desktop: 800, mobile: 600 },

  /**
   * Seconds of "catch-up" lag between the scrollbar and the video (GSAP scrub).
   * Higher = heavier, floatier. Mobile is lighter so touch stays responsive.
   */
  smoothing: { desktop: 1.2, mobile: 0.8 },

  /**
   * Scroll->video mapping. Must run from 0 to the end of the video, in order,
   * with no gaps. `density` = how much scroll one second of video gets,
   * relative to calm (1). 2 = twice the scroll distance, 0.4 = pass quickly.
   * Times are seconds in hero-full.mp4 (14.125s: three clips, 0.5s crossfades).
   */
  segments: [
    { label: "Aerial approach (calm drift)", from: 0, to: 2.3, density: 1 },
    // The exterior clip contains a HARD CUT at ~2.46s (wide aerial -> terrace
    // shot). Passing it quickly keeps the pop short; set to 1 to linger on it.
    { label: "Cut to terrace (pass quickly)", from: 2.3, to: 2.62, density: 0.4 },
    { label: "Push-in toward the entrance", from: 2.62, to: 4.54, density: 2 },
    { label: "Crossfade exterior -> living", from: 4.54, to: 5.04, density: 2 },
    { label: "Living (calm)", from: 5.04, to: 9.08, density: 1 },
    { label: "Crossfade living -> bathroom", from: 9.08, to: 9.58, density: 2 },
    { label: "Bathroom (slow push-in, settle)", from: 9.58, to: 14.125, density: 1 },
  ] as { label: string; from: number; to: number; density: number }[],

  /**
   * Chapters shown in the left indicator and used as the text stages' ranges.
   * `endsAt` is a video time (seconds); the last chapter runs to the end.
   * Defaults sit at the crossfade midpoints.
   */
  chapters: [
    { label: "Exterior", endsAt: 4.79 },
    { label: "Living", endsAt: 9.33 },
    { label: "Bathroom", endsAt: null },
  ] as { label: string; endsAt: number | null }[],

  /**
   * Extra motion on the video so it keeps moving during slow segments.
   * Keep |driftEndPercent| <= (scaleEnd - 1) / 2 * 100 or the edges will show.
   */
  motion: { scaleEnd: 1.08, driftEndPercent: -3 },

  /** A text stage fades in/out over this fraction of its chapter's scroll range. */
  stageFade: 0.1,
  /** Secondary caption: visible between these fractions of its chapter (soft edges). */
  captionWindow: { from: 0.38, to: 0.78, soft: 0.08 },
};

// ---------------------------------------------------------------------------
// Pure helpers (no DOM). Everything below is derived from HERO_CONFIG.
// ---------------------------------------------------------------------------

const SEGMENTS = HERO_CONFIG.segments;
const DURATION = SEGMENTS[SEGMENTS.length - 1].to;

function validate() {
  let expectedFrom = 0;
  for (const s of SEGMENTS) {
    if (Math.abs(s.from - expectedFrom) > 1e-6 || s.to <= s.from || s.density <= 0) {
      throw new Error(
        `HERO_CONFIG.segments: "${s.label}" must start at ${expectedFrom}, end after it, and have density > 0.`
      );
    }
    expectedFrom = s.to;
  }
}
validate();

// Progress at which each segment starts (plus 1 at the end), by cumulative density-weighted length.
const WEIGHTS = SEGMENTS.map((s) => (s.to - s.from) * s.density);
const TOTAL_WEIGHT = WEIGHTS.reduce((a, b) => a + b, 0);
const PROGRESS_STARTS: number[] = [];
{
  let acc = 0;
  for (const w of WEIGHTS) {
    PROGRESS_STARTS.push(acc / TOTAL_WEIGHT);
    acc += w;
  }
  PROGRESS_STARTS.push(1);
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Scroll progress (0..1) -> position in the video as a fraction of its duration (0..1). */
export function videoFractionAt(p: number): number {
  const progress = clamp01(p);
  for (let i = 0; i < SEGMENTS.length; i++) {
    const start = PROGRESS_STARTS[i];
    const end = PROGRESS_STARTS[i + 1];
    if (progress <= end || i === SEGMENTS.length - 1) {
      const s = SEGMENTS[i];
      const local = end > start ? (progress - start) / (end - start) : 0;
      return (s.from + local * (s.to - s.from)) / DURATION;
    }
  }
  return 1;
}

/** Inverse of videoFractionAt for a time in seconds: video time -> scroll progress. */
export function progressAtVideoTime(seconds: number): number {
  const t = Math.min(Math.max(seconds, 0), DURATION);
  for (let i = 0; i < SEGMENTS.length; i++) {
    const s = SEGMENTS[i];
    if (t <= s.to || i === SEGMENTS.length - 1) {
      const local = (t - s.from) / (s.to - s.from);
      return PROGRESS_STARTS[i] + local * (PROGRESS_STARTS[i + 1] - PROGRESS_STARTS[i]);
    }
  }
  return 1;
}

export type Range = { start: number; end: number };

/** Each chapter's [start, end] in scroll progress. Contiguous, covering 0..1. */
export function chapterRanges(): Range[] {
  const ranges: Range[] = [];
  let start = 0;
  for (const c of HERO_CONFIG.chapters) {
    const end = c.endsAt === null ? 1 : progressAtVideoTime(c.endsAt);
    ranges.push({ start, end });
    start = end;
  }
  return ranges;
}

/** Index of the chapter containing progress p. */
export function chapterIndexAt(p: number, ranges: Range[]): number {
  for (let i = 0; i < ranges.length; i++) {
    if (p < ranges[i].end) return i;
  }
  return ranges.length - 1;
}

/** Fades in over the first `fade` of [start,end], holds, fades out over the last `fade`. */
export function rangeOpacity(p: number, { start, end }: Range, fade = HERO_CONFIG.stageFade): number {
  const f = (end - start) * fade;
  if (p <= start || p >= end) return 0;
  if (p < start + f) return (p - start) / f;
  if (p > end - f) return (end - p) / f;
  return 1;
}

/** Secondary caption: visible in the middle of its chapter, with soft edges. */
export function captionOpacity(p: number, { start, end }: Range): number {
  const { from, to, soft } = HERO_CONFIG.captionWindow;
  const local = (p - start) / (end - start);
  if (local <= from || local >= to) return 0;
  if (local < from + soft) return (local - from) / soft;
  if (local > to - soft) return (to - local) / soft;
  return 1;
}
