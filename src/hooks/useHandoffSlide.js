import { useEffect } from "react";

/** Slides the human/robot hand halves together once the Handoff card scrolls into view. */
export default function useHandoffSlide(rootRef) {
  useEffect(() => {
    const root = rootRef.current || document;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const handoff = root.querySelector(".handoff-split");
    if (!handoff) return;

    if (!("IntersectionObserver" in window) || reduced) {
      handoff.classList.add("in");
      return;
    }

    const hio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            hio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    hio.observe(handoff);

    return () => hio.disconnect();
  }, [rootRef]);
}
