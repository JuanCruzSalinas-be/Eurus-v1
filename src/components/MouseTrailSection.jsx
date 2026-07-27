import React from "react";
import MouseTrailCanvas from "./MouseTrailCanvas.jsx";

/**
 * A full-bleed section for the mouse-trail canvas effect (see
 * MouseTrailCanvas.jsx) — framed the same way as WovenSection, on a navy
 * backdrop so the additive rainbow glow actually reads (it washes out on
 * this site's light/yellow sections). Move the mouse over it to draw.
 */
export default function MouseTrailSection() {
  return (
    <section className="mouse-trail-section">
      <MouseTrailCanvas className="mouse-trail-canvas" />
    </section>
  );
}
