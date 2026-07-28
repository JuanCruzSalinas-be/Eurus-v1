import { useEffect } from "react";

/**
 * Same-page "#id" links (the Apply button) don't land correctly here:
 * #smooth-content is position:fixed and only ever visually translated by
 * useLerpScroll, so the browser's native anchor-jump/scrollIntoView math
 * doesn't resolve against real document scroll the way it expects to —
 * clicking updates the URL hash but the page doesn't move. This computes
 * the target's on-screen position itself (current getBoundingClientRect
 * top + current window.scrollY, the same math that reliably works
 * elsewhere in this codebase) and drives a real window.scrollTo, which
 * useLerpScroll's own scroll listener then eases toward like any other
 * scroll — so it also comes out smooth instead of an instant native jump.
 */
export default function useAnchorScroll() {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "auto" });
      history.pushState(null, "", `#${id}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
