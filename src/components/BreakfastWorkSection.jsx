import React from "react";

/**
 * A structural recreation of wearebreakfast.com's `home__work` (wrapped in
 * `home__end-wrapper`) — the closing line, same wording as theirs. Their
 * `collage-rose-hand` photo pairing has no equivalent supplied asset, so
 * it's left out rather than filled with an unrelated placeholder.
 */
export default function BreakfastWorkSection() {
  return (
    <section className="bf-work">
      <p className="bf-work-copy">
        OUR SOUND IS UNLIKE ANYTHING ELSE
        <br />
        BECAUSE WE&rsquo;RE NOT USING EVERYONE ELSE.
      </p>
    </section>
  );
}
