import { useEffect } from "react";

/**
 * Vanilla port of the SmoothScrollHero React component: framer-motion's
 * useScroll/useTransform mapped scrollY -> clip-path polygon (25% -> 0% /
 * 75% -> 100%) and background-size (170% -> 100%) over a fixed
 * scrollHeight range. Here `progress` is computed per element from its
 * own position in the viewport (getBoundingClientRect, which already
 * reflects useLerpScroll's transform), so every `.scroll-hero-fill`
 * element gets its own independent 0-1 reveal as it crosses the screen,
 * rather than one global scrollY threshold tied to a single hero.
 */
const INITIAL_CLIP = 25;
const FINAL_CLIP = 75;
const MIN_SCALE = 1.7;
const MAX_SCALE = 1;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function progressFor(el) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const p = (vh - r.top) / (vh + r.height);
  return Math.min(1, Math.max(0, p));
}

export default function useScrollHeroClip(rootRef) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const root = rootRef.current || document;
    const els = Array.from(root.querySelectorAll(".scroll-hero-fill"));
    if (!els.length) return;

    let raf;
    const tick = () => {
      els.forEach((el) => {
        const p = progressFor(el);
        const clipStart = lerp(INITIAL_CLIP, 0, p);
        const clipEnd = lerp(FINAL_CLIP, 100, p);
        el.style.clipPath = `polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;
        const scale = lerp(MIN_SCALE, MAX_SCALE, p);
        el.querySelectorAll(":scope > img, :scope > video, :scope > .handoff-split img").forEach(
          (media) => {
            media.style.transform = `scale(${scale})`;
          }
        );
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [rootRef]);
}
