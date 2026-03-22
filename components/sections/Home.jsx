"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const droneRef = useRef(null);

  useEffect(() => {
    // Trigger headline slide-up animation after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Reposition drone placeholder every 3 seconds within top 40%
  useEffect(() => {
    const drone = droneRef.current;
    if (!drone) return;

    function reposition() {
      const x = 10 + Math.random() * 60; // 10%–70% from left
      const y = 5 + Math.random() * 25; // 5%–30% from top
      drone.style.left = `${x}%`;
      drone.style.top = `${y}%`;
    }

    reposition();
    const interval = setInterval(reposition, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="sec-home">
      {/* Background layer — gradient overlay for depth */}
      <div className="hero-video-sim">
        {/* DRONE VIDEO PLACEHOLDER — swap in drone-hero.mp4 when ready */}
        <div
          ref={droneRef}
          className="hero-drone-placeholder"
          aria-hidden="true"
        />
      </div>

      {/* Content — positioned at bottom left */}
      <div className="hero-eyebrow">Cinematic Video Production</div>
      <h1 className={`hero-headline ${loaded ? "hero-headline-visible" : ""}`}>
        Where every
        <br />
        video tells
        <br />
        a story
      </h1>
    </section>
  );
}
