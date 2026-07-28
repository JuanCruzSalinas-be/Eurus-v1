import React, { useEffect, useRef, useState } from "react";

const RANDOM_CHARS = "_!X$0-+*#";

function getRandomChar(prevChar) {
  let char;
  do {
    char = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
  } while (char === prevChar);
  return char;
}

function renderScramble(text, step, phase1Steps) {
  if (step < phase1Steps) {
    const currentLength = Math.min(step + 1, text.length);
    const chars = [];
    for (let i = 0; i < currentLength; i++) chars.push(getRandomChar(chars[i - 1]));
    for (let i = currentLength; i < text.length; i++) chars.push(" ");
    return chars.join("");
  }

  const p2step = step - phase1Steps;
  const revealedCount = Math.floor(p2step / 2);
  const chars = [];
  for (let i = 0; i < revealedCount && i < text.length; i++) chars.push(text[i]);
  if (revealedCount < text.length) chars.push(p2step % 2 === 0 ? "_" : getRandomChar());
  for (let i = chars.length; i < text.length; i++) chars.push(getRandomChar());
  return chars.join("");
}

/**
 * Terminal-style scramble-then-decode text reveal, ported from a shadcn
 * "SpecialText" demo (originally TypeScript, using the `motion` package's
 * useInView). This project has no TypeScript/Tailwind/shadcn, and already
 * depends on framer-motion — the same team's predecessor to `motion`, same
 * API — for other scroll effects, so no new dependency was needed.
 *
 * The original triggered itself via scroll-into-view (useInView) or a
 * fixed delay, and paced itself with a plain setInterval. Both dropped
 * here: its one use is the headline inside HandoffMeet's black reveal,
 * already driven by that section's own scroll-progress hook
 * (useHandMeetScroll's onTouchChange) via a `play` boolean this flips on.
 * And a naive setInterval badly under-delivers on this particular page —
 * WovenCanvas alone is animating 50,000 Three.js particles every frame, so
 * a fixed-cadence timer gets starved and the reveal crawls in slow motion.
 * This instead computes which step it *should* be on from real elapsed
 * time inside a requestAnimationFrame loop (the same pattern every other
 * animation in this codebase already uses), so it always finishes in
 * `totalSteps * speed` ms of wall-clock time — catching up by skipping
 * intermediate frames under load rather than just falling behind.
 */
export default function SpecialText({ children, speed = 20, className = "", play }) {
  const text = children;
  const [displayText, setDisplayText] = useState(() => " ".repeat(text.length));
  const rafRef = useRef(null);
  const wasPlaying = useRef(false);

  useEffect(() => {
    if (play === wasPlaying.current) return;
    wasPlaying.current = play;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!play) {
      setDisplayText(" ".repeat(text.length));
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplayText(text);
      return;
    }

    const phase1Steps = text.length * 2;
    const totalSteps = phase1Steps * 2;
    const start = performance.now();
    let lastStep = -1;

    const tick = (now) => {
      const elapsedSteps = Math.floor((now - start) / speed);
      const step = Math.min(elapsedSteps, totalSteps - 1);
      // Only touch React state (and thus re-render) when the step this
      // rAF tick maps to has actually changed — on a >60hz display, or
      // when a frame gets delayed by the page's other animations and
      // several rAF callbacks land on the same step, this would otherwise
      // call setDisplayText with identical text repeatedly for nothing.
      if (step !== lastStep) {
        lastStep = step;
        setDisplayText(renderScramble(text, step, phase1Steps));
      }

      if (elapsedSteps < totalSteps) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(text);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [play, text, speed]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return <span className={`special-text ${className}`}>{displayText}</span>;
}
