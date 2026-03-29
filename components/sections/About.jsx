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
  const canvasRef = useRef(null); // Top canvas - camera frames
  const photoCanvasRef = useRef(null); // Bottom canvas - Nathan's photo
  const wrapperRef = useRef(null);
  const nathanPhotoRef = useRef(null); // Nathan's photo image for canvas drawing
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

  /* Preload Nathan's photo for canvas drawing */
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      nathanPhotoRef.current = img;
    };
    img.src = "/images/jack-nathan.jpg";
  }, []);

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

  /* Helper: Draw Nathan's photo on canvas with object-fit: cover */
  const drawNathanPhoto = (ctx, canvas) => {
    const img = nathanPhotoRef.current;
    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw photo to fill canvas, object-fit: cover, object-position: top center
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight, drawX, drawY;

    if (imgAspect > canvasAspect) {
      // Image is wider - fit to height
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0; // top alignment
    } else {
      // Image is taller - fit to width
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      drawX = 0;
      drawY = 0; // top alignment
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };

  /* Set canvas dimensions once when frames are ready */
  useEffect(() => {
    if (!framesReady || useFallback) return;

    const canvas = canvasRef.current;
    const photoCanvas = photoCanvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !photoCanvas || !wrapper) return;

    // Set both canvas dimensions once — do not reset on every draw
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    photoCanvas.width = wrapper.offsetWidth;
    photoCanvas.height = wrapper.offsetHeight;

    // Fill bottom canvas with solid black during camera animation
    // Photo will be drawn when scan wipe starts
    const ctxPhoto = photoCanvas.getContext("2d");
    ctxPhoto.fillStyle = "#000";
    ctxPhoto.fillRect(0, 0, photoCanvas.width, photoCanvas.height);
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
          runScanWipe();
          return;
        }
        drawFrame(currentFrame);
      }, frameInterval);
    };

    /* DESIGN UPDATE: Replaced viewfinder reveal with scan wipe effect [March 2026] */
    const runScanWipe = () => {
      const canvasTop = canvasRef.current;
      const canvasPhoto = photoCanvasRef.current;
      if (!canvasTop || !canvasPhoto) return;

      // Draw Nathan's photo on bottom canvas NOW (not during camera animation)
      const ctxPhoto = canvasPhoto.getContext("2d");
      drawNathanPhoto(ctxPhoto, canvasPhoto);

      const ctxTop = canvasTop.getContext("2d");
      const img = framesRef.current[framesRef.current.length - 1]; // Last frame (frame_0151.jpg)
      if (!img) return;

      // Helper to draw scan line with glow
      const drawScanLine = (ctx, x, height, alpha = 1) => {
        ctx.save();
        ctx.globalAlpha = alpha;

        // Outer glow
        ctx.shadowColor = "#2997ff";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "#2997ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Inner bright core
        ctx.shadowBlur = 5;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        ctx.restore();
      };

      const scanProgress = { x: 0 };
      const scanLineOpacity = { value: 1 };

      gsap.to(scanProgress, {
        x: canvasTop.width,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          const x = scanProgress.x;

          // Clear top canvas
          ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);

          // Draw camera frame clipped to right of scan line
          const scale = Math.min(
            canvasTop.width / img.naturalWidth,
            canvasTop.height / img.naturalHeight
          );
          const imgX = (canvasTop.width - img.naturalWidth * scale) / 2;
          const imgY = (canvasTop.height - img.naturalHeight * scale) / 2;

          ctxTop.save();
          ctxTop.beginPath();
          ctxTop.rect(x, 0, canvasTop.width - x, canvasTop.height);
          ctxTop.clip();
          ctxTop.drawImage(
            img,
            imgX,
            imgY,
            img.naturalWidth * scale,
            img.naturalHeight * scale
          );
          ctxTop.restore();

          // Draw scan line on top
          drawScanLine(ctxTop, x, canvasTop.height);
        },
        onComplete: () => {
          // Fade out scan line
          gsap.to(scanLineOpacity, {
            value: 0,
            duration: 0.3,
            onUpdate: () => {
              ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
              // Redraw fading scan line at right edge
              drawScanLine(
                ctxTop,
                canvasTop.width,
                canvasTop.height,
                scanLineOpacity.value
              );
            },
            onComplete: () => {
              // Remove top canvas from DOM
              ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
              canvasTop.style.display = "none";
              canvasTop.style.pointerEvents = "none";
            },
          });
        },
      });
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
            {!useFallback ? (
              <>
                {/* Bottom layer: Nathan's photo (always visible) */}
                <canvas
                  ref={photoCanvasRef}
                  className="about-canvas-photo"
                  aria-label="Nathan — cinematographer and founder of Jack Visuals, Trinidad"
                />
                {/* Top layer: Camera frame (progressively clipped) */}
                <canvas ref={canvasRef} className="about-canvas-top" />
              </>
            ) : (
              /* Fallback: Show photo immediately if frames don't load */
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
