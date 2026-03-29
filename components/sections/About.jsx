"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import gsap from "gsap";
import "./About.css";

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
  const photoRef = useRef(null);
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
      console.log('Frames loaded:', frames.filter(Boolean).length);
      clearTimeout(timeout);
      framesRef.current = frames;
      setFramesReady(true);
    });

    return () => clearTimeout(timeout);
  }, [framesReady]);

  /* Set canvas dimensions once when frames are ready */
  useEffect(() => {
    if (!framesReady || useFallback) return;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    // Set canvas dimensions once — do not reset on every draw
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
  }, [framesReady, useFallback]);

  /* Draw first frame immediately when frames are ready */
  useEffect(() => {
    if (!framesReady || useFallback || !framesRef.current[0]) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = framesRef.current[0];

    const scale = Math.min(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );
    const x = (canvas.width - img.naturalWidth * scale) / 2;
    const y = (canvas.height - img.naturalHeight * scale) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }, [framesReady, useFallback]);

  /* Camera animation — auto-play on section entry */
  useEffect(() => {
    if (!framesReady || useFallback) return;

    const section = document.querySelector("#sec-about");
    if (!section) return;

    let hasPlayed = false;

    const playAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const totalFrames = framesRef.current.length;
      const duration = 3000; // 3 seconds
      const frameInterval = duration / totalFrames;
      let currentFrame = 0;

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
        ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
      };

      // Draw first frame
      drawFrame(0);

      // Advance frames at consistent interval
      const interval = setInterval(() => {
        currentFrame++;
        if (currentFrame >= totalFrames) {
          clearInterval(interval);
          revealPhoto();
          return;
        }
        drawFrame(currentFrame);
      }, frameInterval);
    };

    const revealPhoto = () => {
      const canvas = canvasRef.current;
      const photoWrapper = photoRef.current;

      if (!canvas || !photoWrapper) return;

      // Source frame dimensions
      const SOURCE_W = 1440;
      const SOURCE_H = 1440;

      // Viewfinder coordinates in source frame
      const VF = {
        x: 190,
        y: 440,
        w: 520,
        h: 420,
      };

      // Map to canvas dimensions
      const scaleX = canvas.width / SOURCE_W;
      const scaleY = canvas.height / SOURCE_H;

      const mapped = {
        x: VF.x * scaleX,
        y: VF.y * scaleY,
        w: VF.w * scaleX,
        h: VF.h * scaleY,
      };

      // Get photo wrapper's position relative to its parent
      const wrapperRect = photoWrapper.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      // Calculate offset from canvas to photo wrapper
      const offsetX = wrapperRect.left - canvasRect.left;
      const offsetY = wrapperRect.top - canvasRect.top;

      // Set photo to start at viewfinder position and size
      // These are relative to the photo wrapper's own coordinate space
      gsap.set(photoWrapper, {
        opacity: 0,
        scale: mapped.w / wrapperRect.width,
        transformOrigin: "center center",
        x: mapped.x + mapped.w / 2 - (offsetX + wrapperRect.width / 2),
        y: mapped.y + mapped.h / 2 - (offsetY + wrapperRect.height / 2),
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          canvas.style.display = "none";
          canvas.style.pointerEvents = "none";
        },
      });

      timeline
        // Photo fades in on the LCD screen — small, in position
        .to(photoWrapper, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut",
        })
        // Hold on screen for a moment
        .to({}, { duration: 0.5 })
        // Camera body fades out
        .to(canvas, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        })
        // Photo expands dramatically to full size and position simultaneously
        .to(
          photoWrapper,
          {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
          },
          "-=0.4"
        );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            hasPlayed = true;
            observer.disconnect();
            playAnimation();
          }
        });
      },
      {
        root: document.querySelector("#snap-container"),
        threshold: 0.5,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
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
            <div
              ref={photoRef}
              className="about-photo-reveal"
              style={{ opacity: useFallback ? 1 : 0 }}
            >
              <NextImage
                src="/images/jack-nathan.jpg"
                alt="Nathan — cinematographer and founder of Jack Visuals, Trinidad"
                fill
                className="about-photo-img"
                sizes="(max-width: 820px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
