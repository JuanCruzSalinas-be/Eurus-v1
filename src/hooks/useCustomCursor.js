import { useEffect } from "react";

/**
 * neuemontreal.com sets cursor:none site-wide and drives its own pointer;
 * mirrored here, gated to fine-pointer + motion-allowed devices. Uses
 * event delegation on document for hover targets so it keeps working as
 * cards mount/unmount, instead of binding listeners to a fixed node list.
 */
export default function useCustomCursor() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !window.matchMedia("(pointer:fine)").matches) return;

    const html = document.documentElement;
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    html.classList.add("custom-cursor");

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const HOVER_SELECTOR =
      "a, button, .partner-card, .partners-carousel-tile, .marquee-scroller-tile, .parallax-img-inner, .sem-box, .cta-mark";
    const onOver = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        dot.classList.add("hovering");
        ring.classList.add("hovering");
      }
    };
    const onOut = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        dot.classList.remove("hovering");
        ring.classList.remove("hovering");
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      html.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);
}
