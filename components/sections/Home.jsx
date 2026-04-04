"use client";

import { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [dronePos, setDronePos] = useState({ left: "40%", top: "15%" });

  useEffect(() => {
    // Trigger headline slide-up animation after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Reposition drone placeholder every 3 seconds within top 40%
  useEffect(() => {
    function reposition() {
      const isMobile = window.innerWidth < 768;
      const x = isMobile
        ? 5 + Math.random() * 55  // 5%–60% on mobile (130px drone on 390px screen)
        : 5 + Math.random() * 78; // 5%–83% on desktop
      const y = isMobile
        ? 5 + Math.random() * 72  // 5%–77% on mobile
        : 5 + Math.random() * 78;
      setDronePos({ left: `${x}%`, top: `${y}%` });
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
        <video
          className="hero-drone-placeholder"
          style={{ left: dronePos.left, top: dronePos.top }}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src="/videos/drone-hover.mp4" type="video/mp4" />
        </video>
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
