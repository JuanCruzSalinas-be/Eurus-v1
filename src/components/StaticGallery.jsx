import React from "react";

/**
 * Everything after the opening, rendered as one continuous filmstrip: no
 * scroll-jack, no clip-path parallax, no fade-in-on-scroll, no
 * hands-sliding-together animation — just the photos, present from first
 * paint, flush against each other with no gap/radius/shadow between them
 * so they blend into one another instead of reading as separate cards
 * (see .static-card in index.css for the seam-blending gradient + shared
 * color grade that makes that work).
 */
export default function StaticGallery({ items }) {
  return (
    <section className="static-gallery">
      <div className="static-gallery-wrap">
        {items.map((item) => (
          <div key={item.id} id={item.id} className="static-card">
            {item.type === "image" && <img src={item.src} alt={item.alt} />}

            {item.type === "video" && (
              <video src={item.src} muted loop playsInline autoPlay preload="none" />
            )}

            {item.type === "split" && (
              <div className="static-split">
                <div className="static-split-half">
                  <img src={item.left.src} alt={item.left.alt} />
                </div>
                <div className="static-split-half">
                  <img src={item.right.src} alt={item.right.alt} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
