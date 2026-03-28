"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const TOTAL_FRAMES = 151;
const FRAME_PATH = "/videos/frames/frame_";

/* Preload all camera animation frames */
const preloadFrames = () => {
  return new Promise((resolve) => {
    const frames = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(4, "0");
      img.src = `${FRAME_PATH}${num}.jpg`;
      img.onload = () => {
        frames[i - 1] = img;
        loaded++;
        if (loaded === TOTAL_FRAMES) resolve(frames);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) resolve(frames);
      };
    }
  });
};

/* Placeholder content matching HTML mockup files — replaced by Sanity data when available */
const PLACEHOLDER_SERVICES =
  "Event Videography · Brand Campaigns · Commercial Production · Drone & Aerial · Agency Collaboration";

const PLACEHOLDER_TRUSTED_BY =
  "Gin Mare · Diplomatico · Grey Goose · Patrón · JP Chenet · Cantine Maschio";

export default function About({ services = [], trustedBy = [] }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const framesRef = useRef([]);
  const [framesReady, setFramesReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const servicesText =
    services.length > 0
      ? services.map((s) => s.title).join(" · ")
      : PLACEHOLDER_SERVICES;

  const trustedByText =
    trustedBy.length > 0
      ? trustedBy.map((t) => t.name).join(" · ")
      : PLACEHOLDER_TRUSTED_BY;

  /* Preload frames with fallback timeout */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!framesReady) {
        setUseFallback(true);
      }
    }, 4000);

    preloadFrames().then((frames) => {
      clearTimeout(timeout);
      framesRef.current = frames;
      setFramesReady(true);
      ScrollTrigger.refresh();
    });

    return () => clearTimeout(timeout);
  }, [framesReady]);

  /* Camera animation — one-time photo reveal */
  useEffect(() => {
    if (!framesReady || useFallback) return;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");

    // Match canvas to photo wrapper dimensions
    const resizeCanvas = () => {
      canvas.width = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;
    };
    resizeCanvas();

    // Draw frame without resizing canvas on every call
    const drawFrame = (index) => {
      const img = framesRef.current[index];
      if (!img) return;

      const scale = Math.min(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const x = (canvas.width - img.naturalWidth * scale) / 2;
      const y = (canvas.height - img.naturalHeight * scale) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        x,
        y,
        img.naturalWidth * scale,
        img.naturalHeight * scale
      );
    };

    // Draw first frame immediately
    drawFrame(0);

    // One-directional scroll trigger — animation plays as About scrolls into view
    const trigger = ScrollTrigger.create({
      trigger: "#sec-about",
      scroller: "#snap-container",
      start: "top bottom",
      end: "top top",
      scrub: 1,
      onUpdate: (self) => {
        const index = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(self.progress * TOTAL_FRAMES)
        );
        drawFrame(index);

        // At 100% reveal the photo — one time only, never resets
        if (self.progress >= 0.99) {
          gsap.to(canvas, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              canvas.style.pointerEvents = "none";
              trigger.kill(); // Kill trigger after reveal
            },
          });
        }
      },
    });

    return () => {
      if (trigger) trigger.kill();
    };
  }, [framesReady, useFallback]);

  return (
    <section id="sec-about">
      {/* Nav clearance */}
      <div className="zone-top" />

      {/* Header */}
      <div className="zone-header">
        <h2 className="about-title">Jack Visuals</h2>
      </div>

      {/* Two-column content: text left, photo right */}
      <div className="about-content">
        <div className="about-left">
          <p className="about-body">
            With Caribbean roots and a global perspective, Jack brings cultural
            awareness, rhythm and movement into every production. From intimate
            brand stories to large-scale live events, his work is defined by
            precision, emotion, and cinematic detail. Based in Trinidad and
            Tobago, Jack Visuals operates across the Caribbean and beyond.
          </p>
          <div className="about-info-block">
            <div className="about-info-label">What We Offer</div>
            <p className="about-info-sentence">{servicesText}</p>
          </div>
          <div className="about-info-block">
            <div className="about-info-label">Production Kit</div>
            <p className="about-info-sentence">
              Cinema rigs, drone fleet, stabilization systems and on-set
              monitoring — built for every scale.
            </p>
          </div>
          <div className="about-info-block">
            <div className="about-info-label">Trusted By</div>
            <p className="about-info-sentence about-trusted-by">
              {trustedByText}
            </p>
          </div>
        </div>
        <div className="about-photo">
          <div className="about-photo-wrapper" ref={wrapperRef}>
            {!useFallback && (
              <canvas ref={canvasRef} className="camera-canvas-overlay" />
            )}
            <Image
              src="/images/jack-nathan.jpg"
              alt="Nathan — cinematographer and founder of Jack Visuals, Trinidad"
              width={220}
              height={480}
              style={{
                objectFit: "cover",
                objectPosition: "top center",
                width: "100%",
                height: "100%",
              }}
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
