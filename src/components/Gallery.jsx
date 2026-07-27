import React from "react";
import PhotoCard from "./PhotoCard.jsx";
import ScrollExpandMedia from "./ScrollExpandMedia.jsx";

/**
 * Image/video items get the full-bleed scroll-expand treatment (see
 * ScrollExpandMedia) — each one is its own near-fullscreen section. The
 * "split" (Handoff) card keeps its existing contained, rounded-card
 * hands-meet-in-the-middle animation instead: two side-by-side photos
 * sliding together doesn't map onto "one media box growing," so it stays
 * in the original gallery-card layout.
 */
export default function Gallery({ items }) {
  return (
    <>
      {items.map((item) => {
        if (item.type === "split") {
          return (
            <section key={item.id} className="gallery">
              <div className="gallery-wrap">
                <PhotoCard item={item} />
              </div>
            </section>
          );
        }
        return (
          <div key={item.id} id={item.id}>
            <ScrollExpandMedia
              mediaType={item.type}
              mediaSrc={item.src}
              bgSrc={item.src}
            />
          </div>
        );
      })}
    </>
  );
}
