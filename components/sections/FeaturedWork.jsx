"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FeaturedWork.css";

gsap.registerPlugin(ScrollTrigger);

/* Placeholder cards shown when Sanity has no featured projects */
const PLACEHOLDER_CARDS = [
  { _id: "placeholder-1", title: "Trinidad Carnival 2024", category: "Live Event" },
  { _id: "placeholder-2", title: "Grey Goose Campaign", category: "Brand" },
  { _id: "placeholder-3", title: "Coastal Estates", category: "Aerial" },
];

const BG_CLASSES = ["work-bg-1", "work-bg-2", "work-bg-3"];

export default function FeaturedWork({ projects = [] }) {
  const cards = projects.length > 0 ? projects : PLACEHOLDER_CARDS;
  const carouselRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationReady, setAnimationReady] = useState(false);
  const [animationError, setAnimationError] = useState(false);

  /* Track carousel scroll position for dot indicator */
  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = 260 + 14; // card width + gap
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, cards.length - 1));
  }, [cards.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* Camera scroll animation — Phase 8 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const frameCount = 151;
    const frames = [];
    let loadedFrames = 0;

    // Preload all frames
    const preloadFrames = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.onload = () => {
          loadedFrames++;
          if (loadedFrames === frameCount) {
            setAnimationReady(true);
          }
        };
        img.onerror = () => {
          console.error(`Failed to load frame ${i}`);
          setAnimationError(true);
        };
        img.src = `/videos/frames/frame_${String(i).padStart(4, "0")}.jpg`;
        frames[i - 1] = img;
      }
    };

    preloadFrames();

    // Render current frame
    const render = (frameIndex) => {
      const img = frames[frameIndex];
      if (img && img.complete) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    // GSAP ScrollTrigger — bind scroll to frame progress
    const scrollTrigger = ScrollTrigger.create({
      trigger: "#sec-work",
      scroller: "#snap-container", // Use snap container instead of window
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(self.progress * frameCount)
        );
        render(frameIndex);

        // Show cards when animation reaches 100%
        if (self.progress >= 0.99 && animationReady) {
          canvas.style.opacity = "0";
        } else {
          canvas.style.opacity = "1";
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [animationReady]);

  return (
    <section id="sec-work">
      <div className="zone-top" />

      <div className="zone-header">
        <h2 className="work-title">Featured Work</h2>
        <Link href="/work" className="work-view-all">
          All Projects
        </Link>
      </div>

      {/* Camera scroll animation canvas */}
      {!animationError && (
        <canvas
          ref={canvasRef}
          className="camera-animation-canvas"
          style={{
            opacity: animationReady ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}

      <div
        className="work-cards-zone"
        style={{
          opacity: animationError || !animationReady ? 1 : 0,
          pointerEvents: animationError || !animationReady ? "auto" : "none",
        }}
      >
        <div className="work-cards" ref={carouselRef}>
          {cards.map((card, i) => (
            <div key={card._id} className="work-card">
              <div className={`work-card-bg ${BG_CLASSES[i % 3]}`} />

              {/* Mobile: gradient overlay + info — always visible */}
              <div className="work-card-overlay" />
              <div className="work-card-info">
                <div className="work-card-cat">{card.category}</div>
                <div className="work-card-title">{card.title}</div>
              </div>

              {/* Desktop: tag — always visible top-left */}
              <div className="work-card-tag">
                {card.category?.toUpperCase()}
              </div>

              {/* Desktop: hover layer with details */}
              <div className="work-card-hover">
                <div className="work-card-hover-cat">{card.category}</div>
                <div className="work-card-hover-title">{card.title}</div>
                {card.description && (
                  <div className="work-card-spec">{card.description}</div>
                )}
              </div>

              {/* Desktop: play button — placeholder until Vimeo integration */}
              <button
                className="work-card-play"
                aria-label={`Play ${card.title}`}
              >
                <svg viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Dots — mobile carousel indicator */}
        <div className="work-dots">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`work-dot${i === activeIndex ? " work-dot-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
