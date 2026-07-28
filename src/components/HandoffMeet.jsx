import React, { useRef, useState } from "react";
import useHandMeetScroll from "../hooks/useHandMeetScroll.js";
import { asset } from "../lib/asset.js";
import SpecialText from "./SpecialText.jsx";

/**
 * The human hand and the AI hand fly in from opposite corners as this
 * section scrolls through view and meet at center — exactly when the
 * section fully fills the viewport, so the touch is never half-scrolled
 * out of frame (see TOUCH_AT in useHandMeetScroll.js). The background
 * snaps from light blue to black right as they touch. All motion is
 * driven by useHandMeetScroll, which recomputes scroll progress every
 * frame — no one-shot trigger, so scrolling back up reverses it smoothly.
 * .handoff-meet-copy is the headline staged for this exact moment — it
 * snaps to visible in the same frame the hands vanish and the background
 * goes black, so it reads as the payoff of the touch; the headline itself
 * scramble-decodes in via SpecialText, started/reset by the same touch
 * edge (useHandMeetScroll's onTouchChange), not a separate trigger.
 */
export default function HandoffMeet() {
  const sectionRef = useRef(null);
  const [touched, setTouched] = useState(false);
  useHandMeetScroll(sectionRef, { onTouchChange: setTouched });

  return (
    <section ref={sectionRef} className="handoff-meet">
      <div className="handoff-meet-stage">
        <img
          className="handoff-hand handoff-hand-human"
          src={asset("/images/hand-human.png")}
          alt="A human hand reaching toward the AI hand"
        />
        <img
          className="handoff-hand handoff-hand-ai"
          src={asset("/images/hand-robot.png")}
          alt="A robotic hand reaching toward the human hand"
        />
      </div>
      <div className="handoff-meet-copy">
        {/* Two fixed lines instead of one wrapping block of text: during
            the scramble, real spaces get swapped for non-space glyphs (see
            SpecialText.jsx), so a browser-decided wrap point would jump
            around every frame and reflow this whole centered container.
            Splitting at a fixed point and disabling wrap per line (see
            .special-text's white-space:pre) keeps each line's box a
            constant size for the entire animation. */}
        <h2>
          <SpecialText play={touched} speed={10}>
            Human judgment. AI
          </SpecialText>
          <br />
          <SpecialText play={touched} speed={10}>
            speed. One handoff.
          </SpecialText>
        </h2>
        <a className="apply-btn apply-btn-light" href="#apply">
          Apply now
        </a>
      </div>
    </section>
  );
}
