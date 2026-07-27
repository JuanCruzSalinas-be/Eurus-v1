import React, { useRef } from "react";

import content from "./data/content.json";

import Cursor from "./components/Cursor.jsx";
import Opening from "./components/Opening.jsx";
import ParallaxGallery from "./components/ParallaxGallery.jsx";
import HandoffMeet from "./components/HandoffMeet.jsx";
import WovenSection from "./components/WovenSection.jsx";
import Partners from "./components/Partners.jsx";
import WaveMorph from "./components/WaveMorph.jsx";
import MouseTrailSection from "./components/MouseTrailSection.jsx";

import useCustomCursor from "./hooks/useCustomCursor.js";
import useLerpScroll from "./hooks/useLerpScroll.js";
import useVideoAutoplay from "./hooks/useVideoAutoplay.js";

/**
 * The opening (forest photo as background, road video as the media that
 * expands to fill the screen, via ScrollExpandMedia) and every photo below
 * it (ParallaxGallery, ported from modern-hero's ParallaxImages) both carry
 * scroll-driven motion. HandoffMeet, right after the gallery, is the
 * human/AI hand-meet moment (see useHandMeetScroll.js) — both hands ease in
 * from opposite corners as it scrolls into view, timed so the touch lands
 * exactly when the section fills the whole viewport, and the background
 * snaps light-blue-to-black once they touch. WovenSection, after that, is
 * the mouse-reactive Three.js particle canvas ported from WovenLightHero
 * (text/nav/button dropped — see WovenCanvas.jsx). Partners stays plain.
 * The footer (the eurus-mark illustration) has been removed —
 * SiteFooter.jsx is still on disk, unused, if that comes back.
 * StaticGallery — the flush, motionless "blend into one another" version
 * of the photo section — is also still on disk, unused, in case that's
 * wanted back over ParallaxGallery.
 * WaveMorph is the liquid-wave divider ported from wearebreakfast.com's
 * hero (see useWaveMorph.js) — used twice, navy after the opening and
 * light blue before Partners. MouseTrailSection, right before Partners, is
 * the spring-jointed rainbow mouse-trail canvas (see MouseTrailCanvas.jsx).
 */
const NAVY = "#0b1d3a";
const LIGHT_BLUE = "#8fd8ff";
export default function App() {
  const spacerRef = useRef(null);
  const contentRef = useRef(null);

  useCustomCursor();
  useLerpScroll(contentRef, spacerRef);
  useVideoAutoplay(contentRef);

  return (
    <>
      <Cursor />

      <div id="smooth-spacer" ref={spacerRef} />
      <div id="smooth-content" ref={contentRef}>
        <main>
          <Opening opening={content.opening} />
          <WaveMorph color={NAVY} />
          <ParallaxGallery items={content.static} />
          <HandoffMeet />
          <WovenSection />
          <MouseTrailSection />
          <WaveMorph color={LIGHT_BLUE} />
          <Partners partners={content.partners} />
        </main>
      </div>
    </>
  );
}
