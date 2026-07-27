import React from "react";
import ScrollExpandMedia from "./ScrollExpandMedia.jsx";

/**
 * The site's opening: the forest photo sits as the dimmed full-bleed
 * background, and the road video is the media that grows to fill the
 * screen as you scroll (ScrollExpandMedia's original bg/media split,
 * just with two different sources instead of the same one).
 */
export default function Opening({ opening }) {
  return (
    <div id={opening.id}>
      <ScrollExpandMedia
        mediaType={opening.mediaType}
        mediaSrc={opening.mediaSrc}
        bgSrc={opening.bgSrc}
      />
    </div>
  );
}
