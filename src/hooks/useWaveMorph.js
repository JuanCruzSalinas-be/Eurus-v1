import { useEffect } from "react";

/**
 * Continuously morphs an SVG <path>'s `d` between two shapes with the same
 * command structure — the liquid-wave effect from wearebreakfast.com's
 * hero, which uses GSAP's MorphSVGPlugin under the hood. That plugin is
 * overkill for two same-length paths: since both strings share the same
 * sequence of letters/separators and only their numbers differ, splitting
 * on the numbers gives an identical template for both, so the two number
 * arrays can just be lerped directly each frame with no extra dependency.
 */
const NUM_RE = /-?\d*\.?\d+(?:e-?\d+)?/g;

function parse(d) {
  const template = d.split(NUM_RE);
  const numbers = (d.match(NUM_RE) || []).map(Number);
  return { template, numbers };
}

function build(template, numbers) {
  let out = template[0];
  for (let i = 0; i < numbers.length; i++) {
    out += numbers[i] + template[i + 1];
  }
  return out;
}

function easeInOutSine(t) {
  return (1 - Math.cos(t * Math.PI)) / 2;
}

export default function useWaveMorph(pathRef, { from, to, duration = 4200 } = {}) {
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !from || !to) return;

    const a = parse(from);
    const b = parse(to);
    if (a.numbers.length !== b.numbers.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      path.setAttribute("d", from);
      return;
    }

    let raf;
    const start = performance.now();
    const tick = (now) => {
      const phase = ((now - start) / duration) % 2;
      const t = phase <= 1 ? phase : 2 - phase;
      const eased = easeInOutSine(t);
      const numbers = a.numbers.map((n, i) => n + (b.numbers[i] - n) * eased);
      path.setAttribute("d", build(a.template, numbers));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [pathRef, from, to, duration]);
}
