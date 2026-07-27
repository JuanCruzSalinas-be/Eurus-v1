import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./Carousel.jsx";

/**
 * Ported from the "cases-with-infinite-scroll" component: auto-advances
 * one slide every second, wrapping back to the start. Here it holds the
 * three real partner marks (FCWS, FITCI, Frederick County) instead of
 * placeholder "Logo N" tiles — `loop: true` on embla handles the
 * wrap-around natively, so it doesn't need the manual scrollTo(0) reset
 * the original used for its non-looping carousel.
 */
export default function PartnersCarousel({ partners }) {
  const [api, setApi] = useState();

  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, 1000);
    return () => clearInterval(id);
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="partners-carousel">
      <CarouselContent>
        {partners.map((p) => (
          <CarouselItem key={p.src} className="partners-carousel-item">
            <div className="partners-carousel-tile" style={{ borderColor: p.accent }}>
              <img src={p.src} alt={p.alt} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
