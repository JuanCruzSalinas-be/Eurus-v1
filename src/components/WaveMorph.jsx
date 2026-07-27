import React, { useRef } from "react";
import useWaveMorph from "../hooks/useWaveMorph.js";

// A closed wave "ribbon" — both its top edge and its bottom edge are their
// own independent cubic-bezier wave (anchors held at the same y each time,
// only the control points swap which side they bow toward), so neither
// edge is ever a flat/sharp line, top or bottom. WAVE_A and WAVE_B share
// the exact same command structure and anchor points; only the control
// points are phase-swapped, which is what animates as the shape morphs.
const WAVE_A =
  "M0,100 C160,0 320,220 480,100 C640,0 800,220 960,100 C1120,0 1280,220 1440,100 C1600,0 1760,220 1920,100 " +
  "L1920,300 C1760,400 1600,180 1440,300 C1280,400 1120,180 960,300 C800,400 640,180 480,300 C320,400 160,180 0,300 Z";
const WAVE_B =
  "M0,100 C160,220 320,0 480,100 C640,220 800,0 960,100 C1120,220 1280,0 1440,100 C1600,220 1760,0 1920,100 " +
  "L1920,300 C1760,180 1600,400 1440,300 C1280,180 1120,400 960,300 C800,180 640,400 480,300 C320,180 160,400 0,300 Z";

export default function WaveMorph({ color }) {
  const pathRef = useRef(null);
  useWaveMorph(pathRef, { from: WAVE_A, to: WAVE_B });

  return (
    <div className="wave-morph">
      <svg
        className="wave-morph-svg"
        viewBox="0 0 1920 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={pathRef} d={WAVE_A} fill={color} />
      </svg>
    </div>
  );
}
