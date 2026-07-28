import React from "react";

/**
 * The closing call-to-action, last thing on the page. `mailto:` is a
 * placeholder — swap APPLY_HREF for the real application form/ATS link
 * once one exists; the hand-meet reveal's "Apply now" button (see
 * HandoffMeet.jsx) links to this section's #apply anchor.
 */
const APPLY_HREF = "mailto:hello@eurus.city?subject=I'm%20interested%20in%20applying";

export default function ApplySection() {
  return (
    <section id="apply" className="apply-section">
      <h2>Ready to take the first step?</h2>
      <p>Tell us where you are and where you want to go — we'll take it from there.</p>
      <a className="apply-btn apply-btn-dark" href={APPLY_HREF}>
        Apply now
      </a>
    </section>
  );
}
