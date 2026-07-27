import React from "react";

/**
 * The two elements useCustomCursor (see hooks/useCustomCursor.js) drives
 * directly via refs/ids — kept as plain DOM targets rather than
 * state-driven React so the per-frame position updates never trigger a
 * re-render.
 */
export default function Cursor() {
  return (
    <>
      <div className="cursor-dot" id="cursorDot" />
      <div className="cursor-ring" id="cursorRing" />
    </>
  );
}
