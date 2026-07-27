import { useEffect } from "react";

/**
 * Fades + rises every `.photo-card` (and `.partners-strip`, `.section-head`,
 * kept for whenever those return) into place the first time it crosses
 * into the viewport. Mirrors the original vanilla `.reveal`/`.in` toggle.
 */
export default function useCardReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current || document;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = root.querySelectorAll(
      ".section-head, .partners-strip, .cta-block, .photo-card"
    );

    if (!("IntersectionObserver" in window) || reduced) {
      return;
    }

    els.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [rootRef]);
}
