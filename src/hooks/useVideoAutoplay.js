import { useEffect } from "react";

/** Plays each `video.road-video` only while it's on screen, pauses otherwise. */
export default function useVideoAutoplay(rootRef) {
  useEffect(() => {
    const root = rootRef.current || document;
    const videos = root.querySelectorAll("video.road-video");
    if (!videos.length) return;

    const observers = [];
    videos.forEach((v) => {
      const playIt = () => v.play().catch(() => {});
      if ("IntersectionObserver" in window) {
        const vio = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) playIt();
              else v.pause();
            });
          },
          { threshold: 0.25 }
        );
        vio.observe(v);
        observers.push(vio);
      } else {
        playIt();
      }
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [rootRef]);
}
