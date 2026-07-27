import React, { useRef } from "react";
import useHandMeetScroll from "../hooks/useHandMeetScroll.js";

/**
 * The human hand and the AI hand fly in from opposite corners as this
 * section scrolls through view and meet at center — exactly when the
 * section fully fills the viewport, so the touch is never half-scrolled
 * out of frame (see TOUCH_AT in useHandMeetScroll.js). The background
 * snaps from light blue to black right as they touch. All motion is
 * driven by useHandMeetScroll, which recomputes scroll progress every
 * frame — no one-shot trigger, so scrolling back up reverses it smoothly.
 */
export default function HandoffMeet() {
  const sectionRef = useRef(null);
  useHandMeetScroll(sectionRef);

  return (
    <section ref={sectionRef} className="handoff-meet">
      <div className="handoff-meet-stage">
        <img
          className="handoff-hand handoff-hand-human"
          src="/images/hand-human.png"
          alt="A human hand reaching toward the AI hand"
        />
        <img
          className="handoff-hand handoff-hand-ai"
          src="/images/hand-robot.png"
          alt="A robotic hand reaching toward the human hand"
        />
      </div>
    </section>
  );
}
