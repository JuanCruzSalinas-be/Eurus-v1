import { useEffect } from "react";

/**
 * A Lenis-style eased scroll: the real page scrolls a 1px-wide spacer to
 * get native scrollbar/wheel/touch physics, while `contentRef` (fixed,
 * full width) is translated toward that scroll position with a lerp each
 * frame instead of snapping straight to it.
 */
export default function useLerpScroll(contentRef, spacerRef) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      reduced ||
      !window.matchMedia("(pointer:fine)").matches ||
      !window.matchMedia("(min-width:781px)").matches
    ) {
      return;
    }

    const html = document.documentElement;
    const content = contentRef.current;
    const spacer = spacerRef.current;
    if (!content || !spacer) return;

    let current = window.scrollY;
    let target = window.scrollY;
    let raf;

    const resize = () => {
      spacer.style.height = content.getBoundingClientRect().height + "px";
    };
    window.addEventListener("resize", resize);
    window.addEventListener("load", resize);
    const ro = new ResizeObserver(resize);
    ro.observe(content);
    resize();

    html.classList.add("has-smooth-scroll");

    const onScroll = () => {
      target = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      current += (target - current) * 0.09;
      if (Math.abs(target - current) < 0.05) current = target;
      content.style.transform = `translateY(${-current}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      html.classList.remove("has-smooth-scroll");
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", resize);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
      content.style.transform = "";
    };
  }, [contentRef, spacerRef]);
}
