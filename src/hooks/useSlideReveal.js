import { useEffect } from "react";

/**
 * Scroll-scrubbed slide-in reveal, ported from wearebreakfast.com's own
 * collage-figure animation. Their main.bundle.js does this with GSAP
 * ScrollTrigger: a timeline scrubbed directly to scroll position (not
 * played once) that tweens each figure `.from({xPercent:-100, yPercent:100})`
 * to its resting place — e.g. `.collage-baconophone__media--hands` (their
 * hands-holding-mallets photo) slides in from off-screen down-left as you
 * scroll past `.home__middle__copy`. That's the exact effect asked for
 * here, applied to the keyboard photo. No GSAP dependency needed — this
 * uses the same rAF + getBoundingClientRect scroll-progress pattern
 * already used everywhere else in this codebase (see useScrollHeroClip.js),
 * so scrubbing and reversing on scroll-up both come for free.
 */
function smoothstep(p, start, end) {
  if (start === end) return p < start ? 0 : 1;
  const t = Math.min(1, Math.max(0, (p - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function progressFor(el) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const p = (vh - r.top) / (vh + r.height);
  return Math.min(1, Math.max(0, p));
}

export default function useSlideReveal(ref, { fromXPercent = -100, fromYPercent = 100 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.transform = "translate3d(0,0,0)";
      return;
    }

    let raf;
    const tick = () => {
      const p = smoothstep(progressFor(el), 0.15, 0.6);
      const x = fromXPercent * (1 - p);
      const y = fromYPercent * (1 - p);
      el.style.transform = `translate3d(${x}%, ${y}%, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [ref, fromXPercent, fromYPercent]);
}
