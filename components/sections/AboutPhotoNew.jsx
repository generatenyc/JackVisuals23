"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Client-only component — imported via dynamic({ ssr: false }) in AboutNew.jsx.
// Never server-rendered, so jack-nathan.jpg never appears in initial HTML.
export default function AboutPhotoNew() {
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const framesRef = useRef([]);
  const photoWrapperRef = useRef(null);
  const canvasBottomRef = useRef(null);
  const canvasTopRef = useRef(null);

  // Helper: object-fit: contain, centered with black bars
  const drawImageContain = (ctx, img, canvasW, canvasH) => {
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasW / canvasH;
    let drawW, drawH, drawX, drawY;

    if (imgAspect > canvasAspect) {
      drawW = canvasW;
      drawH = canvasW / imgAspect;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgAspect;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, drawW, drawH);
  };

  // Helper: cover-top with padding — 16px black inset on all sides, anchors to top of image
  const drawPhotoTop = (ctx, img, canvasW, canvasH) => {
    const padding = 16;
    const drawX = padding;
    const drawY = padding;
    const drawW = canvasW - padding * 2;
    const drawH = canvasH - padding * 2;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const areaAspect = drawW / drawH;
    let sx, sy, sw, sh;

    if (imgAspect > areaAspect) {
      sh = img.naturalHeight;
      sw = sh * areaAspect;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / areaAspect;
      sx = 0;
      sy = 0;
    }

    ctx.drawImage(img, sx, sy, sw, sh, drawX, drawY, drawW, drawH);
  };

  // On mount: draw Nathan's photo on bottom canvas and black on top canvas immediately
  useEffect(() => {
    const wrapper = photoWrapperRef.current;
    const canvasBottom = canvasBottomRef.current;
    const canvasTop = canvasTopRef.current;
    if (!wrapper || !canvasBottom || !canvasTop) return;

    const W = wrapper.offsetWidth || 400;
    const H = wrapper.offsetHeight || 600;

    canvasBottom.width = W;
    canvasBottom.height = H;
    canvasTop.width = W;
    canvasTop.height = H;

    // Black fill on top canvas — covers bottom canvas until animation runs
    const ctxTop = canvasTop.getContext("2d");
    ctxTop.fillStyle = "#000";
    ctxTop.fillRect(0, 0, W, H);

    // Draw Nathan's photo on bottom canvas immediately
    const photo = new window.Image();
    photo.src = "/images/jack-nathan.jpg";
    photo.onload = () => {
      const ctx = canvasBottom.getContext("2d");
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      drawPhotoTop(ctx, photo, W, H);
      console.log("AboutPhotoNew: Nathan photo pre-drawn on bottom canvas");
    };
  }, []);

  // Preload all 181 frames on mount
  useEffect(() => {
    const totalFrames = 181;
    const frames = [];
    let loadedCount = 0;

    console.log("AboutPhotoNew: Starting frame preload...");

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalFrames) {
        framesRef.current = frames;
        setFramesLoaded(true);
        console.log(`AboutPhotoNew: All ${totalFrames} frames loaded`);

        // Pre-draw first frame on top canvas, replacing the black fill
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

          const ctxBottom = canvasBottom.getContext("2d");
          ctxBottom.fillStyle = "#000";
          ctxBottom.fillRect(0, 0, W, H);

          const ctxTop = canvasTop.getContext("2d");
          ctxTop.fillStyle = "#000";
          ctxTop.fillRect(0, 0, W, H);
          drawImageContain(ctxTop, frames[0], W, H);

          console.log(`AboutPhotoNew: Canvases pre-sized to ${W}x${H}, first frame drawn`);
        }
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `/videos/frames/frame_${frameNum}.jpg`;
      img.onload = checkAllLoaded;
      img.onerror = () => {
        console.error(`AboutPhotoNew: Failed to load frame ${frameNum}`);
        checkAllLoaded();
      };
      frames.push(img);
    }
  }, []);

  // IntersectionObserver — trigger animation when section visible AND frames loaded.
  // Fallback: if section visible for 10s and frames still haven't loaded, fade out top canvas.
  useEffect(() => {
    if (hasPlayed) return;

    const section = document.querySelector("#new-about-section");
    if (!section) return;

    let visibleSince = null;
    let fallbackTimerId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (framesLoaded && !hasPlayed) {
              // Frames ready — run animation immediately
              console.log("AboutPhotoNew: Section visible, starting animation");
              setHasPlayed(true);
              observer.disconnect();
              if (fallbackTimerId) clearTimeout(fallbackTimerId);
              runAnimation();
            } else if (!framesLoaded && !visibleSince) {
              // Section visible but frames not ready — start 10s fallback timer
              visibleSince = Date.now();
              console.log("AboutPhotoNew: Section visible, frames not yet loaded — starting 10s fallback timer");
              fallbackTimerId = setTimeout(() => {
                if (!hasPlayed) {
                  console.log("AboutPhotoNew: 10s elapsed, frames not loaded — fading out top canvas");
                  setHasPlayed(true);
                  observer.disconnect();
                  const canvasTop = canvasTopRef.current;
                  if (canvasTop) {
                    gsap.to(canvasTop, { opacity: 0, duration: 0.5, onComplete: () => { canvasTop.style.display = "none"; } });
                  }
                }
              }, 10000);
            }
          } else {
            // Section left view — clear the fallback timer
            if (fallbackTimerId) {
              clearTimeout(fallbackTimerId);
              fallbackTimerId = null;
              visibleSince = null;
            }
          }
        });
      },
      { root: null, threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (fallbackTimerId) clearTimeout(fallbackTimerId);
    };
  }, [framesLoaded, hasPlayed]);

  // Main animation sequence
  const runAnimation = async () => {
    const wrapper = photoWrapperRef.current;
    const canvasBottom = canvasBottomRef.current;
    const canvasTop = canvasTopRef.current;

    if (!wrapper || !canvasBottom || !canvasTop) return;

    const W = wrapper.offsetWidth;
    const H = wrapper.offsetHeight;

    console.log(`AboutPhotoNew: Canvas dimensions: ${W}x${H}`);

    canvasBottom.width = W;
    canvasBottom.height = H;
    canvasTop.width = W;
    canvasTop.height = H;

    const ctxTop = canvasTop.getContext("2d");
    const ctxBottom = canvasBottom.getContext("2d");

    // Fill both canvases black immediately after resize to prevent transparent flash
    ctxBottom.fillStyle = "#000";
    ctxBottom.fillRect(0, 0, W, H);
    ctxTop.fillStyle = "#000";
    ctxTop.fillRect(0, 0, W, H);

    // Step 1: Draw Nathan's photo on bottom canvas before frame animation
    const photo = new window.Image();
    photo.src = "/images/jack-nathan.jpg";
    await new Promise((resolve) => {
      photo.onload = resolve;
    });

    ctxBottom.fillStyle = "#000";
    ctxBottom.fillRect(0, 0, W, H);
    drawPhotoTop(ctxBottom, photo, W, H);
    console.log("AboutPhotoNew: Nathan photo ready on bottom canvas");

    // Step 2: Play all 181 frames over 3 seconds
    const totalFrames = 181;
    const duration = 3000;
    const frameDelay = duration / totalFrames;
    let currentFrame = 0;

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (currentFrame >= totalFrames) {
          clearInterval(interval);
          resolve();
          return;
        }

        const frameImg = framesRef.current[currentFrame];
        if (frameImg && frameImg.complete) {
          ctxTop.fillStyle = "#000";
          ctxTop.fillRect(0, 0, W, H);
          drawImageContain(ctxTop, frameImg, W, H);
        }

        currentFrame++;
      }, frameDelay);
    });
    console.log("AboutPhotoNew: Frame sequence complete, starting scan wipe");

    // Step 3: Scan wipe — camera sweeps left revealing Nathan's photo
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

          ctxTop.fillStyle = "#000";
          ctxTop.fillRect(0, 0, W, H);

          // Camera visible RIGHT of scan line
          ctxTop.save();
          ctxTop.beginPath();
          ctxTop.rect(x, 0, W - x, H);
          ctxTop.clip();
          drawImageContain(ctxTop, lastFrame, W, H);
          ctxTop.restore();

          // Scan line glow
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
          console.log("AboutPhotoNew: Scan wipe complete");
          resolve();
        },
      });
    });

    // Step 4: Fade out top canvas
    await new Promise((resolve) => {
      gsap.to(canvasTop, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          console.log("AboutPhotoNew: Scan line faded out");
          resolve();
        },
      });
    });

    // Step 5: Hide top canvas — bottom canvas already shows Nathan's photo
    canvasTop.style.display = "none";
    console.log("AboutPhotoNew: Animation complete - photo revealed via bottom canvas");
  };

  return (
    <div className="an-photo-wrapper" ref={photoWrapperRef}>
      {/* Bottom canvas: Nathan's photo pre-drawn on mount (z-index: 1) */}
      <canvas ref={canvasBottomRef} className="an-canvas-bottom" />
      {/* Top canvas: black fill initially, then frames + scan wipe (z-index: 2) */}
      <canvas ref={canvasTopRef} className="an-canvas-top" />
    </div>
  );
}
