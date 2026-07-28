import React, { useRef } from "react";

import content from "./data/content.json";

import Cursor from "./components/Cursor.jsx";
import Opening from "./components/Opening.jsx";
import BreakfastMiddleSection from "./components/BreakfastMiddleSection.jsx";
import BreakfastWorkSection from "./components/BreakfastWorkSection.jsx";
import HandoffMeet from "./components/HandoffMeet.jsx";
import WovenSection from "./components/WovenSection.jsx";
import Partners from "./components/Partners.jsx";
import WaveMorph from "./components/WaveMorph.jsx";

import useCustomCursor from "./hooks/useCustomCursor.js";
import useLerpScroll from "./hooks/useLerpScroll.js";
import useVideoAutoplay from "./hooks/useVideoAutoplay.js";
import useAnchorScroll from "./hooks/useAnchorScroll.js";

/**
 * The opening (forest photo as background, road video as the media that
 * expands to fill the screen, via ScrollExpandMedia) is followed by the
 * navy wave, then two sections that structurally recreate
 * wearebreakfast.com's home__middle and home__work — same wording as
 * theirs, see BreakfastMiddleSection.jsx / BreakfastWorkSection.jsx for
 * what was and wasn't carried over (their licensed "Equip" font isn't
 * ours to bundle; their bacon+mallet-hands collage is replaced with the
 * supplied keyboard photo; their rose+hand collage has no equivalent
 * asset, so it's just not there). These replace the old ParallaxGallery
 * photo section (ported from modern-hero's ParallaxImages, since deleted
 * along with its images). HandoffMeet, next, is the human/AI hand-meet
 * moment (see useHandMeetScroll.js) — both hands ease in from opposite
 * corners as it scrolls into view, timed so the touch lands exactly when
 * the section fills the whole viewport, and the background snaps
 * light-blue-to-black once they touch. WovenSection, after that, is the
 * mouse-reactive Three.js particle canvas ported from WovenLightHero
 * (text/nav/button dropped — see WovenCanvas.jsx). Partners stays plain.
 * The footer (the eurus-mark illustration) has been removed —
 * SiteFooter.jsx is still on disk, unused, if that comes back.
 * StaticGallery — the flush, motionless "blend into one another" version
 * of the photo section — is also still on disk, unused (it predates the
 * ParallaxGallery/Breakfast-section swap and was never wired up either).
 * WaveMorph is the liquid-wave divider ported from wearebreakfast.com's
 * hero (see useWaveMorph.js) — used twice, navy after the opening and
 * light blue before Partners; both carry a short line of filler copy
 * (passed as children). Partners is last on the page — the closing
 * ApplySection CTA has been removed; the "Apply now" button inside
 * HandoffMeet's black reveal now links directly to the mailto instead of
 * to that section's #apply anchor.
 */
const NAVY = "#0b1d3a";
const LIGHT_BLUE = "#8fd8ff";
const CREAM = "#f0e7d4";
export default function App() {
  const spacerRef = useRef(null);
  const contentRef = useRef(null);

  useCustomCursor();
  useLerpScroll(contentRef, spacerRef);
  useVideoAutoplay(contentRef);
  useAnchorScroll();

  return (
    <>
      <Cursor />

      <div id="smooth-spacer" ref={spacerRef} />
      <div id="smooth-content" ref={contentRef}>
        <main>
          <Opening opening={content.opening} />
          <WaveMorph color={NAVY} textColor={CREAM}>
            <p>Your field guide to the first step — from classroom to career.</p>
          </WaveMorph>
          <BreakfastMiddleSection />
          <BreakfastWorkSection />
          <HandoffMeet />
          <WovenSection />
          <WaveMorph color={LIGHT_BLUE} textColor={NAVY}>
            <p>Built alongside the people already opening doors in Frederick County.</p>
          </WaveMorph>
          <Partners partners={content.partners} />
        </main>
      </div>
    </>
  );
}
