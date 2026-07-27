import React from "react";
import WovenCanvas from "./WovenCanvas.jsx";

/**
 * The WovenLightHero component minus its headline/nav/button — just the
 * interactive particle canvas, framed the same way as the rest of this
 * site's full-bleed moments (see .sem-section / .parallax-gallery).
 * Sits between the parallax photo gallery and Partners.
 */
export default function WovenSection() {
  return (
    <section className="woven-section">
      <WovenCanvas />
    </section>
  );
}
