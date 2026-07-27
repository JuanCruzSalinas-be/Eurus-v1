import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Adapted from the ScrollExpandMedia component: a small centered media box
 * grows to fill most of its section as the user scrolls, with a dimmed
 * full-bleed copy of the same media behind it that fades out as the
 * foreground box grows.
 *
 * The original hijacks `window` wheel/scroll/touch unconditionally — fine
 * for a single page-top hero, but here we're rendering one of these per
 * gallery photo. So each instance only takes over scroll while it is the
 * one centered in the viewport (`isActive`, via IntersectionObserver), and
 * once it reaches full expansion it locks open permanently and stops
 * intercepting anything — scroll just carries on to the next card, which
 * then becomes the active one.
 */
export default function ScrollExpandMedia({ mediaType = "image", mediaSrc, bgSrc }) {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lockedOpen, setLockedOpen] = useState(false);
  const touchStartYRef = useRef(0);

  // Only this card's own visibility decides whether it's the active gate —
  // no shared coordinator needed between cards.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setIsActive(e.isIntersecting)),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive || lockedOpen) return;

    const advance = (delta, factor) => {
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + delta * factor, 0), 1);
        if (next >= 1) setLockedOpen(true);
        return next;
      });
    };

    const onWheel = (e) => {
      e.preventDefault();
      advance(e.deltaY, 0.0012);
    };
    const onTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (!touchStartYRef.current) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;
      e.preventDefault();
      advance(deltaY, 0.006);
      touchStartYRef.current = touchY;
    };
    const onTouchEnd = () => {
      touchStartYRef.current = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isActive, lockedOpen]);

  const boxWidth = 35 + scrollProgress * 65;
  const boxHeight = 40 + scrollProgress * 60;

  return (
    <section ref={sectionRef} className="sem-section">
      <motion.div
        className="sem-bg"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 - scrollProgress }}
        transition={{ duration: 0.1 }}
      >
        {/* Background is always a plain image, independent of the
            foreground's mediaType — matches the original component, where
            bgImageSrc was always rendered through next/image regardless of
            whether the expanding media was a video. */}
        <img src={bgSrc} alt="" />
        <div className="sem-bg-scrim" />
      </motion.div>

      <div
        className="sem-box"
        style={{ width: `${boxWidth}%`, height: `${boxHeight}%` }}
      >
        {mediaType === "video" ? (
          <video
            className="road-video"
            src={mediaSrc}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
          />
        ) : (
          <img src={mediaSrc} alt="" />
        )}
        <motion.div
          className="sem-box-scrim"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.4 - scrollProgress * 0.3 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </section>
  );
}
