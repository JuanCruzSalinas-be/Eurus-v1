import { useEffect } from "react";

/**
 * Ready for whenever headline copy comes back: wrap each visual line in
 * `<span class="line-mask"><span>Text</span></span>` inside a `.lines`
 * container, and this splits it into per-word masks that cascade in
 * ~30ms apart (matching neuemontreal.com's own reveal timing) once the
 * heading scrolls into view. No-ops harmlessly if there are no `.lines`
 * elements yet.
 */
export default function useLineWordReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current || document;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lineEls = root.querySelectorAll(".lines");
    if (!lineEls.length) return;

    lineEls.forEach((linesEl) => {
      let wordIndex = 0;
      linesEl.querySelectorAll(".line-mask > span").forEach((lineSpan) => {
        const words = lineSpan.textContent.split(" ");
        lineSpan.innerHTML = "";
        words.forEach((word, i) => {
          const mask = document.createElement("span");
          mask.className = "word-mask";
          const inner = document.createElement("span");
          inner.className = "word-inner";
          inner.textContent = word;
          inner.style.transitionDelay = Math.min(wordIndex * 30, 570) + "ms";
          mask.appendChild(inner);
          lineSpan.appendChild(mask);
          if (i < words.length - 1) lineSpan.appendChild(document.createTextNode(" "));
          wordIndex++;
        });
      });
    });

    if (!("IntersectionObserver" in window) || reduced) {
      lineEls.forEach((el) => el.classList.add("in"));
      return;
    }

    const lio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            lio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    lineEls.forEach((el) => lio.observe(el));

    return () => lio.disconnect();
  }, [rootRef]);
}
