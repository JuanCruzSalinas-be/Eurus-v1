import { useEffect } from "react";

/**
 * Vanilla scroll-linked animation for the hand-meet section, same shape as
 * useScrollHeroClip: progress is derived every frame from the section's own
 * getBoundingClientRect (not an IntersectionObserver "in" class), so
 * scrolling back up naturally unwinds every part of it for free.
 *
 * 0 -> TOUCH_AT of progress: each hand eases in from its off-screen corner
 * to the meeting point at center. TOUCH_AT is set to 0.5 because progressFor
 * hits exactly 0.5 when the section's top edge lines up with the viewport's
 * top edge — since the section is 100vh tall, that's the single scroll
 * position where it exactly fills the screen top-to-bottom with nothing
 * clipped. So the touch always lands on the one frame where the user can
 * see the whole section, not a half-scrolled sliver of it. The instant they
 * touch (p crosses TOUCH_AT), the hands, the background, and the optional
 * .handoff-meet-copy headline all snap instantly — hands to hidden,
 * background to black, copy to visible — no fade, a hard cut tied
 * directly to scroll position (still fully reversible: scrolling back
 * below TOUCH_AT snaps everything straight back).
 */
const TOUCH_AT = 0.5;
const DEEP = [143, 216, 255]; // matches --deep (#8fd8ff) — light blue, not dark
const BLACK = [0, 0, 0];

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

function lerpColor(a, b, t) {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

export default function useHandMeetScroll(rootRef, { onTouchChange } = {}) {
  useEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    const human = section.querySelector(".handoff-hand-human");
    const ai = section.querySelector(".handoff-hand-ai");
    const copy = section.querySelector(".handoff-meet-copy");
    if (!human || !ai) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      human.style.transform = "translate3d(0,0,0)";
      ai.style.transform = "translate3d(0,0,0)";
      human.style.opacity = "0";
      ai.style.opacity = "0";
      if (copy) copy.style.opacity = "1";
      section.style.backgroundColor = lerpColor(DEEP, BLACK, 1);
      if (onTouchChange) onTouchChange(true);
      return;
    }

    let raf;
    let lastTouched = false;
    const tick = () => {
      const p = progressFor(section);
      const travel = smoothstep(p, 0, TOUCH_AT);
      const touched = p >= TOUCH_AT;

      const humanX = (1 - travel) * -60;
      const humanY = (1 - travel) * 40;
      human.style.transform = `translate3d(${humanX}vw, ${humanY}vh, 0)`;
      human.style.opacity = touched ? "0" : "1";

      const aiX = (1 - travel) * 60;
      const aiY = (1 - travel) * -40;
      ai.style.transform = `translate3d(${aiX}vw, ${aiY}vh, 0)`;
      ai.style.opacity = touched ? "0" : "1";

      if (copy) copy.style.opacity = touched ? "1" : "0";

      section.style.backgroundColor = lerpColor(DEEP, BLACK, touched ? 1 : 0);

      if (touched !== lastTouched) {
        lastTouched = touched;
        if (onTouchChange) onTouchChange(touched);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [rootRef, onTouchChange]);
}
