"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import gsap from "gsap";
import "./About.css";

/* Placeholder content matching HTML mockup files — replaced by Sanity data when available */
const PLACEHOLDER_SERVICES =
  "Event Videography · Brand Campaigns · Commercial Production · Drone & Aerial · Agency Collaboration";

const PLACEHOLDER_TRUSTED_BY =
  "Gin Mare · Diplomatico · Grey Goose · Patrón · JP Chenet · Cantine Maschio";

export default function About({ services = [], trustedBy = [] }) {
  // Camera animation state
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const framesRef = useRef([]);
  const photoWrapperRef = useRef(null);
  const canvasBottomRef = useRef(null);
  const canvasTopRef = useRef(null);
  const photoImgRef = useRef(null);

  // Helper: object-fit: cover for camera frames
  const drawImageCover = (ctx, img, canvasW, canvasH) => {
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasW / canvasH;
    let sx, sy, sw, sh;

    if (imgAspect > canvasAspect) {
      // Image is wider - crop horizontally
      sh = img.naturalHeight;
      sw = sh * canvasAspect;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      // Image is taller - crop vertically
      sw = img.naturalWidth;
      sh = sw / canvasAspect;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH);
  };

  // Preload all 181 frames on mount
  useEffect(() => {
    const totalFrames = 181;
    const frames = [];
    let loadedCount = 0;
    let timeoutId;

    console.log("About: Starting frame preload...");

    // Fallback: if frames don't load in 4 seconds, skip animation
    timeoutId = setTimeout(() => {
      if (!framesLoaded) {
        console.log("About: Frame loading timeout - showing fallback photo");
        setFramesLoaded(false);
        // Reveal photo immediately
        if (photoImgRef.current) {
          photoImgRef.current.style.opacity = "1";
          photoImgRef.current.style.visibility = "visible";
        }
      }
    }, 4000);

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalFrames) {
        clearTimeout(timeoutId);
        framesRef.current = frames;
        setFramesLoaded(true);
        console.log(`About: All ${totalFrames} frames loaded`);

        // Size both canvases immediately and draw first frame
        const wrapper = photoWrapperRef.current;
        const canvasTop = canvasTopRef.current;
        const canvasBottom = canvasBottomRef.current;

        if (wrapper && canvasTop && canvasBottom) {
          const W = wrapper.offsetWidth;
          const H = wrapper.offsetHeight;

          canvasTop.width = W;
          canvasTop.height = H;
          canvasBottom.width = W;
          canvasBottom.height = H;

          // Fill bottom canvas black
          const ctxBottom = canvasBottom.getContext("2d");
          ctxBottom.fillStyle = "#000";
          ctxBottom.fillRect(0, 0, W, H);

          // Draw first frame on top canvas immediately
          const ctxTop = canvasTop.getContext("2d");
          drawImageCover(ctxTop, frames[0], W, H);

          console.log(`About: Canvases pre-sized to ${W}x${H}, first frame drawn`);
        }
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `/videos/frames/frame_${frameNum}.jpg`;
      img.onload = checkAllLoaded;
      img.onerror = () => {
        console.error(`About: Failed to load frame ${frameNum}`);
        checkAllLoaded(); // Continue even if one frame fails
      };
      frames.push(img);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  // IntersectionObserver setup - trigger animation when section is 50% visible
  useEffect(() => {
    if (!framesLoaded || hasPlayed) return;

    const snapContainer = document.querySelector("#snap-container");
    const section = document.querySelector("#sec-about");

    if (!snapContainer || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed && framesLoaded) {
            console.log("About: Section visible, starting animation");
            setHasPlayed(true);
            runAnimation();
          }
        });
      },
      {
        root: snapContainer,
        threshold: 0.5,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [framesLoaded, hasPlayed]);

  // Main animation sequence
  const runAnimation = async () => {
    const wrapper = photoWrapperRef.current;
    const canvasBottom = canvasBottomRef.current;
    const canvasTop = canvasTopRef.current;

    if (!wrapper || !canvasBottom || !canvasTop) return;

    // Get dimensions from wrapper
    const W = wrapper.offsetWidth;
    const H = wrapper.offsetHeight;

    console.log(`About: Canvas dimensions: ${W}x${H}`);

    // Set canvas dimensions
    canvasBottom.width = W;
    canvasBottom.height = H;
    canvasTop.width = W;
    canvasTop.height = H;

    const ctxTop = canvasTop.getContext("2d");
    const ctxBottom = canvasBottom.getContext("2d");

    // Step 1: Preload and draw Nathan's photo on bottom canvas BEFORE frame animation
    const photo = new window.Image();
    photo.src = "/images/jack-nathan.jpg";
    await new Promise((resolve) => {
      photo.onload = resolve;
    });

    // Draw black background
    ctxBottom.fillStyle = "#000";
    ctxBottom.fillRect(0, 0, W, H);

    // Draw photo with object-fit: contain
    const photoAspect = photo.naturalWidth / photo.naturalHeight;
    const canvasAspect = W / H;

    let drawW, drawH, drawX, drawY;

    if (photoAspect > canvasAspect) {
      drawW = W;
      drawH = W / photoAspect;
      drawX = 0;
      drawY = (H - drawH) / 2;
    } else {
      drawH = H;
      drawW = H * photoAspect;
      drawX = (W - drawW) / 2;
      drawY = 0;
    }

    ctxBottom.drawImage(
      photo,
      0,
      0,
      photo.naturalWidth,
      photo.naturalHeight,
      drawX,
      drawY,
      drawW,
      drawH
    );
    console.log("About: Nathan photo ready on bottom canvas");

    // Step 2: Play all 181 frames over 3 seconds
    const totalFrames = 181;
    const duration = 3000; // 3 seconds
    const frameDelay = duration / totalFrames; // ~16.6ms per frame

    let currentFrame = 0;

    const playFrames = () => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (currentFrame >= totalFrames) {
            clearInterval(interval);
            resolve();
            return;
          }

          const frameImg = framesRef.current[currentFrame];
          if (frameImg && frameImg.complete) {
            ctxTop.clearRect(0, 0, W, H);
            drawImageCover(ctxTop, frameImg, W, H);
          }

          currentFrame++;
        }, frameDelay);
      });
    };

    // Play frames
    await playFrames();
    console.log("About: Frame sequence complete, starting scan wipe immediately");

    // Step 3: Run scan wipe with last frame (zero delay - bottom canvas already prepared)
    const lastFrame = framesRef.current[totalFrames - 1];
    const progress = { x: 0 };

    gsap.killTweensOf(progress);

    await new Promise((resolve) => {
      gsap.to(progress, {
        x: W,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          const x = progress.x;

          ctxTop.clearRect(0, 0, W, H);

          // Camera visible RIGHT of scan line
          ctxTop.save();
          ctxTop.beginPath();
          ctxTop.rect(x, 0, W - x, H);
          ctxTop.clip();
          drawImageCover(ctxTop, lastFrame, W, H);
          ctxTop.restore();

          // Draw scan line
          ctxTop.save();
          ctxTop.shadowColor = "#2997ff";
          ctxTop.shadowBlur = 20;
          ctxTop.strokeStyle = "#2997ff";
          ctxTop.lineWidth = 2;
          ctxTop.beginPath();
          ctxTop.moveTo(x, 0);
          ctxTop.lineTo(x, H);
          ctxTop.stroke();

          ctxTop.shadowBlur = 5;
          ctxTop.strokeStyle = "#ffffff";
          ctxTop.lineWidth = 1;
          ctxTop.beginPath();
          ctxTop.moveTo(x, 0);
          ctxTop.lineTo(x, H);
          ctxTop.stroke();
          ctxTop.restore();
        },
        onComplete: () => {
          console.log("About: Scan wipe complete");
          resolve();
        },
      });
    });

    // Step 4: Fade out scan line (top canvas opacity 1 → 0)
    await new Promise((resolve) => {
      gsap.to(canvasTop, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          console.log("About: Scan line faded out");
          resolve();
        },
      });
    });

    // Step 5: Hide canvases and reveal photo
    canvasTop.style.display = "none";
    canvasBottom.style.display = "none";
    if (photoImgRef.current) {
      photoImgRef.current.style.opacity = "1";
      photoImgRef.current.style.visibility = "visible";
    }
    console.log("About: Animation complete - canvases hidden, photo revealed");
  };
  const servicesText =
    services.length > 0
      ? services.map((s) => s.title).join(" · ")
      : PLACEHOLDER_SERVICES;

  const trustedByText =
    trustedBy.length > 0
      ? trustedBy.map((t) => t.name).join(" · ")
      : PLACEHOLDER_TRUSTED_BY;

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

        {/* Camera animation */}
        <div className="about-photo" ref={photoWrapperRef}>
          {/* Fallback: Next.js Image (z-index: 0) - hidden until animation completes */}
          <div
            ref={photoImgRef}
            className="about-photo-img-wrapper"
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
          {/* Bottom canvas: Nathan's photo (z-index: 1) */}
          <canvas ref={canvasBottomRef} className="about-canvas-bottom" />
          {/* Top canvas: Camera frames + scan wipe (z-index: 2) */}
          <canvas ref={canvasTopRef} className="about-canvas-top" />
        </div>
      </div>
    </section>
  );
}
