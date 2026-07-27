import React from "react";

/**
 * Renders one gallery item from content.json. `type` is "image", "video",
 * or "split" (the two-hands "Handoff" card). `scrollHero` and the reveal
 * fade-in are applied generically by hooks in App.jsx via the
 * `.scroll-hero-fill` / `.photo-card` classes below — this component only
 * has to render the right markup shape for each type.
 */
export default function PhotoCard({ item }) {
  const ratioClass = item.ratio === "narrow" ? "ratio-narrow" : "ratio-wide";
  const classes = [
    "photo-card",
    ratioClass,
    item.scrollHero ? "scroll-hero-fill" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div id={item.id} className={classes}>
      {item.type === "image" && <img src={item.src} alt={item.alt} />}

      {item.type === "video" && (
        <video
          className="road-video"
          src={item.src}
          loop
          muted
          playsInline
          autoPlay
          preload="none"
        />
      )}

      {item.type === "split" && (
        <div className="handoff-split">
          <div className="handoff-half handoff-left">
            <img src={item.left.src} alt={item.left.alt} />
          </div>
          <div className="handoff-half handoff-right">
            <img src={item.right.src} alt={item.right.alt} />
          </div>
        </div>
      )}

      {/* Empty and ready for whenever headline/body copy comes back. */}
      <div className="card-copy" />
    </div>
  );
}
