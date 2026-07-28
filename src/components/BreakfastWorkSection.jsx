import React from "react";

/**
 * A structural recreation of wearebreakfast.com's `home__work` (wrapped in
 * `home__end-wrapper`) — the "WORK" text marquee (their `.animated-text`,
 * reusing this site's existing infinite-marquee CSS technique from
 * MarqueeLogoScroller rather than their exact JS) followed by the closing
 * line, same wording as theirs. Their `collage-rose-hand` photo pairing
 * has no equivalent supplied asset, so it's left out rather than filled
 * with an unrelated placeholder.
 */
const WORDS = Array(8).fill("WORK");

export default function BreakfastWorkSection() {
  return (
    <section className="bf-work">
      <div className="bf-work-marquee">
        <div className="bf-work-marquee-track">
          {[...WORDS, ...WORDS].map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
      </div>

      <p className="bf-work-copy">
        OUR SOUND IS UNLIKE ANYTHING ELSE
        <br />
        BECAUSE WE&rsquo;RE NOT USING EVERYONE ELSE.
      </p>
    </section>
  );
}
