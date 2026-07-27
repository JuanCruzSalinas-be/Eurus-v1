import React from "react";
import MarqueeLogoScroller from "./MarqueeLogoScroller.jsx";

export default function Partners({ partners }) {
  return (
    <section id="partners" className="band-grey align-center" style={{ borderBottom: "none" }}>
      <div className="wrap">
        <MarqueeLogoScroller logos={partners} speed="normal" />
      </div>
    </section>
  );
}
