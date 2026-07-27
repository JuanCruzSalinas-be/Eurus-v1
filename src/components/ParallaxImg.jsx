import React, { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

/**
 * Direct port of the ParallaxImg from the "modern-hero" component: each
 * image tracks its own scroll progress across [start, end] px of travel
 * (via useScroll's element-relative offset, not a fixed global range), and
 * floats from `start` to `end` while fading + scaling down over the last
 * quarter of that range. `widthClass`/`alignClass` come from content.json
 * so different items get the built-in layout variety (third-width,
 * two-thirds centered, offset-left, etc.) without hardcoding it here.
 */
export default function ParallaxImg({ start, end, widthClass, alignClass, children }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div
      ref={ref}
      className={`parallax-img ${widthClass} ${alignClass}`}
      style={{ transform, opacity }}
    >
      {children}
    </motion.div>
  );
}
