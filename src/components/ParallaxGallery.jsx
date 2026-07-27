import React from "react";
import ParallaxImg from "./ParallaxImg.jsx";
import { asset } from "../lib/asset.js";

const WIDTH_CLASS = {
  third: "w-third",
  "two-thirds": "w-two-thirds",
  "five-twelfths": "w-five-twelfths",
  half: "w-half",
};
const ALIGN_CLASS = {
  left: "align-left",
  right: "align-right",
  center: "align-center-block",
  offset: "align-offset",
};

/**
 * Replaces the old flush "blend into one another" filmstrip (StaticGallery,
 * still on disk, unused) with the modern-hero ParallaxImages treatment:
 * each photo floats vertically at its own scroll-linked rate and
 * fades/scales down as it exits, in the same varied-width staggered
 * layout the source component used.
 */
export default function ParallaxGallery({ items }) {
  return (
    <div className="parallax-gallery">
      {items.map((item) => {
        const widthClass = WIDTH_CLASS[item.width] || "w-third";
        const alignClass = ALIGN_CLASS[item.align] || "align-left";

        return (
          <ParallaxImg
            key={item.id}
            start={item.start}
            end={item.end}
            widthClass={widthClass}
            alignClass={alignClass}
          >
            <div id={item.id} className="parallax-img-inner">
              {item.type === "image" && <img src={asset(item.src)} alt={item.alt} />}

              {item.type === "video" && (
                <video src={asset(item.src)} muted loop playsInline autoPlay preload="none" />
              )}

              {item.type === "split" && (
                <div className="static-split">
                  <div className="static-split-half">
                    <img src={asset(item.left.src)} alt={item.left.alt} />
                  </div>
                  <div className="static-split-half">
                    <img src={asset(item.right.src)} alt={item.right.alt} />
                  </div>
                </div>
              )}
            </div>
          </ParallaxImg>
        );
      })}
    </div>
  );
}
