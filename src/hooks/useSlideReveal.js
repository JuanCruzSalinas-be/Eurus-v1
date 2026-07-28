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
// Ease-out cubic-ish: the figure should glide in and settle softly
// (decelerating into place), the way wearebreakfast.com's own
// GSAP-tweened collage figures do, rather than easing into and out of
// the motion symmetrically.
function easeOut(p, start, end) {
  if (start === end) return p < start ? 0 : 1;
  const t = Math.min(1, Math.max(0, (p - start) / (end - start)));
  return 1 - Math.pow(1 - t, 1.6);
}

// Measured against `rootRef` — a stable, untransformed wrapper — not the
// element being animated. Measuring the transformed element itself would
// feed the animation's own offset back into the position used to drive
// it (its "top" shifts as the transform shrinks), compounding with real
// scroll velocity into a reveal that accelerates unnaturally instead of
// tracking scroll cleanly.
//
// p is NOT clamped to a 0 floor here (only capped at 1): letting it go
// negative while the element is still below the viewport, combined with
// a negative `start` in easeOut below, means the reveal begins easing in
// gradually before the element even reaches the bottom of the screen,
// so it's already partway revealed the moment it becomes visible instead
// of popping in from a hard-clamped standing start.
//
// p=0.5 always lands exactly at the midpoint of the window where the
// element is most fully in frame — top in [0, vh-height] maps to p in
// [height/(vh+height), vh/(vh+height)], and that range is centered on
// 0.5 no matter the element's height — so ending the reveal there
// settles it right as the user reaches the part of the scroll where the
// image is as fully visible as it'll get.
function progressFor(el) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const p = (vh - r.top) / (vh + r.height);
  return Math.min(1, p);
}

export default function useSlideReveal(rootRef, { fromXPercent = -100, fromYPercent = 100 } = {}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const target = root.querySelector("img") || root;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      target.style.transform = "translate3d(0,0,0)";
      return;
    }

    let raf;
    const tick = () => {
      const p = easeOut(progressFor(root), -0.3, 0.5);
      const x = fromXPercent * (1 - p);
      const y = fromYPercent * (1 - p);
      target.style.transform = `translate3d(${x}%, ${y}%, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [rootRef, fromXPercent, fromYPercent]);
}
