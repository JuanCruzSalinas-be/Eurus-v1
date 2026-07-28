import React, { useRef } from "react";
import { asset } from "../lib/asset.js";
import useSlideReveal from "../hooks/useSlideReveal.js";

/**
 * A structural recreation of wearebreakfast.com's `home__middle` — same
 * wording as their `.home__wave__content` (their wave graphic itself was
 * asked to be dropped, and pink/gradient with it — plain white here). Same
 * uppercase weight treatment as theirs; their "Equip" webfont is a
 * licensed commercial font not ours to bundle, so this falls back to the
 * same `Arial, sans-serif` their own CSS falls back to. The bacon+
 * mallet-hands photo collage is replaced with the supplied keyboard
 * photo, slid in on scroll with the same scrubbed reveal their hands
 * figure uses (see useSlideReveal.js).
 */
export default function BreakfastMiddleSection() {
  const figureRef = useRef(null);
  useSlideReveal(figureRef, { fromXPercent: -100, fromYPercent: 100 });

  return (
    <section className="bf-middle">
      <figure className="bf-middle-collage" ref={figureRef}>
        <img
          src={asset("/images/keyboard.png")}
          alt="Hands holding the Eurus keyboard"
        />
      </figure>
    </section>
  );
}
