import React, { createContext, useContext, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

/**
 * Trimmed port of shadcn's carousel primitives (Carousel/CarouselContent/
 * CarouselItem only — no CarouselPrevious/Next, since this project has no
 * Tailwind/Button component and the one place this is used auto-advances
 * on its own, no arrows needed). Same embla-carousel-react underneath,
 * same context/composition shape, just plain CSS classes instead of
 * Tailwind utility strings.
 */
const CarouselContext = createContext(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

export function Carousel({ opts, setApi, className = "", children, ...props }) {
  const [carouselRef, api] = useEmblaCarousel(opts);

  useEffect(() => {
    if (api && setApi) setApi(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider value={{ carouselRef, api }}>
      <div className={`carousel ${className}`} role="region" aria-roledescription="carousel" {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className = "", ...props }) {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="carousel-viewport">
      <div className={`carousel-track ${className}`} {...props} />
    </div>
  );
}

export function CarouselItem({ className = "", ...props }) {
  return <div role="group" aria-roledescription="slide" className={`carousel-item ${className}`} {...props} />;
}
