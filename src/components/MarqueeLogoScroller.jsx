import React from "react";

/**
 * Ported from the MarqueeLogoScroller shadcn-style component: an
 * infinitely scrolling logo strip (the logo list rendered twice back to
 * back, animated translateX(0) -> translateX(-50%), so the loop point is
 * invisible), pausing on hover. `title`/`description` are optional — this
 * project has kept every section free of copy so far, so the Partners
 * usage below omits them; pass them if you want the header back.
 */
export default function MarqueeLogoScroller({
  title,
  description,
  logos,
  speed = "normal",
}) {
  const durationMap = { normal: "40s", slow: "80s", fast: "5s" };
  const animationDuration = durationMap[speed] || durationMap.normal;

  return (
    <section className="marquee-scroller" aria-label={title || "Partners"}>
      {(title || description) && (
        <div className="marquee-scroller-head">
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </div>
      )}

      <div className="marquee-scroller-mask">
        <div
          className="marquee-scroller-track"
          style={{ animationDuration }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="marquee-scroller-tile">
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
