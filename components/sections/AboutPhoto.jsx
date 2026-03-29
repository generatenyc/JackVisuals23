"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Client-only component — imported via dynamic({ ssr: false }) in About.jsx.
// Never server-rendered, so jack-nathan.jpg never appears in initial HTML.
export default function AboutPhoto() {
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const framesRef = useRef([]);
  const photoWrapperRef = useRef(null);
  const canvasBottomRef = useRef(null);
  const canvasTopRef = useRef(null);

  // Helper: object-fit: cover for camera frames
  const drawImageCover = (ctx, img, canvasW, canvasH) => {
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasW / canvasH;
    let sx, sy, sw, sh;

    if (imgAspect > canvasAspect) {
      sh = img.naturalHeight;
      sw = sh * canvasAspect;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
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

    console.log("AboutPhoto: Starting frame preload...");

    // Fallback: if frames don't load in 4 seconds, skip animation
    timeoutId = setTimeout(() => {
      if (!framesLoaded) {
        console.log("AboutPhoto: Frame loading timeout - skipping animation");
      }
    }, 4000);

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalFrames) {
        clearTimeout(timeoutId);
        framesRef.current = frames;
        setFramesLoaded(true);
        console.log(`AboutPhoto: All ${totalFrames} frames loaded`);

        // Size both canvases and draw first frame immediately
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
          drawImageCover(ctxTop, frames[0], W, H);

          console.log(`AboutPhoto: Canvases pre-sized to ${W}x${H}, first frame drawn`);
        }
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `/videos/frames/frame_${frameNum}.jpg`;
      img.onload = checkAllLoaded;
      img.onerror = () => {
        console.error(`AboutPhoto: Failed to load frame ${frameNum}`);
        checkAllLoaded();
      };
      frames.push(img);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  // IntersectionObserver — trigger animation when section is 50% visible
  useEffect(() => {
    if (!framesLoaded || hasPlayed) return;

    const snapContainer = document.querySelector("#snap-container");
    const section = document.querySelector("#sec-about");

    if (!snapContainer || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed && framesLoaded) {
            console.log("AboutPhoto: Section visible, starting animation");
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

    const W = wrapper.offsetWidth;
    const H = wrapper.offsetHeight;

    console.log(`AboutPhoto: Canvas dimensions: ${W}x${H}`);

    canvasBottom.width = W;
    canvasBottom.height = H;
    canvasTop.width = W;
    canvasTop.height = H;

    const ctxTop = canvasTop.getContext("2d");
    const ctxBottom = canvasBottom.getContext("2d");

    // Step 1: Draw Nathan's photo on bottom canvas before frame animation
    const photo = new window.Image();
    photo.src = "/images/jack-nathan.jpg";
    await new Promise((resolve) => {
      photo.onload = resolve;
    });

    ctxBottom.fillStyle = "#000";
    ctxBottom.fillRect(0, 0, W, H);

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
    console.log("AboutPhoto: Nathan photo ready on bottom canvas");

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
          ctxTop.clearRect(0, 0, W, H);
          drawImageCover(ctxTop, frameImg, W, H);
        }

        currentFrame++;
      }, frameDelay);
    });
    console.log("AboutPhoto: Frame sequence complete, starting scan wipe");

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

          ctxTop.clearRect(0, 0, W, H);

          // Camera visible RIGHT of scan line
          ctxTop.save();
          ctxTop.beginPath();
          ctxTop.rect(x, 0, W - x, H);
          ctxTop.clip();
          drawImageCover(ctxTop, lastFrame, W, H);
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
          console.log("AboutPhoto: Scan wipe complete");
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
          console.log("AboutPhoto: Scan line faded out");
          resolve();
        },
      });
    });

    // Step 5: Hide top canvas — bottom canvas already shows Nathan's photo at correct dimensions
    canvasTop.style.display = "none";
    console.log("AboutPhoto: Animation complete - photo revealed via bottom canvas");
  };

  return (
    <div className="about-photo" ref={photoWrapperRef}>
      {/* Bottom canvas: Nathan's photo drawn during animation (z-index: 1) */}
      <canvas
        ref={canvasBottomRef}
        className="about-canvas-bottom"
        style={{ background: "#000", display: "block" }}
      />
      {/* Top canvas: camera frames + scan wipe (z-index: 2) */}
      <canvas
        ref={canvasTopRef}
        className="about-canvas-top"
        style={{ background: "#000", display: "block" }}
      />
    </div>
  );
}
